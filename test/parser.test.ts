import { parseResult } from '../src/api'
import fs from 'fs/promises'
import { resolve } from 'path'

describe(parseResult, () => {
    test('parses response1', async () => {
        const response1 = await fs.readFile(resolve(__dirname, '../test/__testData__/response1.html'), { encoding: 'utf-8' });

        expect(parseResult(response1, 0)).toMatchSnapshot();
    })

    test('parses response2', async () => {
        const response2 = await fs.readFile(resolve(__dirname, '../test/__testData__/response2.html'), { encoding: 'utf-8' });

        expect(parseResult(response2, 0)).toMatchSnapshot();
    })
})
