const { build, next } = require('../../lib/dateLib');
const moment = require('moment');
const gitLogReader = require('../gitLogReader');

function oldestDeploy(deploys) {
  return deploys.reduce((a, b) => moment(a.createdAt) < moment(b.createdAt) ? a : b);
}

function commitsPerDeploysInMonth(commits, deploys, month) {
  deploysPerMonth = deploys.filter((a) => a.monthBucket === month).length;
  commitsPerMonth = commits.filter((a) => a.monthBucket === month).length;
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
  const data = releaseCandidatesPerDeploys({});
  // const data = { '2022-8-1': 1 };
  writer.write({ subject: 'releaseCandidatesPerDeploys', data })
}

module.exports = {
  exportGraphData,
  releaseCandidatesPerDeploys
}
