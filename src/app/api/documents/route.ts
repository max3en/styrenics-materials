import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const categoryId = searchParams.get("categoryId");
  const docType = searchParams.get("docType");

  const where: any = {};
  if (productId) where.productId = productId;
  if (categoryId) where.categoryId = categoryId;
  if (docType) where.docType = docType;

  const documents = await prisma.document.findMany({
    where,
    include: {
      product: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(documents);
}
