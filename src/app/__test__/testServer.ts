import { start as serverStart, stop as serverStop } from '../index'
import * as path from 'path'
import { Server } from 'http'

let server: Server

const start = async () => {
  server = await serverStart({
    server: {
      port: (Math.floor(Math.random() * (9000 - 2000 + 1)) + 2000).toString(),
      password: 'test',
      staticDir: path.resolve(__dirname, 'assets/'),
    },
    db: {
      url: 'mongodb://conan:conan@mongo:27017/stats_testing',
      timeout: 100
    }
  })
}

const stop = async () => {
  await serverStop(server)
}

export {
  start,
  stop,
  server
}
