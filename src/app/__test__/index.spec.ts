import * as request from 'supertest'
import { buildApp } from '../index'

let app = buildApp({
  httpasswd: 'test',
  staticDir: __dirname
})

describe('app', () => {
  describe('static directories', () => {
    describe('missing file', () => {
      it('returns 404', async () => {

        await request(app)
          .get('/assets/nonexistent-file.js')
          .expect(404)
      })
    })

    describe('existing file', () => {
      it('returns 200', async () => {
        await request(app)
          .get('/assets/exists.js')
          .expect(200)
      })
    })
  })
})
