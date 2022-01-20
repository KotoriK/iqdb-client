import searchPic from "../src/api";
import fs from 'fs/promises'
import { resolve } from 'path'
jest.setTimeout(30000);

test('find by url', async () => {
    const result = (await searchPic('https://pixiv.cat/84035784-3.jpg', { lib: 'www' }))
    if (!result.ok) throw result
    expect(result.data.length).toBeGreaterThan(0)

})
test('find by url, single-lib search', async () => {
    const result = (await searchPic('https://pixiv.cat/84035784-3.jpg', { lib: 'danbooru' }))
    if (!result.ok) throw result
    expect(result.data.length).toBeGreaterThan(0)

})
test('find by url, 3diqdb', async () => {
    const result = (await searchPic('https://pixiv.cat/84035784-3.jpg', { lib: '3d' }))
    expect(result.ok).toBe(false)
    expect(result.data.length).toBeGreaterThan(0)
})
test('find by url, multilib', async () => {
    const service = [1, 2]
    const result = (await searchPic('https://pixiv.cat/84035784-3.jpg', { lib: 'www', service: service }))
    console.log(result)
    if (!result.ok) throw result
    expect(result.service.filter(s => !service.includes(s)).length).toBe(0)
    expect(result.data.length).toBeGreaterThan(0)
})
test('find by local res', async () => {
    const result = (await searchPic(await fs.readFile(resolve(__dirname, '../test/84035784_p2.jpg')), { lib: 'www' }))
    console.log(result)
    if (!result.ok) throw result
    expect(result.data.length).toBeGreaterThan(0)
})
