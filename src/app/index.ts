import * as express from 'express'
import * as path from 'path'
import * as db from './lib/database'
import * as basicAuth from 'express-basic-auth'

let app: express.Express

type Config = {
  password: string
  staticDir: string
  db: {
    name: string
    url: string
  }
}

function buildApp(config: Config) {
  app = express()
  app.use(
    '/assets/',
    express.static(path.resolve(config.staticDir))
  )

  db.connect(config.db.url)

  app.use((req, res, next) => {
    if (req.path.match(/api\/*/)) {
      basicAuth({
        users: { admin: config.password },
        challenge: true
      })(req, res, next)
    } else {
      next()

    }
  })

  return app
}

export { buildApp }
