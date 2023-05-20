import { Writer, DeployClient, Bucket } from './types'

function pagesToDeploysPerPeriod(deploys: Bucket[], period = 'month') {
  const bucket = `${period}Bucket`
  return deploys.reduce((deploysPerPeriod, deploy) => {
    if (deploysPerPeriod[deploy[bucket]] === undefined) {
      deploysPerPeriod[deploy[bucket]] = 0
    }

    deploysPerPeriod[deploy[bucket]] += 1

    return deploysPerPeriod
  },                    {})
}

async function createDeployGraphData(deployClient: DeployClient, syncSubjectWriter: Writer) {
  const deploys = await deployClient.getDeploys()

  const deploysPerPeriod = pagesToDeploysPerPeriod(deploys)
  syncSubjectWriter.write({ subject: 'deploys', data: deploysPerPeriod })
}

export {
  createDeployGraphData
}
