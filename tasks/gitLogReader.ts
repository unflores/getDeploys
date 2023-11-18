import * as util from 'util'
import { exec, ExecException } from 'child_process'

const asyncExec = util.promisify(exec)
import { Occurance } from './Occurance'

type Commit = {
  hash: string
  createdAt: string
}

// I'm not fully sure why this doesn't come back as a type, it is possibly b/c
// eslint-disable-next-line max-len
// I am using promisify... For more documentation: https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback
type ExecResponse = {
  error: ExecException | null
  stdout: string
  stderr: string
}

async function getCommits(absDirectory: string): Promise<Occurance[]> {
  const logs = await asyncExec(
    `git -C ${absDirectory} log --pretty=format:"%h_commitsep_%ad"`,
    { maxBuffer: 10 * 1024 * 1024 } // Bad temp idea
  ) as ExecResponse

  return logs.stdout
    .split("\n")
    .map((line: string) => line.split('_commitsep_'))
    .map((vals: string[]): Commit => ({ hash: vals[0].trim(), createdAt: vals[1] }))
    .filter((commit: Commit) => commit.hash !== '')
    .map((params: Commit) => new Occurance(params))
}

export {
  getCommits
}
