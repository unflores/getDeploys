require('dotenv/config');
const syncSubjectWriter = require('./lib/syncSubjectWriter');
const deployProcessor = require('./src/processors/getDeploys');
const candidatesProcessor = require('./src/processors/getReleaseCandidates');

const { DeployClient } = require('./src/DeployClient');

new Promise(async (resolve) => {
  const authToken = process.env.TOKEN
  const repo = process.env.REPO
  const repoOwner = process.env.OWNER;
  const absDirectory = process.env.PROJECT_DIRECTORY;

  if (process.env.npm_config_processor === 'getDeploys') {
    const deployClient = new DeployClient({ authToken, repo, repoOwner });
    await deployProcessor.createDeployGraphData(deployClient, syncSubjectWriter);
  } else if (process.env.npm_config_processor === 'getReleaseCandidates') {
    await candidatesProcessor.createDeployGraphData(absDirectory, syncSubjectWriter)
  }
  resolve('done');
}, (reason) => {
  console.log(reason);
});
