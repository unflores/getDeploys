import {
  static as staticPath,
  Router,
  Request,
  Response,
  NextFunction,
} from 'express'
import * as path from 'path'
import * as basicAuth from 'express-basic-auth'
import * as Occurances from '../models/Occurances'

function buildRoutes(authPassword: string, staticDir: string) {
  const routes = Router()

  routes.use('/assets/', staticPath(path.resolve(staticDir)))

  routes.use('/api/', (req, res, next) => {
    basicAuth({
      users: { admin: authPassword },
      challenge: true,
    })(req, res, next)
  })

  type RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void
  type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>

  const runAsync = (callback: AsyncRequestHandler) => {
    const requestHandler: RequestHandler = (req, res, next) => {
      callback(req, res, next).catch(next)
    }
    return requestHandler
  }

  routes.get(
    '/api/occurances/*',
    runAsync(async (req: Request, res: Response) => {
      res.contentType('json')
      if (req.params[0] === undefined) {
        res.send('{}')
        return
      }

      const type = req.params[0].replace(/[^a-z]/gi, '')
      const occurances = (await Occurances.findByType(type)).reduce<{
        [k: string]: number
      }>((results, doc) => {
        results[doc.bucket] =
          results[doc.bucket] === undefined ? 1 : results[doc.bucket] + 1
        return results
      }, {})

      res.send(occurances)
    }),
  )

  routes.use('/*', (req, res) => res.sendStatus(404))
  return routes
}

export { buildRoutes }
