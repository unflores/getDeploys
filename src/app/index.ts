import * as express from 'express'
import * as basicAuth from 'express-basic-auth'
import { Server } from 'http'
import * as path from 'path'
import * as db from './lib/database'

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
  }
}

function buildApp(config: Config) {
  const app = express()
  app.use(
    '/assets/',
    express.static(path.resolve(config.server.staticDir))
  )

  db.connect(config.db.url)

  app.use((req, res, next) => {
    if (req.path.match(/api\/*/)) {
      basicAuth({
        users: { admin: config.server.password },
        challenge: true
      })(req, res, next)
    } else {
      next()
    }
  })

  app.use(async (req, res, next) => {
    await res.send(req.path)
  })

  return app
}

async function start(config: Config) {
  const app = buildApp(config)
  return app.listen(config.server.port)
}

async function stop(server: Server) {
  // await app
  server.close()
  db.disconnect()
}

export { buildApp, stop, start }
