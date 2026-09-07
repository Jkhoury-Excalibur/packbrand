import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';

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
const role = process.argv[3];

if (!email || !role) {
  console.error('usage: node scripts/set-user-role.mjs <email> <role>');
  process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

const result = await db
  .collection('user')
  .updateOne({ email }, { $set: { role, updatedAt: new Date() } });

console.log('matched:', result.matchedCount, 'modified:', result.modifiedCount);

const after = await db.collection('user').findOne({ email }, { projection: { email: 1, role: 1 } });
console.log('after:', after);

await client.close();
