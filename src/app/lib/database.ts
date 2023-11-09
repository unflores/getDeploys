import { MongoClient, MongoServerSelectionError } from 'mongodb'

class DatabaseConnectionTimeout extends Error {
  constructor(msg: string, stack: string) {
    super(msg)
    this.stack = stack
  }
}

let client: MongoClient

async function connect(url: string, timeout: number) {
  try {
    client = await MongoClient.connect(
      url,
      { serverSelectionTimeoutMS: timeout, socketTimeoutMS: 30 }
    )

  } catch (error) {
    if (error instanceof MongoServerSelectionError) {
      throw new DatabaseConnectionTimeout('Failed connection', error.stack)
    }
  }
}

async function disconnect() {
  if (!client) {
    return
  }

  await client.close()
}

function getDb() {
  return client.db()
}

export {
  connect,
  disconnect,
  getDb,
  DatabaseConnectionTimeout
}
