import * as dotenv from 'dotenv'

dotenv.config()
import { start } from './src/app'

if (require.main) {
  start({
    server: {
      password: process.env.password,
      staticDir: process.env.staticDir,
      port: process.env.listenPort
    },
    db: {
      name: process.env.dbName,
      url: process.env.dbUrl,
      timeout: parseInt(process.env.dbSelectionTimeout, 10)
    }

  })
  console.log(`I see you on ${process.env.listenPort}`)
}
