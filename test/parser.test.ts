import { _parseResult } from '../src/api'
import fs from 'fs/promises'
import { resolve } from 'path'
test('parser', async() => {
    const parseResult = fs.readFile(resolve(__dirname, '../test/response.html'), { encoding: 'utf-8' })
        .then(txt => _parseResult(txt))
    const shouldBe = fs.readFile(resolve(__dirname, '../test/response.json'), { encoding: 'utf-8' })
        .then(txt => JSON.parse(txt))
    expect(await parseResult).toEqual(await shouldBe)
})
