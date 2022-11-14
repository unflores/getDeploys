import * as express from 'express'
import * as path from 'path'

let app: express.Express

type Config = {
  httpasswd: string
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
  return app
}

export { buildApp }
