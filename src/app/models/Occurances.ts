import { getDb } from '../lib/database'

function collection() {
  return getDb().collection('occurances')
}

async function insertOne(object: { [k: string]: any }) {
  await collection().insertOne(object)
  return object
}

async function findByType(type: string): Promise<{ [k: string]: any }> {
  return await collection().find({ type }).toArray()
}

async function all() {
  return await collection().find({}).toArray()
}

export {
  insertOne,
  collection,
  findByType,
  all
}
