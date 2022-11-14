const { build, next } = require('../../lib/dateLib');
const moment = require('moment');
const gitLogReader = require('../gitLogReader');

function oldestDeploy(deploys) {
  return deploys.reduce((a, b) => moment(a.createdAt) < moment(b.createdAt) ? a : b);
}

function commitsPerDeploysInMonth(commits, deploys, month) {
  const deploysPerMonth = deploys.filter((a) => a.monthBucket === month).length;
  const commitsPerMonth = commits.filter((a) => a.monthBucket === month).length;

  if (deploysPerMonth === 0) {
    return 0;
  }
  return commitsPerMonth / deploysPerMonth;
}

function releaseCandidatesPerDeploys({ commits, deploys, endDate }) {
  if (deploys.length === 0) {
    return [];
  }
  let currentDate = oldestDeploy(deploys).monthBucket;

  const candidatesPerDeploys = [];

  while (build(currentDate) < build(endDate)) {
    candidatesPerDeploys.push(
      [currentDate, commitsPerDeploysInMonth(commits, deploys, currentDate)]
    );
    currentDate = next(currentDate, 'month');
  }

  return candidatesPerDeploys;
}

async function exportGraphData(absDirectory, deployClient, writer) {
  const commits = await gitLogReader.getCommits(absDirectory);
  const deploys = await deployClient.getDeploys();
  const data = releaseCandidatesPerDeploys({ commits, deploys, endDate: moment().format('YYYY-MM') });

  writer.write({ subject: 'releaseCandidatesPerDeploys', data })
}

module.exports = {
  exportGraphData,
  releaseCandidatesPerDeploys
}
