import { makeSearchFunc } from '../src/api'

test('options: base domain', async () => {
    try {
        await makeSearchFunc({
            baseDomain: `127.0.0.1`,
            simlarityPass: 0.6,
            userAgent: 'testa',
        })('114514', { lib: 'www' })
    } catch (e) {
        expect(e instanceof Error && e.message.match('127.0.0.1')).toBeTruthy()
    }
})
