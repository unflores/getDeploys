const { Octokit } = require('octokit');
require('dotenv/config');
const { Deploy } = require('./src/deploy');
const { writeFileSync } = require('fs');
const syncSubjectWriter = require('./lib/syncSubjectWriter');

const octokit = new Octokit({
  auth: process.env.TOKEN
})

async function getPage(page) {
  const { OWNER, REPO } = process.env;

  // https://docs.github.com/en/rest/deployments/deployments#list-deployments
  const request = 'GET /repos/{owner}/{repo}/deployments'
  const params = {
    owner: OWNER,
    repo: REPO,
    environment: 'production',
    per_page: 100,
    page: page
  };

  results = await octokit.request(request, params);

  if (results.status !== 200) {
    console.log({ request, params });
    process.exit();
  }
  return results.data;
}

async function getDeploys() {
  let pagePromises = [];
  for (let i = 0; i < 20; i++) {
    pagePromises.push(getPage(i));
  }

  const pages = await Promise.all(pagePromises);
  return pages.flat();
}

let results;

function pagesToDeploysPerPeriod(deploys, period = 'month') {
  bucket = `${period}Bucket`
  return deploys.reduce((deploysPerPeriod, deployParams) => {
    const deploy = new Deploy(deployParams);

    if (deploysPerPeriod[deploy[bucket]] === undefined) {
      deploysPerPeriod[deploy[bucket]] = 0;
    }

    deploysPerPeriod[deploy[bucket]] += 1;

    return deploysPerPeriod;
  }, {});
}

if (process.argv[1] === __filename) {
  new Promise(async (resolve, reject) => {
    const deploys = await getDeploys()

    const deploysPerPeriod = pagesToDeploysPerPeriod(deploys);
    console.log(deploysPerPeriod);
    syncSubjectWriter.write({ subject: 'deploys', data: deploysPerPeriod });
    resolve('done');
  });
}

module.exports = {
  getDeploys: getDeploys
};
