import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role === "VIEWER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const docType = formData.get("docType") as string;
  const productId = formData.get("productId") as string | null;
  const categoryId = formData.get("categoryId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!docType || !["TDS", "SDS", "REGULATORY"].includes(docType)) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
  }

  if (!productId && !categoryId) {
    return NextResponse.json(
      { error: "Either productId or categoryId is required" },
      { status: 400 }
    );
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not configured");
      return NextResponse.json({ error: "Storage not configured. Please check BLOB_READ_WRITE_TOKEN." }, { status: 500 });
    }

    const blob = await put(`documents/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    const document = await prisma.document.create({
      data: {
        name: file.name.replace(/\.[^.]+$/, ""),
        fileName: file.name,
        blobUrl: blob.url,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
        docType: docType as any,
        productId: productId || null,
        categoryId: categoryId || null,
        uploadedBy: session.user.id,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

