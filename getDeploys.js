require('dotenv/config');
const { DeployClient } = require('./src/deployClient');
const syncSubjectWriter = require('./lib/syncSubjectWriter');

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

if (process.argv[1] === __filename) {
  new Promise(async (resolve, reject) => {
    const authToken = process.env.TOKEN
    const repo = process.env.REPO
    const repoOwner = process.env.OWNER;

    const deployClient = new DeployClient({ authToken, repo, repoOwner });
    createDeployGraphData(deployClient, syncSubjectWriter);
    resolve('done');
  });
}

module.exports = {
  createDeployGraphData
};
