require('dotenv/config');
const syncSubjectWriter = require('../lib/syncSubjectWriter');
const deployProcessor = require('./processors/getDeploys');
const candidatesProcessor = require('./processors/getReleaseCandidates');
const candidatesDeploysProcessor = require('./processors/getReleaseCandidatesPerDeploys');

const { DeployClient } = require('./DeployClient');

new Promise(async (resolve) => {
  const authToken = process.env.TOKEN
  const repo = process.env.REPO
  const repoOwner = process.env.OWNER;
  const absDirectory = process.env.PROJECT_DIRECTORY;
  const deployClient = new DeployClient({ authToken, repo, repoOwner });

  const processors = {
    getDeploys: 'getDeploys',
    getReleaseCandidates: 'getReleaseCandidates',
    getReleaseCandidatesPerDeploys: 'getReleaseCandidatesPerDeploys'
  };


  if (process.env.npm_config_processor === processors.getDeploys) {
    await deployProcessor.createDeployGraphData(deployClient, syncSubjectWriter);
  } else if (process.env.npm_config_processor === processors.getReleaseCandidates) {
    await candidatesProcessor.createDeployGraphData(absDirectory, syncSubjectWriter)
  } else if (process.env.npm_config_processor === processors.getReleaseCandidatesPerDeploys) {
    await candidatesDeploysProcessor.exportGraphData(absDirectory, deployClient, syncSubjectWriter);
  } else {
    console.error(`FAILURE: Must provide a VALID processor. Please specifiy --processor=<${Object.keys(processors).join('|')}>`);
    resolve('done');
    return;
  }

  resolve('done');
}, (reason) => {
  console.log(reason);
});
