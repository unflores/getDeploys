import { static as staticPath, Router } from 'express'
import * as path from 'path'
import * as basicAuth from 'express-basic-auth'
import * as Occurances from '../models/Occurances'

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

  routes.use('/api/occurances/*', async (req, res) => {
    res.contentType('json')
    if (req.params[0] === undefined) {
      return res.send('{}')
    }

    const type = req.params[0].replace(/[^a-z]/gi, '') as string
    const occurances = (await Occurances.findByType(type)).reduce(
      (results, doc) => {
        results[doc.bucket] === undefined ? results[doc.bucket] = 1 : results[doc.bucket] += 1
        return results
      },
      {}
    )

    res.send(occurances)
  })

  routes.use('/*', (req, res) => res.sendStatus(404))
  return routes
}

const asyncRoute = route: Promise => (req, res, next = console.error) =>
  Promise.resolve(route(req, res)).catch(next)

export { buildRoutes }
