import { build, next } from '../../lib/dateLib'
import * as moment from 'moment'
import * as gitLogReader from '../gitLogReader'
import { Bucket } from './types'
import { Processor } from '../types'
import { Writer } from '../../lib/types'

function oldestDeploy(deploys: Bucket[]) {
  return deploys.reduce((a, b) => moment(a.createdAt) < moment(b.createdAt) ? a : b)
}

function commitsPerDeploysInMonth(commits: Bucket[], deploys: Bucket[], month: string) {
  const deploysPerMonth = deploys.filter((a) => a.monthBucket === month).length
  const commitsPerMonth = commits.filter((a) => a.monthBucket === month).length

  if (deploysPerMonth === 0) {
    return 0
  }
  return commitsPerMonth / deploysPerMonth
}

function releaseCandidatesPerDeploys(commits: Bucket[], deploys: Bucket[], endDate: string) {
  if (deploys.length === 0) {
    return []
  }
  let currentDate = oldestDeploy(deploys).monthBucket

  const candidatesPerDeploys: [string, number][] = []

  while (build(currentDate) < build(endDate)) {
    candidatesPerDeploys.push(
      [currentDate, commitsPerDeploysInMonth(commits, deploys, currentDate)]
    )
    currentDate = next(currentDate, 'month')
  }

  return candidatesPerDeploys
}

async function exportGraphData(absDirectory: string, deployClient: Processor, writer: Writer) {
  const commits = await gitLogReader.getCommits(absDirectory)
  const deploys = await deployClient.buildOccurances()
  const data = releaseCandidatesPerDeploys(
    commits, deploys, moment().format('YYYY-MM')
  )

  writer.write({ data, subject: 'releaseCandidatesPerDeploys' })
}

export {
  exportGraphData,
  releaseCandidatesPerDeploys
}
