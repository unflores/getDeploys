import { Router } from 'express'
import * as path from 'path'
import { static as staticPath } from 'express'
import * as basicAuth from 'express-basic-auth'

function buildRoutes(authPassword: string, staticDir: string) {
  const routes = Router()

  routes.use(
    '/assets/',
    staticPath(path.resolve(staticDir))
  )

  routes.use('/api/', (req, res, next) => {
    basicAuth({
      users: { admin: authPassword },
      challenge: true
    })(req, res, next)
  })

  routes.use('/api/', (req, res) => {
    res.send(req.path)
  })

  routes.use('/*', (req, res) => res.sendStatus(404))
  return routes
}

export { buildRoutes }
