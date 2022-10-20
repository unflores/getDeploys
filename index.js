const syncSubjectWriter = require('./lib/syncSubjectWriter');
const { createDeployGraphData } = require('./getDeploys');
const { DeployClient } = require('./src/DeployClient');

new Promise(async (resolve, reject) => {
  const authToken = process.env.TOKEN
  const repo = process.env.REPO
  const repoOwner = process.env.OWNER;

  if (process.env.npm_config_processor === 'getDeploys') {
    const deployClient = new DeployClient({ authToken, repo, repoOwner });
    await createDeployGraphData(deployClient, syncSubjectWriter);
  }

  resolve('done');
});
