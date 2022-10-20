const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Occurance } = require('./Occurance');

async function getCommits(absDirectory) {
  const logs = await exec(
    `git -C ${absDirectory} log --pretty=format:"%h_commitsep_%ad"`,
    { maxBuffer: 10 * 1024 * 1024 } // Bad temp idea
  );

  return logs.stdout
    .split("\n")
    .map((line) => line.split('_commitsep_'))
    .map((vals) => ({ hash: vals[0].trim(), createdAt: vals[1] }))
    .filter((commit) => commit.hash !== '')
    .map((params) => new Occurance(params))
}

module.exports = {
  getCommits
};
