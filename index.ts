import * as dotenv from 'dotenv'
dotenv.config()
import { buildApp } from './src/app'

// import { logger } from './config/logger'
// import app from './src/server'
// import { dbSetup } from './config/mongoose'
// dbSetup()
async function start() {
  let app = buildApp({
    httpasswd: process.env.httpasswd,
    staticDir: process.env.staticDir,
    db: {
      name: process.env.dbName,
      url: process.env.dbUrl
    }
  })
  app.listen(process.env.listenPort)
}

if (require.main) {
  start()
}

export { start }
