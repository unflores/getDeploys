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
  console.log(path.resolve(config.staticDir, 'assets'))
  app.use(
    '/assets/',
    express.static(path.resolve(config.staticDir, 'assets'))
  )
  return app
}

export { buildApp }
