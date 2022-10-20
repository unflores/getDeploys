require('dotenv/config');
const { DeployClient } = require('./DeployClient');
const syncSubjectWriter = require('../lib/syncSubjectWriter');

async function exportGraphData(absDirectory, deployClient, writer) {

}

if (process.argv[1] === __filename) {
  new Promise(async (resolve, reject) => {
    const authToken = process.env.TOKEN;
    const repo = process.env.REPO;
    const repoOwner = process.env.OWNER;
    const absDirectory = process.env.PROJECT_DIRECTORY;

    const deployClient = new DeployClient({ authToken, repo, repoOwner });
    createDeployGraphData(absDirectory, deployClient, syncSubjectWriter);
    resolve('done');
  });
}

module.exports = {
  exportGraphData
}
