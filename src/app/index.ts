import * as express from 'express'

import { Server } from 'http'
import * as db from './lib/database'
import { buildRoutes } from './router'

// let app: express.Express

interface Config {
  server: {
    password: string
    staticDir: string
    port: string
  }
  db: {
    name: string
    url: string
    timeout: number
  }
}

async function buildApp(config: Config) {
  const app = express()

  await db.connect(config.db.url, config.db.timeout)

  const { password, staticDir } = config.server
  app.use(buildRoutes(password, staticDir))

  return app
}

async function start(config: Config) {
  const app = await buildApp(config)
  const server = app.listen(config.server.port)
  return server
}

async function stop(server: Server) {
  // await app
  server.close()
  await db.disconnect()
}

export { buildApp, stop, start }
