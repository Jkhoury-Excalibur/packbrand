import { config } from 'dotenv';
config({ path: '.env.local' });
import { MongoClient } from 'mongodb';
import { createHash, randomBytes, scryptSync } from 'crypto';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DATABASE!;

// Better Auth uses scrypt-based hashing internally
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const email = 'jkhoury@excaliburinteractive.io';
  const password = 'Jhood56!';
  const name = 'J Khoury';

  // Check if user already exists
  const existing = await db.collection('user').findOne({ email });
  if (existing) {
    console.log('User already exists, updating to admin with verified email...');
    await db.collection('user').updateOne(
      { email },
      { $set: { role: 'admin', emailVerified: true } }
    );
    console.log('Done — user promoted to admin.');
    await client.close();
    return;
  }

  const now = new Date();
  const userId = randomBytes(16).toString('hex');

  // Create user document (Better Auth schema)
  await db.collection('user').insertOne({
    id: userId,
    name,
    email,
    emailVerified: true,
    role: 'admin',
    createdAt: now,
    updatedAt: now,
  });

  // Create account/credential document (Better Auth stores passwords here)
  const hashedPassword = hashPassword(password);
  await db.collection('account').insertOne({
    id: randomBytes(16).toString('hex'),
    userId,
    accountId: userId,
    providerId: 'credential',
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  console.log(`Admin account created: ${email}`);
  console.log('You can now log in at /admin/login');

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
