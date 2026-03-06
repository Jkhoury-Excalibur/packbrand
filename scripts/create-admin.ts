import { config } from 'dotenv';
config({ path: '.env.local' });
import { MongoClient, ObjectId } from 'mongodb';

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

  const user = await db.collection('user').findOne({ email });
  if (!user) {
    console.log('User not found — creating...');
    const now = new Date();
    const userId = new ObjectId();

    await db.collection('user').insertOne({
      _id: userId,
      name: 'J Khoury',
      email,
      emailVerified: true,
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    });

    await db.collection('account').insertOne({
      _id: new ObjectId(),
      userId: userId,
      accountId: userId.toHexString(),
      providerId: 'credential',
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    console.log('Admin account created.');
  } else {
    const userId = user._id;
    await db.collection('user').updateOne(
      { email },
      { $set: { role: 'admin', emailVerified: true } }
    );
    await db.collection('account').updateOne(
      { userId, providerId: 'credential' },
      { $set: { password: hashedPassword } }
    );
    console.log('Admin account password updated.');
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
