import * as util from 'util'
const exec = util.promisify(require('child_process').exec);
import { Occurance } from './Occurance'

type Commit = {
  hash: string
  createdAt: string
}
async function getCommits(absDirectory: string): Promise<Array<Occurance>> {
  const logs = await exec(
    `git -C ${absDirectory} log --pretty=format:"%h_commitsep_%ad"`,
    { maxBuffer: 10 * 1024 * 1024 } // Bad temp idea
  );

  return logs.stdout
    .split("\n")
    .map((line: string) => line.split('_commitsep_'))
    .map((vals: Array<string>): Commit => ({ hash: vals[0].trim(), createdAt: vals[1] }))
    .filter((commit: Commit) => commit.hash !== '')
    .map((params: Commit) => new Occurance(params))
}

module.exports = {
  getCommits
};
