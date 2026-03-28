import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { uploadFile, getSignedUploadUrl } from "@/lib/services/file-service";

// ---------------------------------------------------------------------------
// POST /api/uploads — handle file upload via FormData
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "covers";

  if (!file) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400 }
    );
  }

  const validFolders = ["covers", "audio", "banners", "contracts", "avatars"];
  if (!validFolders.includes(folder)) {
    return NextResponse.json(
      { error: `Invalid folder. Must be one of: ${validFolders.join(", ")}` },
      { status: 400 }
    );
  }

  // Enforce reasonable size limits (50 MB)
  const MAX_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 50 MB." },
      { status: 413 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFile(buffer, file.name, file.type, folder);

    return NextResponse.json({
      success: true,
      url,
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "File upload failed" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET /api/uploads — get a signed upload URL for client-side uploads
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("fileName");
  const contentType = searchParams.get("contentType");
  const folder = searchParams.get("folder") || "covers";

  if (!fileName || !contentType) {
    return NextResponse.json(
      { error: "fileName and contentType are required" },
      { status: 400 }
    );
  }

  const validFolders = ["covers", "audio", "banners", "contracts", "avatars"];
  if (!validFolders.includes(folder)) {
    return NextResponse.json(
      { error: `Invalid folder. Must be one of: ${validFolders.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const result = await getSignedUploadUrl(fileName, contentType, folder);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Signed URL error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
