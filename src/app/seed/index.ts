import * as Occurances from '../models/Occurances'
import { connect, disconnect } from '../lib/database'
import * as dotenv from 'dotenv'

dotenv.config()

if (process.env.NODE_ENV !== 'development') {
  console.log('Seeding only works for development environment.')
  process.exit()
}

new Promise(async (resolve, _reject) => {
  await connect(process.env.dbUrl)

  await Occurances.collection().deleteMany({})
  await Occurances.insertOne({ bucket: '2022-10-10', createdAt: new Date(), type: 'deploy' })

  await disconnect()
  resolve('yass queen')
}).then((results) => console.log(results))

