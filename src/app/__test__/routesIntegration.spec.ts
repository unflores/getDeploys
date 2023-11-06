import * as request from 'supertest'
import * as testServer from './testServer'
import * as Occurances from '../models/Occurances'
import { occuranceFactory } from '../models/__tests__/occuranceFactory'

beforeAll(async () => {
  await testServer.start()
})

beforeEach(async () => {
  await Occurances.collection().deleteMany({})
})

afterAll(async () => {
  testServer.stop()
})

const encodedPass = Buffer.from('admin:test').toString('base64')

describe('integration', () => {
  describe('api', () => {
    beforeEach(async () => {
      const occuranceParams = [
        { type: 'deploy', bucket: '2022-10-20' },
        { type: 'deploy', bucket: '2022-10-19' },
        { type: 'contributer', bucket: '2022-10-19' },
      ]

      for (const params of occuranceParams) {
        await Occurances.insertOne(occuranceFactory.build(params))
      }
    })

    describe('GET occurances', () => {
      const getResponse = async () => {
        return await request(testServer.server)
          .get('/api/occurances/deploy')
          .set('Authorization', `Basic ${encodedPass}`)
      }

      it('returns occurances', async () => {
        const response = await getResponse()
        const count = response.body['2022-10-19']
        expect(response.status).toEqual(200)
        expect(count).toEqual(1)
      })
    })

    describe('POST occurances', () => {
      const getResponse = async () => {
        return await request(testServer.server)
          .get('/api/occurances/deploy')
          .set('Authorization', `Basic ${encodedPass}`)
      }

      it('returns occurances', async () => {
        const response = await getResponse()
        const count = response.body['2022-10-19']
        expect(response.status).toEqual(200)
        expect(count).toEqual(1)
      })
    })

  })
})
