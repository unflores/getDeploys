import { getDb } from '../lib/database'

function collection() {
  return getDb().collection('occurances')
}

async function insertOne(object) {
  await collection().insertOne(object)
  return object
}

export {
  insertOne,
  collection
}

