import * as dotenv from 'dotenv'
dotenv.config()
import { buildApp } from './src/app'

// import { logger } from './config/logger'
// import app from './src/server'
// import { dbSetup } from './config/mongoose'

// const port = process.env.PORT || '9090'
// dbSetup()

// app.listen(port)

async function start() {
  let app = buildApp({
    httpasswd: process.env.httpasswd,
    staticDir: process.env.staticDir
  })
  app.listen(process.env.listenPort)
}

if (require.main) {
  start()
}

export { start }
