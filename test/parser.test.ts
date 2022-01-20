import { defaultConfig, parseResult } from '../src/api'
import fs from 'fs/promises'
import { resolve } from 'path'
test('parser', async () => {
    const parsedResult = fs.readFile(resolve(__dirname, '../test/response.html'), { encoding: 'utf-8' })
        .then(txt => parseResult(txt, defaultConfig.simlarityPass))
    const shouldBe = fs.readFile(resolve(__dirname, '../test/response.json'), { encoding: 'utf-8' })
        .then(txt => JSON.parse(txt))
    expect(await parsedResult).toEqual(await shouldBe)
})