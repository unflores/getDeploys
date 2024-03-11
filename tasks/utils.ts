import * as util from 'util'
import { exec } from 'child_process'

export const asyncExec = util.promisify(exec)

type Man = {
  thing: Object
}

const man = { thing: {} }
