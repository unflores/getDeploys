import * as express from 'express'
import * as path from 'path'

let app

type Config = {
  httpasswd: string
  staticDir: string
}

// import * as express from 'express';

function buildApp(config: Config) {
  app = express()
  app.use(
    '/assets/',
    express.static(path.resolve(config.staticDir))
  )
  return app
}

export { buildApp }
