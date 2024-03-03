import { GitLogReader } from './gitLogReader'
import { Config } from './index'
import { Processor } from './types'
import { DeployClient } from './DeployClient'

export function buildProcessor(processorName: string, config: Config): Processor {
  let processor: Processor

  switch(processorName) {
    case 'getReleaseCandidates':
      processor = new GitLogReader(config.absDirectory)
      break
    case 'getDeploys':
      processor = new DeployClient(config)
      break
  }
  return processor
}
