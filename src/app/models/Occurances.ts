import { getDb } from '../lib/database'
import * as Joi from 'joi'
import {ValidationError} from 'joi'
import { Filter } from 'mongodb'
import { build } from '../../../lib/dateLib'

interface Occurance {
  type: string // 'deploy' | 'contributer',
  bucket: string
  occurredAt: Date
  createdAt: Date
}

const schema = Joi.object<Occurance>({
  type: Joi.string().allow('deploy', 'contributer').only().required(),
  bucket: Joi.string().pattern(/[0-9]{4}-[0-9]{2}-[0-9]{2}/).required(),
  occurredAt: Joi.date().required(),
  createdAt: Joi.date().default(() => new Date()),
})

const collectionSchema = Joi.array<Occurance[]>().items(schema).min(1)

function collection() {
  return getDb().collection<Occurance>('occurances')
}

async function insertOne(object: { [k: string]: any }) {
  const insertable = Joi.attempt(object, schema, { abortEarly: false })
  await collection().insertOne(insertable)
  return insertable
}

/** this is silly, but the original solution was made to go straight into a graph, so the import
 *  was formatted for output as it was imported. Right now, I just want to be able to display the
 * original graph on a site so I'll use the original input for the time being.
 *
 * This function will take a bucket like so: {'2021-01': 2} and turn it into 2 occurances.
 */
async function importJsonOccurances(type: string, legacyOccurances: { [k: string]: number}) {
  const occurances = Object.entries(legacyOccurances)
      .map(([bucket, times]) => {
        return Array.from(
          {length: times}, () => ({
          type,
          bucket: bucket + '-01', // Just default to day one
          occurredAt: build(bucket).toDate()
        }))
      }).flat()
  console.log(occurances)
  const insertables = Joi.attempt(occurances, collectionSchema, { abortEarly: false })
  await collection().insertMany(insertables)
  return insertables
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
  importJsonOccurances,
  collection,
  findByType,
  all,
  Occurance,
  ValidationError
}
