import { MongoClient } from 'mongodb'

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
      { serverSelectionTimeoutMS: timeout, socketTimeoutMS: timeout }
    )

  } catch (error) {
    if(error instanceof Error) {
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
  return client.db('stats_production')
}

export {
  connect,
  disconnect,
  getDb,
  DatabaseConnectionTimeout
}
