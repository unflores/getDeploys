import * as Occurances from '../models/Occurances'
import { connect, disconnect } from '../lib/database'
import * as dotenv from 'dotenv'
import { occuranceFactory } from '../models/__tests__/occuranceFactory'

dotenv.config()

if (process.env.NODE_ENV !== 'development') {
  console.log('Seeding only works for development environment.')
  process.exit()
}

const occurancesAtts = [
  { bucket: '2022-10-11', type: 'deploy' },
  { bucket: '2022-10-10', type: 'deploy' },
  { bucket: '2022-10-10', type: 'deploy' },
  { bucket: '2022-10-14', type: 'deploy' },
  { bucket: '2022-10-01', type: 'contributer' },
]

const seedDocs = async () => {
  await connect(process.env.dbUrl, parseInt(process.env.dbSelectionTimeout, 10))
  console.log('Clear db')
  await Occurances.collection().deleteMany({})

  console.log('Start inserting')
  await Promise.all(
    occurancesAtts.map((atts) => Occurances.insertOne(occuranceFactory.build(atts)))
  )

  console.log(`Inserted ${occurancesAtts.length} occurances.`)
  await disconnect()

}

seedDocs().then((results) => console.log(results)).catch((reason) => console.log(reason))
