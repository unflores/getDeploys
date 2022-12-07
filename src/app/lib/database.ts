import { MongoClient, MongoServerSelectionError } from 'mongodb'

class DatabaseConnectionTimeout extends Error {
  constructor(msg, stack) {
    super(msg)
    this.stack = stack
  }
}

let db: MongoClient

async function connect(url: string) {
  try {
    db = await MongoClient.connect(
      url,
      { serverSelectionTimeoutMS: 100, socketTimeoutMS: 30 }
    )
  } catch (error) {
    if (error instanceof MongoServerSelectionError) {
      throw new DatabaseConnectionTimeout('Failed connection', error.stack)
    }
  }
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
  DatabaseConnectionTimeout
}
