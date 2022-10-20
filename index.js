require('dotenv/config');
const syncSubjectWriter = require('./lib/syncSubjectWriter');
const { createDeployGraphData } = require('./src/processors/getDeploys');
const { DeployClient } = require('./src/DeployClient');

new Promise(async (resolve) => {
  const authToken = process.env.TOKEN
  const repo = process.env.REPO
  const repoOwner = process.env.OWNER;

  if (process.env.npm_config_processor === 'getDeploys') {
    const deployClient = new DeployClient({ authToken, repo, repoOwner });
    await createDeployGraphData(deployClient, syncSubjectWriter);
  }

  resolve('done');
}, (reason) => {
  console.log(reason);
});
