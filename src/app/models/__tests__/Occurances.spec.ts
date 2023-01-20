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

  describe('#findByType', () => {
    beforeEach(async () => {
      await Occurances.insertOne({ type: 'deploy', createdAt: new Date(), bucket: '2023-11-11' })
      await Occurances.insertOne(
        { type: 'contributer', createdAt: new Date(), bucket: '2023-11-11' }
      )
    })

    it('returns an array of occurances corresponding to the type', async () => {
      const foundRecords = await Occurances.findByType('deploy')
      expect(foundRecords.length).toEqual(1)
      expect(foundRecords[0].type).toEqual('deploy')
    })
  })

  describe('#insertOne', () => {
    describe('when bad type', () => {
      it('throws exception with validation messages', async () => {
        let error

        try {
          await Occurances.insertOne({})
        } catch (e) {
          error = e
        }

        const bucketError = error.details.find((invalid) => invalid.context.label === 'bucket')
        const typeError = error.details.find((invalid) => invalid.context.label === 'type')
        expect(bucketError).toBeTruthy()
        expect(typeError).toBeTruthy()
      })
    })

    describe('when NO date', () => {
      it('defaults to current date', async () => {
        const inserted = await Occurances.insertOne({ type: 'deploy', bucket: '2023-11-11' })
        expect(inserted.createdAt).toBeTruthy()
      })
    })

    it('returns inserted occurance', async () => {
      const document = { type: 'deploy', createdAt: new Date(), bucket: '2023-11-11' }
      const inserted = await Occurances.insertOne(document)
      expect(inserted).toEqual(inserted)
    })

    it('inserts record', async () => {
      await Occurances.insertOne({ type: 'deploy', createdAt: new Date(), bucket: '2023-11-11' })
      const count = await Occurances.collection().countDocuments()
      expect(count).toEqual(1)
    })
  })

  describe('#all', () => {
    beforeEach(async () => {
      await Occurances.insertOne({ type: 'deploy', createdAt: new Date(), bucket: '2023-11-11' })
      await Occurances.insertOne({ type: 'contributer', createdAt: new Date(), bucket: '2023-11-11' })
    })

    it('returns all occurances', async () => {
      const foundRecords = await Occurances.all()
      expect(foundRecords.length).toEqual(2)
    })
  })
})