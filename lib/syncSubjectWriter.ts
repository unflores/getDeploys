import { writeFileSync } from 'fs'
import { Writer } from './types'

interface Options {
  type?: string
}
class SyncSubjectWriter implements Writer {
  options: Options

  constructor(options: Options = {}) {
    this.options = options
  }

  write({ subject, data }) {
    if (this.options.type === 'js' || this.options.type === undefined) {
      writeFileSync(
        `./data/${subject}.js`,
        `const ${subject} = ${JSON.stringify(data)};`,
      )
    } else {
      writeFileSync(`./data/${subject}.json`, JSON.stringify(data))
    }
  }
}

export { SyncSubjectWriter }
