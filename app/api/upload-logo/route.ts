import { NextResponse } from 'next/server';
import { generatePresignedUploadUrl, getPublicUrl } from '@/lib/s3';
import crypto from 'crypto';

const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'image/webp',
  'application/pdf',
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  const { filename, contentType, fileSize } = await request.json();

  if (!filename || !contentType) {
    return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: 'File type not allowed. Please upload PNG, JPG, SVG, WebP, or PDF.' }, { status: 400 });
  }

  if (fileSize && fileSize > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
  }

  const ext = filename.split('.').pop();
  const key = `logos/${crypto.randomUUID()}.${ext}`;

  const { url } = await generatePresignedUploadUrl(key, contentType);

  return NextResponse.json({
    uploadUrl: url,
    key,
    publicUrl: getPublicUrl(key),
  });
}
