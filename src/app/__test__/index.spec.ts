import * as request from 'supertest'
import { buildApp } from '../index'
import * as path from 'path'

let app = buildApp({
  password: 'test',
  staticDir: path.resolve(__dirname, 'assets/'),
  db: {
    name: 'dumb-name',
    url: 'mongodb://admin:admin@mongo:27017/counts_test'
  }
})

const encodedPass = Buffer.from('admin:test').toString('base64')

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

  describe('api', () => {
    it('blocks when no password', async () => {
      await request(app)
        .get('/api')
        .expect(401)
    })

    it('protects permits with password', async () => {
      await request(app)
        .get('/api')
        .set('Authorization', 'Basic ' + encodedPass)
        .expect(404)
    })
  })
})
