import * as dotenv from 'dotenv'
dotenv.config()

import { SyncSubjectWriter } from '../lib/syncSubjectWriter'
import { buildProcessor } from './processorFactory'

function parseProcessorName(args: string[]): string {
  const processorArg = args.find((arg) => arg.search('--processor=') > -1)
  if (processorArg === undefined) {
    return ''
  }

  return processorArg.split('--processor=')[1]
}

export const processorsToFile = {
  getDeploys: 'deploys',
  getReleaseCandidates: 'releaseCandidates',
  getReleaseCandidatesPerDeploys: 'releaseCandidatesPerDeploys'
}

export type Config = {
  authToken: string
  repo: string
  repoOwner: string
  absDirectory: string
}

const config: Config = {
  authToken: process.env.TOKEN,
  repo: process.env.REPO,
  repoOwner: process.env.OWNER,
  absDirectory: process.env.PROJECT_DIRECTORY
}

const processStats =  async () => {
  const processorName = parseProcessorName(process.argv)
  const options = { type: process.env.DATA_EXPORT_FILE_TYPE || 'js' }

  const syncSubjectWriter = new SyncSubjectWriter(options)
  const processor = buildProcessor(processorName, config)

  if (processor !== undefined) {
    const occurances = await processor.buildOccurances()
    syncSubjectWriter.write({subject: processorsToFile[processorName] as string, data: occurances})
  } else {
    console.log(
      `FAILURE: Must provide a VALID processor. ` +
      `Please specifiy --processor=<${Object.keys(processorsToFile).join('|')}>`
    )
    return
  }
}

processStats().then(() => console.log('Done')).catch((reason) => console.log(reason))
