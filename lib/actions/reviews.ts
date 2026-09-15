'use server';

import { createReview, incrementHelpful } from '../db/reviews';
import { verifyTurnstile, turnstileError } from '../turnstile';

export async function submitReviewAction(data: {
  productId: string;
  author: string;
  company: string;
  rating: number;
  text: string;
}, token?: string) {
  if (!await verifyTurnstile(token, 'review')) return { error: turnstileError };
  if (!data.author || !data.text || !data.productId || data.rating < 1 || data.rating > 5) {
    return { error: 'Invalid review data' };
  }
  const id = await createReview(data);
  return { success: true, id: id.toString() };
}

export async function markHelpfulAction(id: string) {
  await incrementHelpful(id);
  return { success: true };
}
