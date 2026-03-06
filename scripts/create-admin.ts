import { config } from 'dotenv';
config({ path: '.env.local' });
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DATABASE!;

async function main() {
  const { hashPassword } = await import('better-auth/crypto');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const email = 'jkhoury@excaliburinteractive.io';
  const password = 'Jhood56!';
  const hashedPassword = await hashPassword(password);

  // Update or fix the account password
  const user = await db.collection('user').findOne({ email });
  if (!user) {
    console.log('User not found — creating...');
    const { randomBytes } = await import('crypto');
    const userId = randomBytes(16).toString('hex');
    const now = new Date();

    await db.collection('user').insertOne({
      id: userId,
      name: 'J Khoury',
      email,
      emailVerified: true,
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    });

    await db.collection('account').insertOne({
      id: randomBytes(16).toString('hex'),
      userId,
      accountId: userId,
      providerId: 'credential',
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    console.log('Admin account created.');
  } else {
    // Fix existing account password
    const userId = user.id;
    await db.collection('user').updateOne(
      { email },
      { $set: { role: 'admin', emailVerified: true } }
    );
    await db.collection('account').updateOne(
      { userId, providerId: 'credential' },
      { $set: { password: hashedPassword } }
    );
    console.log('Admin account password updated with correct hash.');
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
