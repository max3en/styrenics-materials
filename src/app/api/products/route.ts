import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category") || "";
  const brandSlug = searchParams.get("brand") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { type: { contains: search, mode: "insensitive" } },
      { mainApplications: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categorySlug) {
    where.brand = { category: { slug: categorySlug } };
  }

  if (brandSlug) {
    where.brand = { ...where.brand, slug: brandSlug };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: { include: { category: true } }, documents: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role === "VIEWER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { brandId, ...data } = parsed.data;
  const slug = slugify(data.name);

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
      brandId,
    },
    include: { brand: { include: { category: true } } },
  });

  return NextResponse.json(product, { status: 201 });
}
