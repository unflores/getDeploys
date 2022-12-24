import { Occurance } from '../Occurance'

type Client = {
  getDeploys: () => Promise<Array<Occurance>>
}

type Data = {
  [k: string]: number
}

type Writer = {
  write: (params: { subject: string, data: Data }) => void
}

function pagesToDeploysPerPeriod(deploys: Array<Occurance>, period = 'month') {
  const bucket = `${period}Bucket`
  return deploys.reduce((deploysPerPeriod, deploy) => {
    if (deploysPerPeriod[deploy[bucket]] === undefined) {
      deploysPerPeriod[deploy[bucket]] = 0
    }

    deploysPerPeriod[deploy[bucket]] += 1

    return deploysPerPeriod
  }, {})
}

async function createDeployGraphData(deployClient: Client, syncSubjectWriter: Writer) {
  const deploys = await deployClient.getDeploys()

  const deploysPerPeriod = pagesToDeploysPerPeriod(deploys)
  syncSubjectWriter.write({ subject: 'deploys', data: deploysPerPeriod })
}

export {
  createDeployGraphData
};
