import { MongoClient } from 'mongodb'

let db: MongoClient

async function connect(url: string) {
  db = await MongoClient.connect(
    url,
  );
}

async function disconnect() {
  if (!db)
    return

  await db.close()
}

function getDb() {
  return db
}

export {
  connect,
  disconnect,
  getDb,
}
