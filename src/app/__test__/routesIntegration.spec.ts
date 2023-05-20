import * as request from 'supertest'
import { start, stop } from '../index'
import * as path from 'path'
import { Server } from 'http'
import * as Occurances from '../models/Occurances'
import { occuranceFactory } from '../models/__tests__/occuranceFactory'

let server: Server

beforeAll(async () => {
  server = await start({
    server: {
      port: '8080',
      password: 'test',
      staticDir: path.resolve(__dirname, 'assets/'),
    },
    db: {
      name: 'dumb-name',
      url: 'mongodb://conan:conan@localhost:27017/stats_testing'
    }
  })
})

beforeEach(async () => {
  await Occurances.collection().deleteMany({})
})

afterAll(async () => {
  stop(server)
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

    describe('occurances', () => {

      const getResponse = async () => {
        return await request(server)
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
