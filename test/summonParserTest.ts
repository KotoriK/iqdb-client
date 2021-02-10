import {_parseResult} from '../src/index'
import fs from 'fs'
import {resolve} from 'path'
const forTest = fs.readFileSync(resolve(__dirname, '../test/response.html'),{encoding:'utf-8'})
fs.writeFileSync(resolve(__dirname, '../test/response.json'),JSON.stringify(_parseResult(forTest)))