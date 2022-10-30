require('dotenv/config');
const syncSubjectWriter = require('./lib/syncSubjectWriter');
const deployProcessor = require('./src/processors/getDeploys');
const candidatesProcessor = require('./src/processors/getReleaseCandidates');
const candidatesDeploysProcessor = require('./src/processors/getReleaseCandidatesPerDeploys');

const { DeployClient } = require('./src/DeployClient');

new Promise(async (resolve) => {
  const authToken = process.env.TOKEN
  const repo = process.env.REPO
  const repoOwner = process.env.OWNER;
  const absDirectory = process.env.PROJECT_DIRECTORY;
  const deployClient = new DeployClient({ authToken, repo, repoOwner });

  if (process.env.npm_config_processor === undefined) {
    console.error('FAILURE: Must provide flag "processor"');
    resolve('done');
    return;
  }

  if (process.env.npm_config_processor === 'getDeploys') {
    await deployProcessor.createDeployGraphData(deployClient, syncSubjectWriter);
  } else if (process.env.npm_config_processor === 'getReleaseCandidates') {
    await candidatesProcessor.createDeployGraphData(absDirectory, syncSubjectWriter)
  } else if (process.env.npm_config_processor === 'getReleaseCandidatesPerDeploys') {
    await candidatesDeploysProcessor.exportGraphData(absDirectory, deployClient, syncSubjectWriter);
  } else {
    console.error('FAILURE: Must provide a VALID processor.');
    resolve('done');
    return;
  }

  resolve('done');
}, (reason) => {
  console.log(reason);
});
