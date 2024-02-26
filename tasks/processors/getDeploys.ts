import {DeployClient, Bucket} from './types'
import { Writer } from '../../lib/types'

function deploysToDeploysPerPeriod(deploys: Bucket[], period = 'month') {
  const bucket = `${period}Bucket`
  return deploys.reduce((deploysPerPeriod, deploy) => {

    if (deploysPerPeriod[deploy[bucket] as string | undefined] === undefined) {
      deploysPerPeriod[deploy[bucket] as string] = 0
    }

    deploysPerPeriod[deploy[bucket] as string] += 1

    return deploysPerPeriod
  },                    {})
}

async function createDeploys(deployClient: DeployClient, syncSubjectWriter: Writer) {
  const deploys = await deployClient.getDeploys();
  const rawDeploys = deploys.map((deploy) => (deploy.createdAt))
  syncSubjectWriter.write({ subject: 'deploys', data: rawDeploys })
}

async function createDeployGraphData(deployClient: DeployClient, syncSubjectWriter: Writer) {
  const deploys = await deployClient.getDeploys()

  const deploysPerPeriod = deploysToDeploysPerPeriod(deploys)
  syncSubjectWriter.write({ subject: 'deploys', data: deploysPerPeriod })
}

export {
  createDeploys,
  createDeployGraphData
}
