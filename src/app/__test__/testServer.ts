import { start as serverStart, stop as serverStop } from '../index'
import * as path from 'path'
import { Server } from 'http'

let server: Server

const start = async () => {
  server = await serverStart({
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
}

const stop = async () => {
  serverStop(server)
}

export {
  start,
  stop,
  server
}
