import { connect, disconnect } from '../../lib/database'
import * as Occurances from '../Occurances'
import { occuranceFactory } from './occuranceFactory'
import {describe, beforeAll, beforeEach, it, expect, afterAll} from '@jest/globals'

describe('Occurance', () => {
  beforeAll(async () => {
    await connect('mongodb://conan:conan@mongo:27017/stats_testing', 100)
  })
  beforeEach(async () => {
    await Occurances.collection().deleteMany({})
  })
  afterAll(async () => {
    await disconnect()
  })

  describe('#importJsonOccurances', () => {
    describe('when occurances empty', () => {
      it('throws exception with validation messages', async () => {
        let error: Occurances.ValidationError

        try {
          await Occurances.importJsonOccurances('', {})
        } catch (e) {
          error = e as Occurances.ValidationError
        }
        expect(error.details).toBeDefined()
      })
    })

    describe('when invalid', () => {
      it('throws exception with validation messages', async () => {
        let error: Occurances.ValidationError

        try {
          await Occurances.importJsonOccurances('invalid_type', {'2023-10': 3})
        } catch (e) {
          error = e as Occurances.ValidationError
        }
        expect(error.details).toBeDefined()
      })

    })

    it('returns inserted occurances', async () => {
      const inserted = await Occurances.importJsonOccurances('deploy', {'2023-01': 2})
      inserted.map((doc) => expect(doc.type).toEqual('deploy'))
      inserted.map((doc) => expect(doc.bucket).toEqual('2023-01-01'))
      inserted.map((doc) => expect(doc).toHaveProperty('occurredAt'))
      inserted.map((doc) => expect(doc).toHaveProperty('createdAt'))
      inserted.map((doc) => expect(doc).toHaveProperty('_id'))
      expect(inserted.length).toEqual(2)
    })

  })

  describe('#findByType', () => {
    beforeEach(async () => {
      await Occurances.insertOne(occuranceFactory.build({ type: 'deploy' }))
      await Occurances.insertOne(occuranceFactory.build({ type: 'contributer' }))
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
        let error: Occurances.ValidationError

        try {
          await Occurances.insertOne({})
        } catch (e) {
          error = e as Occurances.ValidationError
        }

        const bucketError = error.details.find((invalid) => invalid.context.label === 'bucket')
        const typeError = error.details.find((invalid) => invalid.context.label === 'type')
        expect(bucketError).toBeTruthy()
        expect(typeError).toBeTruthy()
      })
    })

    describe('when NO date', () => {
      it('defaults to current date', async () => {
        const inserted = await Occurances.insertOne(
          occuranceFactory.build({ createdAt: undefined })
        )
        expect(inserted.createdAt).toBeTruthy()
      })
    })

    it('returns inserted occurance', async () => {
      const document = occuranceFactory.build()
      const inserted = await Occurances.insertOne(document)
      expect(inserted.bucket).toEqual(document.bucket)
      expect(inserted.createdAt).toEqual(document.createdAt)
      expect(inserted.occurredAt).toEqual(document.occurredAt)
      expect(inserted.type).toEqual(document.type)
      expect(inserted).toHaveProperty('_id');

    })

    it('inserts record', async () => {
      await Occurances.insertOne(occuranceFactory.build())
      const count = await Occurances.collection().countDocuments()
      expect(count).toEqual(1)
    })
  })

  describe('#all', () => {
    beforeEach(async () => {
      await Occurances.insertOne(occuranceFactory.build({ type: 'deploy' }))
      await Occurances.insertOne(occuranceFactory.build({ type: 'contributer' }))
    })

    it('returns all occurances', async () => {
      const foundRecords = await Occurances.all()
      expect(foundRecords.length).toEqual(2)
    })
  })
})
