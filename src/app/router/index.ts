import { static as staticPath, Router } from 'express'
import * as path from 'path'
import * as fileUpload from 'express-fileupload'
import * as basicAuth from 'express-basic-auth'
import * as Occurances from '../models/Occurances'

function buildRoutes(authPassword: string, staticDir: string) {
  const routes = Router()

  routes.use(
    '/assets/',
    staticPath(path.resolve(staticDir))
  )

  routes.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }))

  routes.use('/api/', (req, res, next) => {
    res.contentType('json')

    basicAuth({
      users: { admin: authPassword },
      challenge: true
    })(req, res, next)
  })

  routes.param('type', (req, res, next, type) => {
    const sanitizedType = type.replace(/[^a-z]/gi, '')

    req.params.type = sanitizedType
    next()

  })

  routes.get('/api/occurances/:type', async (req, res) => {
    const { type } = req.params
    if (type === undefined) {
      return res.send('{}')
    }

    const occurances = (await Occurances.findByType(type)).reduce(
      (results, doc) => {
        results[doc.bucket] === undefined ? results[doc.bucket] = 1 : results[doc.bucket] += 1
        return results
      },
      {}
    )

    res.send(occurances)
  })
/*
  Given I am a user
  When I upload a json document
  And the document has the name 'deploys.json'
  Then the site finds the most recent date in the deploys table
  And it creates occurances for all deploys in the json after that date
*/
  routes.post('/api/occurances/', async (req, res) => {
    const uploadedFile = req.files.occuranceFile

    if (Array.isArray(uploadedFile) {
      return res.send({})
    }
    const uploadedOccurances = JSON.parse(uploadedFile.data.toString())
    console.log(res.body)
    res.send(uploadedOccurances)
    // tslint:disable-next-line: no-string-literal
    // const buffer = Object.values(req.files)[0]['data'] as Buffer
    // console.log(JSON.parse(buffer.toString()))
    // const { type } =

    // if (type === undefined) {
    //   return res.send('{}')
    // }

    // const occurances = (await Occurances.findByType(type)).reduce(
    //   (results, doc) => {
    //     results[doc.bucket] === undefined ? results[doc.bucket] = 1 : results[doc.bucket] += 1
    //     return results
    //   },
    //   {}
    // )

    // res.send(occurances)
  })

  routes.use('/*', (req, res) => res.sendStatus(404))
  return routes
}

export { buildRoutes }
