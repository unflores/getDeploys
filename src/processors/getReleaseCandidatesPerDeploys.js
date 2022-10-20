async function exportGraphData(absDirectory, deployClient, writer) {
  const data = { '2022-8-1': 1 };
  writer.write({ subject: 'releaseCandidatesPerDeploys', data })
}

module.exports = {
  exportGraphData
}
