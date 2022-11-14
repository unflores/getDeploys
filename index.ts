// import { logger } from './config/logger'
// import app from './src/server'
// import { dbSetup } from './config/mongoose'

// const port = process.env.PORT || '9090'
// dbSetup()

// app.listen(port)

async function start() {
  let app = buildApp(config)
  app.listen(process.env.PORT)
}

if (require.main) {
  start()
}

export { start }
