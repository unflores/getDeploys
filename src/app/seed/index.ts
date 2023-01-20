import * as Occurances from '../models/Occurances'
import { connect, disconnect } from '../lib/database'
import * as dotenv from 'dotenv'

dotenv.config()

if (process.env.NODE_ENV !== 'development') {
  console.log('Seeding only works for development environment.')
  process.exit()
}

const occurancesAtts = [
  { bucket: '2022-10-11', createdAt: new Date(), type: 'deploy' },
  { bucket: '2022-10-10', createdAt: new Date(), type: 'deploy' },
  { bucket: '2022-10-10', createdAt: new Date(), type: 'deploy' },
  { bucket: '2022-10-14', createdAt: new Date(), type: 'deploy' },
  { bucket: '2022-10-01', createdAt: new Date(), type: 'contributer' },
]

new Promise(async (resolve, _reject) => {
  await connect(process.env.dbUrl)
  console.log('Clear db')
  await Occurances.collection().deleteMany({})

  console.log('Start inserting')
  await Promise.all(occurancesAtts.map((atts) => Occurances.insertOne(atts)))

  console.log(`Inserted ${occurancesAtts.length} occurances.`)
  await disconnect()
  resolve('Finished')
}).then((results) => console.log(results)).catch((reason) => console.log({ reason }))
