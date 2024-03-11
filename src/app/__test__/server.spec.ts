import * as request from 'supertest'
import * as testServer from './testServer'
import * as Occurances from '../models/Occurances'
import { describe, it, beforeAll, beforeEach, afterAll } from '@jest/globals'

beforeAll(async () => {
  await testServer.start()
})

beforeEach(async () => {
  await Occurances.collection().deleteMany({})
})

afterAll(async () => {
  await testServer.stop()
})

const encodedPass = Buffer.from('admin:test').toString('base64')

describe('app setup', () => {
  describe('static directories', () => {
    describe('missing file', () => {
      it('returns 404', async () => {
        await request(testServer.server)
          .get('/assets/nonexistent-file.js')
          .expect(404)
      })
    })

    describe('existing file', () => {
      it('returns 200', async () => {
        await request(testServer.server).get('/assets/exists.js').expect(200)
      })
    })
  })

  describe('httpass', () => {
    it('blocks when no password', async () => {
      await request(testServer.server).get('/api').expect(401)
    })

    it('protects with password', async () => {
      await request(testServer.server)
        .get('/api')
        .set('Authorization', `Basic ${encodedPass}`)
        .expect(404)
    })
  })
})
