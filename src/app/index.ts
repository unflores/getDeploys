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

async function buildApp(config: Config) {
  const app = express()
  app.use(
    '/assets/',
    express.static(path.resolve(config.server.staticDir))
  )

  await db.connect(config.db.url)

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
    if (req.path.match(/api\/*/)) {
      await res.send(req.path)
    } else {
      await res.sendStatus(404)
    }
  })

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
