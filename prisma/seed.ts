import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";
import path from "path";

const prisma = new PrismaClient();

// ─── Excel Group Definitions ─────────────────────────────────

interface GroupDef {
  categoryName: string;
  categorySlug: string;
  brandPattern: RegExp; // matches the brand header row
  mapRow: (row: string[]) => Record<string, any>;
}

const GROUPS: GroupDef[] = [
  {
    // ABS group: Impressio® ABS, Sinkral®, Versalis Revive® ABS
    categoryName: "ABS",
    categorySlug: "abs",
    brandPattern: /Styrenics \/ ABS \//,
    mapRow: (cols) => ({
      name: cols[0],
      vicatSofteningTemp: parseNum(cols[1]),
      izodImpact: parseNum(cols[2]),
      type: cols[3] || null,
      mfi220_10: parseNum(cols[4]),
      mainApplications: cols[5] || null,
    }),
  },
  {
    // SAN group: Kostil®
    categoryName: "SAN",
    categorySlug: "san",
    brandPattern: /Styrenics \/ SAN \//,
    mapRow: (cols) => ({
      name: cols[0],
      type: cols[1] || null,
      mfi220_10: parseNum(cols[2]),
      charpyImpact: parseNum(cols[3]),
      vicatTemp: parseNum(cols[4]),
      mainApplications: cols[5] || null,
    }),
  },
  {
    // GPPS-HIPS group: Edistir®, Impressio® HIPS, Versalis Revive® PS
    categoryName: "GPPS-HIPS",
    categorySlug: "gpps-hips",
    brandPattern: /Styrenics \/ GPPS-HIPS \//,
    mapRow: (cols) => ({
      name: cols[0],
      mfi200_5: parseNum(cols[1]),
      vicatTemp: parseNum(cols[2]),
      izodImpact: parseNum(cols[3]),
      type: cols[4] || null,
      mainApplications: cols[5] || null,
    }),
  },
  {
    // PS-PE group: Koblend® (PS-PE)
    categoryName: "PS-PE",
    categorySlug: "ps-pe",
    brandPattern: /Styrenics \/ PS-PE \//,
    mapRow: (cols) => ({
      name: cols[0],
      mfi200_5: parseNum(cols[1]),
      izodImpact: parseNum(cols[2]),
      vicatATemp: parseNum(cols[3]),
      type: cols[4] || null,
      mainApplications: cols[5] || null,
    }),
  },
  {
    // PC-ABS group: Koblend® (PC-ABS)
    categoryName: "PC-ABS",
    categorySlug: "pc-abs",
    brandPattern: /Styrenics \/ PC-ABS \//,
    mapRow: (cols) => ({
      name: cols[0],
      mfi260_5: parseNum(cols[1]),
      izodImpact: parseNum(cols[2]),
      type: cols[3] || null,
      vicatB120Temp: parseNum(cols[4]),
      mainApplications: cols[5] || null,
    }),
  },
  {
    // EPS group: Extir®, Versalis Revive® EPS
    categoryName: "EPS & EPS MC",
    categorySlug: "eps",
    brandPattern: /Styrenics \/ EPS/,
    mapRow: (cols) => ({
      name: cols[0],
      type: cols[1] || null,
      particleSizeRange: cols[2] || null,
      blowingAgent: cols[3] || null,
      densityRange: cols[4] || null,
      mainApplications: cols[5] || null,
    }),
  },
];

// ─── Helpers ─────────────────────────────────────────────────

