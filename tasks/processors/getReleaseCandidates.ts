import * as gitLogReader from '../gitLogReader'
import { Occurance } from '../Occurance'
import * as dateLib from '../../lib/dateLib'
import { Writer } from './'

function releaseCandidatesPerDay(candidates: Array<Occurance>) {
  return candidates.reduce((candidatesPerDay, candidate) => {
    if (candidatesPerDay[candidate.dayBucket] === undefined) {
      candidatesPerDay[candidate.dayBucket] = 0;
    }

    candidatesPerDay[candidate.dayBucket] += 1;
    return candidatesPerDay;
  }, {});
}

// @params dayCounts {'2022-1-1': 1}
function makeDayCountsCumulative(dayCounts) {
  const dates = Object.keys(dayCounts).sort((a, b) => dateLib.build(a) - dateLib.build(b));
  let curDate = dates[0];
  const lastDate = dates[dates.length - 1];
  const counts = { ...dayCounts };
  while (dateLib.build(curDate) <= dateLib.build(lastDate)) {

    if (counts[dateLib.previous(curDate)] === undefined) {
      counts[dateLib.previous(curDate)] = 0;
    }
    if (counts[curDate] === undefined) {
      counts[curDate] = 0;
    }

    if ((new Date(curDate)).getDate() !== 1) {
      counts[curDate] += counts[dateLib.previous(curDate)];
    }
    curDate = dateLib.next(curDate);
  }
  return counts;
}

async function createDeployGraphData(absDirectory: string, writer: Writer) {
  const commits = await gitLogReader.getCommits(absDirectory);

  let data = makeDayCountsCumulative(
    releaseCandidatesPerDay(commits)
  );
  // let data = releaseCandidatesPerDay(releaseCandidates);
  //Only get 2022
  // data = objectFilter(data, (key, _value) => key.match(/^2022-/) === null)

  data = Object.keys(data)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((dateString) => [dateString, data[dateString]]);

  writer.write({ subject: 'releaseCandidates', data })
}

module.exports = {
  createDeployGraphData,
  releaseCandidatesPerDay,
  makeDayCountsCumulative
};
