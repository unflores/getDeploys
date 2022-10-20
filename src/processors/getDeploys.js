function pagesToDeploysPerPeriod(deploys, period = 'month') {
  bucket = `${period}Bucket`
  return deploys.reduce((deploysPerPeriod, deploy) => {
    if (deploysPerPeriod[deploy[bucket]] === undefined) {
      deploysPerPeriod[deploy[bucket]] = 0;
    }

    deploysPerPeriod[deploy[bucket]] += 1;

    return deploysPerPeriod;
  }, {});
}

async function createDeployGraphData(deployClient, syncSubjectWriter) {
  const deploys = await deployClient.getDeploys();

  const deploysPerPeriod = pagesToDeploysPerPeriod(deploys);
  syncSubjectWriter.write({ subject: 'deploys', data: deploysPerPeriod });
}

module.exports = {
  createDeployGraphData
};
