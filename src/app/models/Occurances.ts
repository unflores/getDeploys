import { getDb } from '../lib/database'
import * as Joi from 'joi'

const schema = Joi.object({
  type: Joi.string().allow('deploy', 'contributer').only().required(),
  bucket: Joi.string().pattern(/[0-9]{4}-[0-9]{2}-[0-9]{2}/).required(),
  createdAt: Joi.date().default(() => new Date()),
})

function collection() {
  return getDb().collection('occurances')
}

async function insertOne(object: { [k: string]: any }) {
  const insertable = Joi.attempt(object, schema, { abortEarly: false })
  await collection().insertOne(insertable)
  return insertable
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
