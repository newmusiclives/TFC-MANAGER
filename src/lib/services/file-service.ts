// ---------------------------------------------------------------------------
// File Upload Service (S3-compatible with local fallback)
// ---------------------------------------------------------------------------

import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const S3_ENDPOINT = process.env.S3_ENDPOINT || "";
const S3_REGION = process.env.S3_REGION || "us-east-1";
const S3_BUCKET = process.env.S3_BUCKET || "truefans-uploads";
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || "your-access-key";
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || "your-secret-key";

const VALID_FOLDERS = ["covers", "audio", "banners", "contracts", "avatars"] as const;
type UploadFolder = (typeof VALID_FOLDERS)[number];

const LOCAL_UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

function isLocalMode(): boolean {
  return S3_ACCESS_KEY.includes("your-") || S3_SECRET_KEY.includes("your-");
}

function getS3Client(): S3 {
  const config: S3.ClientConfiguration = {
    region: S3_REGION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
    s3ForcePathStyle: true,
  };

  if (S3_ENDPOINT) {
    config.endpoint = S3_ENDPOINT;
  }

  return new S3(config);
}

function generateKey(fileName: string, folder: string): string {
  const ext = path.extname(fileName);
  const hash = crypto.randomBytes(8).toString("hex");
  const safeName = path
    .basename(fileName, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 64);
  return `${folder}/${safeName}_${hash}${ext}`;
}

// ---------------------------------------------------------------------------
// Local filesystem helpers
// ---------------------------------------------------------------------------

function ensureLocalDir(folder: string): string {
  const dir = path.join(LOCAL_UPLOAD_DIR, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// ---------------------------------------------------------------------------
// uploadFile
// ---------------------------------------------------------------------------

export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string
): Promise<string> {
  if (!VALID_FOLDERS.includes(folder as UploadFolder)) {
    throw new Error(
      `Invalid folder "${folder}". Must be one of: ${VALID_FOLDERS.join(", ")}`
    );
  }

  const key = generateKey(fileName, folder);

  if (isLocalMode()) {
    const dir = ensureLocalDir(folder);
    const localPath = path.join(dir, path.basename(key));
    fs.writeFileSync(localPath, file);
    return `/uploads/${folder}/${path.basename(key)}`;
  }

  const s3 = getS3Client();
  await s3
    .putObject({
      Bucket: S3_BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: "public-read",
    })
    .promise();

  return getFileUrl(key);
}

// ---------------------------------------------------------------------------
// deleteFile
// ---------------------------------------------------------------------------

export async function deleteFile(fileUrl: string): Promise<void> {
  if (isLocalMode()) {
    // fileUrl looks like /uploads/covers/filename.jpg
    const localPath = path.join(process.cwd(), fileUrl);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    return;
  }

  // Extract key from full URL
  const s3 = getS3Client();
  const url = new URL(fileUrl);
  const key = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;

  await s3
    .deleteObject({
      Bucket: S3_BUCKET,
      Key: key,
    })
    .promise();
}

// ---------------------------------------------------------------------------
// getSignedUploadUrl
// ---------------------------------------------------------------------------

export async function getSignedUploadUrl(
  fileName: string,
  contentType: string,
  folder: string
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  if (!VALID_FOLDERS.includes(folder as UploadFolder)) {
    throw new Error(
      `Invalid folder "${folder}". Must be one of: ${VALID_FOLDERS.join(", ")}`
    );
  }

  const key = generateKey(fileName, folder);

  if (isLocalMode()) {
    // In local mode, return a URL pointing to the server upload endpoint
    return {
      uploadUrl: `/api/uploads?key=${encodeURIComponent(key)}`,
      key,
      publicUrl: `/uploads/${folder}/${path.basename(key)}`,
    };
  }

  const s3 = getS3Client();
  const uploadUrl = await s3.getSignedUrlPromise("putObject", {
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
    Expires: 3600, // 1 hour
    ACL: "public-read",
  });

  return {
    uploadUrl,
    key,
    publicUrl: getFileUrl(key),
  };
}

// ---------------------------------------------------------------------------
// getFileUrl
// ---------------------------------------------------------------------------

export function getFileUrl(key: string): string {
  if (isLocalMode()) {
    return `/uploads/${key}`;
  }

  if (S3_ENDPOINT) {
    return `${S3_ENDPOINT}/${S3_BUCKET}/${key}`;
  }

  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}
