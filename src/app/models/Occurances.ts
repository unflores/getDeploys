import { getDb } from '../lib/database'
import * as Joi from 'joi'
import { Filter } from 'mongodb'

interface Occurance {
  type: string // 'deploy' | 'contributer',
  bucket: string
  occurredAt: Date
  createdAt: Date
}

const schema = Joi.object({
  type: Joi.string().allow('deploy', 'contributer').only().required(),
  bucket: Joi.string().pattern(/[0-9]{4}-[0-9]{2}-[0-9]{2}/).required(),
  occurredAt: Joi.date().required(),
  createdAt: Joi.date().default(() => new Date()),
})

function collection() {
  return getDb().collection<Occurance>('occurances')
}

async function insertOne(object: { [k: string]: any }) {
  const insertable = Joi.attempt(object, schema, { abortEarly: false })
  await collection().insertOne(insertable)
  return insertable
}

async function findByType(type: string): Promise<Occurance[]> {
  const filter: Filter<Occurance> = { type }
  return await collection().find(filter).toArray()
}

async function all() {
  return await collection().find({}).toArray()
}

export {
  insertOne,
  collection,
  findByType,
  all,
  Occurance
}
