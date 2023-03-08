import { writeFileSync } from 'fs'

interface WriteParams {
  subject: string
  data: { [k: string]: any }
}

interface Options {
  type?: string
}
class SyncSubjectWriter {

  options: Options

  constructor(options: Options = {}) {
    this.options = options
  }

  write(
    { subject, data }: WriteParams
  ) {

    if (this.options.type === 'js' || this.options.type === undefined) {
      writeFileSync(
        `./data/${subject}.js`, `const ${subject} = ${JSON.stringify(data)};`
      )
    } else {
      writeFileSync(`./data/${subject}.json`, JSON.stringify(data))
    }

  }
}

export {
  SyncSubjectWriter
}
