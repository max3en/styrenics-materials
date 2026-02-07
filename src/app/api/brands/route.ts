import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category") || "";

    const where: any = {};
    if (categorySlug) {
        where.category = { slug: categorySlug };
    }

    const brands = await prisma.brand.findMany({
        where,
        include: {
            category: true,
            _count: { select: { products: true } },
        },
        orderBy: { name: "asc" },
    });

    return NextResponse.json(brands);
}
