import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';

// Hand-parse .env.local for the two keys we need so we don't require dotenv-cli
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')];
    }),
);

const uri = process.env.MONGODB_URI || env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE || env.MONGODB_DATABASE;
const email = process.argv[2];

if (!email) {
  console.error('usage: node scripts/inspect-user.mjs <email>');
  process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

const user = await db.collection('user').findOne({ email });
console.log('=== user ===');
if (!user) {
  console.log('(no user doc found for email)');
} else {
  console.log(JSON.stringify(user, null, 2));
  console.log('_id type:', user._id?.constructor?.name, '/ typeof:', typeof user._id);
}

if (user) {
  const accountsByObj = await db.collection('account').find({ userId: user._id }).toArray();
  const accountsByStr = await db.collection('account').find({ userId: String(user._id) }).toArray();
  console.log('\n=== accounts matched by ObjectId userId ===', accountsByObj.length);
  accountsByObj.forEach((a) => console.log(JSON.stringify(a, null, 2)));
  console.log('\n=== accounts matched by string userId ===', accountsByStr.length);
  accountsByStr.forEach((a) => console.log(JSON.stringify(a, null, 2)));
}

const staff = await db.collection('staff').findOne({ email });
console.log('\n=== staff ===');
console.log(staff ? JSON.stringify(staff, null, 2) : '(no staff doc)');

await client.close();
