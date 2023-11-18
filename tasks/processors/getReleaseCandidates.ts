import * as gitLogReader from '../gitLogReader'
import * as dateLib from '../../lib/dateLib'
import { Writer, Bucket } from './types'

function releaseCandidatesPerDay(candidates: Bucket[]) {
  return candidates.reduce((candidatesPerDay, candidate) => {
    if (candidatesPerDay[candidate.dayBucket] === undefined) {
      candidatesPerDay[candidate.dayBucket] = 0
    }

    candidatesPerDay[candidate.dayBucket] += 1
    return candidatesPerDay
  },                       {})
}

type DayCounts = {
  [k: string]: number
}

// @params dayCounts {'2022-1-1': 1}
function makeDayCountsCumulative(dayCounts: DayCounts) {
  const dates = Object.keys(dayCounts)
    .sort((a, b) => dateLib.build(a).valueOf() - dateLib.build(b).valueOf())
  let curDate = dates[0]
  const lastDate = dates[dates.length - 1]
  const counts = { ...dayCounts }
  while (dateLib.build(curDate) <= dateLib.build(lastDate)) {

    if (counts[dateLib.previous(curDate)] === undefined) {
      counts[dateLib.previous(curDate)] = 0
    }
    if (counts[curDate] === undefined) {
      counts[curDate] = 0
    }

    if ((new Date(curDate)).getDate() !== 1) {
      counts[curDate] += counts[dateLib.previous(curDate)]
    }
    curDate = dateLib.next(curDate)
  }
  return counts
}

async function createDeployGraphData(absDirectory: string, writer: Writer) {
  const commits = await gitLogReader.getCommits(absDirectory)

  const data = makeDayCountsCumulative(
    releaseCandidatesPerDay(commits)
  )

  const output = Object.keys(data)
    .sort((a, b) => new Date(a).valueOf() - new Date(b).valueOf())
    .map(dateString => [dateString, data[dateString]])

  writer.write({ data: output, subject: 'releaseCandidates' })
}

export {
  createDeployGraphData,
  releaseCandidatesPerDay,
  makeDayCountsCumulative
}
