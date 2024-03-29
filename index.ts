import * as dotenv from 'dotenv'

dotenv.config()
import { start } from './src/app'

if (require.main) {
  start({
    server: {
      password: process.env.password,
      staticDir: process.env.staticDir,
      port: process.env.PORT,
    },
    db: {
      url: process.env.dbUrl,
      timeout: parseInt(process.env.dbSelectionTimeout, 10),
    },
  }).catch((error) => console.log(error))

  console.log(`I see you on ${process.env.PORT}`)
}
