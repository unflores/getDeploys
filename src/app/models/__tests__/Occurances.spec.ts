import { connect, disconnect } from '../../lib/database'
import * as Occurances from '../Occurances'

describe('Occurance', () => {
  beforeAll(async () => {
    await connect('mongodb://conan:conan@localhost:27017/stats_testing')
  })
  beforeEach(async () => {
    await Occurances.collection().deleteMany({})
  })
  afterAll(async () => {
    await disconnect()
  })
  xdescribe('#findByType', () => {
    it('returns an array of occurances corresponding to the type', async () => {

    })
  })

  describe('#insertOne', () => {
    it('returns inserted occurance', async () => {
      const document = { createdAt: new Date(), bucket: '2023-11-11' }
      const inserted = await Occurances.insertOne(document)
      expect(inserted).toEqual(inserted)
    })

    it('inserts record', async () => {
      await Occurances.insertOne({ createdAt: new Date(), bucket: '2023-11-11' })
      const count = await Occurances.collection().countDocuments()
      expect(count).toEqual(1)
    })
  })

  xdescribe('#all', () => {
    it('returns all occurances', async () => {

    })
  })
})
