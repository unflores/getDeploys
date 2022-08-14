const { Octokit } = require('octokit');
require('dotenv/config');
const { Deploy } = require('./src/deploy');

const octokit = new Octokit({
  auth: process.env.TOKEN
})

async function getDeploys() {
  const {OWNER, REPO} = process.env;

  const request = 'GET /repos/{owner}/{repo}/deployments'
  const params = {
    owner: OWNER,
    repo: REPO,
    environment: 'production',
    per_page: 100
  };

  results = await octokit.request(request, params);

  if(results.status !== 200) {
    console.log({request, params});
    process.exit();
  }
  return results.data;
}


let results;

function pagesToDeploysPerWeek(deploys){
  return deploys.reduce((deploysPerWeek, deployParams) => {
    const deploy = new Deploy(deployParams);

    if(deploysPerWeek[deploy.weekBucket] === undefined) {
      deploysPerWeek[deploy.weekBucket] = 0;
    }

    deploysPerWeek[deploy.weekBucket] += 1;

    return deploysPerWeek;
  },{});
}

new Promise(async (resolve, reject) => {
  const deploys = await getDeploys()

  const deploysPerWeek = pagesToDeploysPerWeek(deploys);
  console.log(deploysPerWeek);
  process.exit();

  resolve('done');
})



