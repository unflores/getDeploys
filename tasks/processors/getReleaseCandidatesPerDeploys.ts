import { build, next } from '../../lib/dateLib'
import * as moment from 'moment'
import * as gitLogReader from '../gitLogReader'
import { Occurance } from '../Occurance'

function oldestDeploy(deploys: Occurance[]) {
  return deploys.reduce((a, b) => moment(a.createdAt) < moment(b.createdAt) ? a : b)
}

function commitsPerDeploysInMonth(commits: Occurance[], deploys: Occurance[], month: string) {
  const deploysPerMonth = deploys.filter((a) => a.monthBucket === month).length
  const commitsPerMonth = commits.filter((a) => a.monthBucket === month).length

  if (deploysPerMonth === 0) {
    return 0
  }
  return commitsPerMonth / deploysPerMonth
}

function releaseCandidatesPerDeploys({ commits, deploys, endDate }) {
  if (deploys.length === 0) {
    return []
  }
  let currentDate = oldestDeploy(deploys).monthBucket

  const candidatesPerDeploys = []

  while (build(currentDate) < build(endDate)) {
    candidatesPerDeploys.push(
      [currentDate, commitsPerDeploysInMonth(commits, deploys, currentDate)]
    )
    currentDate = next(currentDate, 'month')
  }

  return candidatesPerDeploys
}

async function exportGraphData(absDirectory: string, deployClient, writer) {
  const commits = await gitLogReader.getCommits(absDirectory)
  const deploys = await deployClient.getDeploys()
  const data = releaseCandidatesPerDeploys(
    { commits, deploys, endDate: moment().format('YYYY-MM') }
  )

  writer.write({ data, subject: 'releaseCandidatesPerDeploys' })
}

module.exports = {
  exportGraphData,
  releaseCandidatesPerDeploys
}
