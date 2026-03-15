import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DATABASE!;

// Price tiers: $1 for small/simple, $2 for mid, $3 for premium/complex
const PRICING: Record<string, number> = {
  // Mailer Boxes
  'Plain Mailer Boxes': 1,
  'Logo Mailer Boxes': 2,
  'Square Mailer Boxes': 2,
  'Tuck Top Mailer Boxes': 2,
  'Full-Print Mailer Boxes': 3,

  // Shipping Boxes
  'Plain Shipping Boxes': 1,
  'Flat Shipping Boxes': 2,
  'Full-Print Shipping Boxes': 3,

  // Product Boxes
  'Reverse Tuck Boxes': 2,
  'Lock Bottom Boxes': 2,
  'Gable Boxes': 2,
  'Tuck Top Boxes': 3,
  'Auto-Lock Bottom Boxes': 3,

  // Pouches
  'Flat Pouches': 1,
  'Stand-Up Pouches': 2,

  // Poly Mailers
  'Custom Poly Mailers': 1,
  'Compostable Poly Mailers': 2,

  // Shopping Bags
  'To-Go Bags': 1,
  'Die-Cut Handle Bags': 1,
  'Compostable Die-Cut Handle Bags': 2,
  'Kraft Paper Bags': 2,
  'Luxury Shopping Bags': 3,

  // Food & Beverage
  'Coffee Sleeves': 1,
  'Treat Bags': 1,
  'Logo Paper Cups': 1,
  'Food Boxes': 2,
  'Full-Print Paper Cups': 2,

  // Labels & Stickers
  'Sticker Singles': 1,
  'Packaging Stickers': 1,
  'Roll Labels': 2,

  // Accessories
  'Crinkle Paper': 1,
  'Self-Adhesive Packaging Tape': 1,
  'Water-Activated Packaging Tape': 2,
  'Custom Tissue Paper': 2,
  'Hang Tags': 1,
  'Folded Hang Tags': 2,
  'Packaging Inserts': 1,
};

async function updatePricing() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const now = new Date();

  let updated = 0;
  for (const [name, price] of Object.entries(PRICING)) {
    const result = await db.collection('products').updateOne(
      { name },
      { $set: { basePrice: price, updatedAt: now } }
    );
    if (result.modifiedCount > 0) {
      console.log(`  $${price} — ${name}`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} products`);
  await client.close();
}

updatePricing().catch(console.error);
