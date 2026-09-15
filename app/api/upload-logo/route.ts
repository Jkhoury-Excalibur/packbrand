import { NextResponse } from 'next/server';
import { generatePresignedUploadUrl, getPublicUrl } from '@/lib/s3';
import crypto from 'crypto';
import { z } from 'zod';
import { verifyTurnstile, turnstileError } from '@/lib/turnstile';

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
  const parsed = z.object({ token: z.string().max(2048), files: z.array(z.object({
    filename: z.string().min(1).max(255),
    contentType: z.string().refine(value => ALLOWED_TYPES.includes(value)),
    fileSize: z.number().int().positive().max(MAX_SIZE),
  })).min(1).max(3) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
  if (!await verifyTurnstile(parsed.data.token, 'checkout')) return NextResponse.json({ error: turnstileError }, { status: 403 });
  const uploads = await Promise.all(parsed.data.files.map(async ({ filename, contentType }) => {
    const ext = filename.split('.').pop();
    const key = `logos/${crypto.randomUUID()}.${ext}`;
    const { url } = await generatePresignedUploadUrl(key, contentType);
    return { uploadUrl: url, key, publicUrl: getPublicUrl(key) };
  }));
  return NextResponse.json({ uploads });
}
