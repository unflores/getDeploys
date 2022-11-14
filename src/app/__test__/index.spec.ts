import * as request from 'supertest'
import { buildApp } from '../index'
import * as path from 'path'

let app = buildApp({
  httpasswd: 'test',
  staticDir: path.resolve(__dirname, 'assets/'),
  db: {
    name: 'dumb-name',
    url: 'dumb-url'
  }
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
