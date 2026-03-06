import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { generatePresignedUploadUrl, getPublicUrl } from '@/lib/s3';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { filename, contentType } = await request.json();
  const ext = filename.split('.').pop();
  const key = `products/${crypto.randomUUID()}.${ext}`;

  const { url } = await generatePresignedUploadUrl(key, contentType);

  return NextResponse.json({
    uploadUrl: url,
    key,
    publicUrl: getPublicUrl(key),
  });
}
