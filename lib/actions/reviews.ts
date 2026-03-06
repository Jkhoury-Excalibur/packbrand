'use server';

import { createReview, updateReviewStatus, incrementHelpful, type ReviewStatus } from '../db/reviews';
import { requireAdmin } from '../auth-helpers';

export async function submitReviewAction(data: {
  productId: string;
  author: string;
  company: string;
  rating: number;
  text: string;
}) {
  if (!data.author || !data.text || !data.productId || data.rating < 1 || data.rating > 5) {
    return { error: 'Invalid review data' };
  }
  const id = await createReview(data);
  return { success: true, id: id.toString() };
}

export async function moderateReviewAction(id: string, status: ReviewStatus) {
  await requireAdmin();
  await updateReviewStatus(id, status);
  return { success: true };
}

export async function markHelpfulAction(id: string) {
  await incrementHelpful(id);
  return { success: true };
}
