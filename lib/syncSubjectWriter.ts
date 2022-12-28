import { writeFileSync } from 'fs'

function write({ subject, data }: { subject: string, data: { [k: string]: any } }) {
  writeFileSync(`./data/${subject}.js`, `const ${subject} = ${JSON.stringify(data)};`)
}

export {
  write
}
