import searchPic from "../src/api";
import fs from 'fs/promises'
import { resolve } from 'path'
test('find by url', async () => {
    jest.setTimeout(30000);
    const result = (await searchPic('https://pixiv.cat/84035784-3.jpg', { lib: 'www' }))
    if (!result.ok) throw result
    expect(result.data.length).toBeGreaterThan(0)

})
test('find by url, single-lib search', async () => {
    jest.setTimeout(30000);
    const result = (await searchPic('https://pixiv.cat/84035784-3.jpg', { lib: 'danbooru' }))
    if (!result.ok) throw result
    expect(result.data.length).toBeGreaterThan(0)

})
test('find by url, 3diqdb', async () => {
    jest.setTimeout(30000);
    const result = (await searchPic('https://pixiv.cat/84035784-3.jpg', { lib: '3d' }))
    expect(result.ok).toBe(false)
    expect(result.data.length).toBeGreaterThan(0)
})
test('find by url, multilib', async () => {
    jest.setTimeout(30000);
    const result = (await searchPic('https://pixiv.cat/84035784-3.jpg', { lib: 'www', libs: [1, 2] }))
    if (!result.ok) throw result
    expect(result.data.length).toBeGreaterThan(0)
})
test('find by local res', async () => {
    jest.setTimeout(30000);
    const result = (await searchPic(await fs.readFile(resolve(__dirname, '../test/84035784_p2.jpg')), { lib: 'www' }))
    console.log(result)
    expect(result.data.length).toBeGreaterThan(0)
})