function parseNum(val: string | undefined): number | null {
  if (!val || val === "-" || val === "—") return null;
  // Handle Excel serial dates (e.g. 45779 instead of actual numbers)
  const num = parseFloat(val);
  if (isNaN(num)) return null;
  // Excel serial dates are typically > 40000, real MFI/Impact values are < 1000
  if (num > 1000) return null;
  return num;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[®™©]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractBrandName(headerText: string): string {
  // "Styrenics / ABS / Sinkral®" → "Sinkral"
  // "Styrenics / GPPS-HIPS / Versalis Revive®" → "Versalis Revive"
  // "Styrenics / EPS & EPS MC / Extir®" → "Extir"
  // "Styrenics / GPPS-HIPS / Versalis Revive® PS" → "Versalis Revive PS"
  const parts = headerText.split("/").map((s) => s.trim());
  const brand = parts[parts.length - 1] || parts[1] || headerText;
  return brand.replace(/[®™©]/g, "").trim();
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@versalis.eni.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      password: await bcrypt.hash(adminPassword, 12),
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // 2. Parse Excel
  const excelPath = path.join(
    process.cwd(),
    "#Complete_Styrenics_Products_Overview.xlsx"
  );
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData: string[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  console.log(`📊 Parsed ${rawData.length} rows from Excel`);

  // 3. Process rows - identify groups and products
  let currentCategory: string | null = null;
  let currentBrand: string | null = null;
  let currentGroupDef: GroupDef | null = null;
  let skipNextRow = false; // skip column header rows

  const categoryCache: Record<string, string> = {}; // slug -> id
  const brandCache: Record<string, string> = {}; // slug -> id
  let productCount = 0;

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    const firstCell = (row[0] || "").toString().trim();

    // Skip empty rows
    if (!firstCell) continue;

    // Check if this is a group header (e.g. "Styrenics / ABS / Sinkral®")
    const isGroupHeader = firstCell.startsWith("Styrenics /");
    if (isGroupHeader) {
      // Find matching group definition
      const matchingGroup = GROUPS.find((g) => g.brandPattern.test(firstCell));
      if (matchingGroup) {
        currentGroupDef = matchingGroup;
        currentCategory = matchingGroup.categorySlug;
        currentBrand = extractBrandName(firstCell);

        // Ensure category exists
        if (!categoryCache[matchingGroup.categorySlug]) {
          const cat = await prisma.category.upsert({
            where: { slug: matchingGroup.categorySlug },
            update: {},
            create: {
              name: matchingGroup.categoryName,
              slug: matchingGroup.categorySlug,
            },
          });
          categoryCache[matchingGroup.categorySlug] = cat.id;
          console.log(`  📁 Category: ${matchingGroup.categoryName}`);
        }

        // Ensure brand exists
        const brandSlug = slugify(currentBrand);
        if (!brandCache[brandSlug]) {
          const brand = await prisma.brand.upsert({
            where: { slug: brandSlug },
            update: {},
            create: {
              name: currentBrand,
              slug: brandSlug,
              categoryId: categoryCache[matchingGroup.categorySlug],
            },
          });
          brandCache[brandSlug] = brand.id;
          console.log(`    🏷️  Brand: ${currentBrand}`);
        }

        skipNextRow = true; // next row is column headers
      }
      continue;
    }

    // Skip column header rows (e.g. "Product name, Vicat, ...")
    if (skipNextRow && firstCell.toLowerCase().startsWith("product name")) {
      skipNextRow = false;
      continue;
    }

    // Skip if no group context
    if (!currentGroupDef || !currentBrand) continue;

    // This should be a product row
    const productName = firstCell;
    if (!productName || productName.toLowerCase() === "product name") continue;

    const brandSlug = slugify(currentBrand);
    const brandId = brandCache[brandSlug];
    if (!brandId) continue;

    try {
      const mapped = currentGroupDef.mapRow(row.map(String));
      const prodSlug = slugify(productName);

      // Avoid duplicate slugs
      const existing = await prisma.product.findUnique({
        where: { slug: prodSlug },
      });
      if (existing) {
        console.log(`    ⏭️  Skipping duplicate: ${productName}`);
        continue;
      }

      const { name, ...properties } = mapped;

      await prisma.product.create({
        data: {
          name: productName,
          slug: prodSlug,
          brandId,
          ...properties,
        },
      });
      productCount++;
      console.log(`    ✅ ${productName}`);
    } catch (e: any) {
      console.error(`    ❌ Error seeding ${productName}: ${e.message}`);
    }
  }

  console.log(`\n🎉 Seed complete! ${productCount} products created.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
