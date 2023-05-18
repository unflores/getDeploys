import * as dotenv from 'dotenv'

dotenv.config()

import { SyncSubjectWriter } from '../lib/syncSubjectWriter'
import * as deployProcessor from './processors/getDeploys'
import * as candidatesProcessor from './processors/getReleaseCandidates'
import * as candidatesDeploysProcessor from './processors/getReleaseCandidatesPerDeploys'

import { DeployClient } from './DeployClient'

function getProcessor(args: string[]): string {
  const processorArg = args.find((arg) => arg.search('--processor=') > -1)
  if (processorArg === undefined) {
    return ''
  }

  return processorArg.split('--processor=')[1]
}

new Promise(async (resolve) => {
  const authToken = process.env.TOKEN
  const repo = process.env.REPO
  const repoOwner = process.env.OWNER
  const absDirectory = process.env.PROJECT_DIRECTORY
  const deployClient = new DeployClient({ authToken, repo, repoOwner })

  const processor = getProcessor(process.argv)
  const processors = {
    getDeploys: 'getDeploys',
    getReleaseCandidates: 'getReleaseCandidates',
    getReleaseCandidatesPerDeploys: 'getReleaseCandidatesPerDeploys'
  }

  const options = { type: process.env.DATA_EXPORT_FILE_TYPE || 'js' }

  const syncSubjectWriter = new SyncSubjectWriter(options)

  if (processor === processors.getDeploys) {
    await deployProcessor.createDeployGraphData(deployClient, syncSubjectWriter)
  } else if (processor === processors.getReleaseCandidates) {
    await candidatesProcessor.createDeployGraphData(absDirectory, syncSubjectWriter)
  } else if (processor === processors.getReleaseCandidatesPerDeploys) {
    await candidatesDeploysProcessor.exportGraphData(absDirectory, deployClient, syncSubjectWriter)
  } else {
    console.log(
      `FAILURE: Must provide a VALID processor. ` +
      `Please specifiy --processor=<${Object.keys(processors).join('|')}>`
    )
    resolve('done')
    return
  }

  resolve('done')
}
).then(() => console.log('Done')).catch((reason) => console.log(reason))
