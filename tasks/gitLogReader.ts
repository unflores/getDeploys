import { Occurance } from './Occurance'
import { Processor } from './types'
import { asyncExec } from './utils'
type Commit = {
  hash: string
  createdAt: string
}

async function getCommits(absDirectory: string): Promise<Occurance[]> {
  const reader = new GitLogReader(absDirectory)
  return await reader.buildOccurances()
}

class GitLogReader implements Processor {
  absPath: string

  constructor(absPath: string) {
    this.absPath = absPath
  }

  async buildOccurances(): Promise<Occurance[]> {
    const logs = await asyncExec(
      `git -C ${this.absPath} log --pretty=format:"%h_commitsep_%ad"`,
      { maxBuffer: 10 * 1024 * 1024 }, // Bad temp idea
    )

    return logs.stdout
      .split('\n')
      .map((line: string) => line.split('_commitsep_'))
      .map(
        (vals: string[]): Commit => ({
          hash: vals[0].trim(),
          createdAt: vals[1],
        }),
      )
      .filter((commit: Commit) => commit.hash !== '')
      .map((params: Commit) => new Occurance(params))
  }
}

export { GitLogReader, getCommits }
