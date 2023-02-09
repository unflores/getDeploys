import { writeFileSync } from 'fs'

interface Options {
  type?: 'js' | 'json'
}

function write(
  { subject, data, opts = {} }: { subject: string, data: { [k: string]: any }, opts: Options }
) {

  if (opts.type === 'js' || opts.type === undefined) {
    writeFileSync(`./data/${subject}.js`, `const ${subject} = ${JSON.stringify(data)};`)
  } else {
    writeFileSync(`./data/${subject}.json`, JSON.stringify(data))
  }

}

export {
  write
}
