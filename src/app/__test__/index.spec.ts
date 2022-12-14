import * as request from 'supertest'
import { start, stop } from '../index'
import * as path from 'path'
import { Server } from 'http'

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

afterAll(async () => {
  stop(server)
})

const encodedPass = Buffer.from('admin:test').toString('base64')

describe('app', () => {
  describe('static directories', () => {
    describe('missing file', () => {
      it('returns 404', async () => {
        await request(server)
          .get('/assets/nonexistent-file.js')
          .expect(404)
      })
    })

    describe('existing file', () => {
      it('returns 200', async () => {
        await request(server)
          .get('/assets/exists.js')
          .expect(200)
      })
    })
  })

  describe('api', () => {
    it('blocks when no password', async () => {
      await request(server)
        .get('/api')
        .expect(401)
    })

    it('protects permits with password', async () => {
      await request(server)
        .get('/api')
        .set('Authorization', 'Basic ' + encodedPass)
        .expect(200)
    })
  })
})
