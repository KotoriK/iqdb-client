import { parseNum, parseSizeAndType } from "../src/util"

test('parseNum', () => {
    expect(parseNum('92% similarity')).toBe(0.92)
    expect(parseNum('0.92')).toBe(0.92)
    expect(parseNum('-0.92')).toBe(-0.92)
    expect(parseNum('92s3')).toBe(92)
})

test('parseSize', () => {
    expect(parseSizeAndType('1024×1024')).toStrictEqual({size:{ width: 1024, height: 1024 },type:undefined})
    expect(parseSizeAndType('0.92')).toBe('0.92')
    expect(parseSizeAndType('600×658 [Safe]')).toStrictEqual({size:{ width: 600, height: 658 },type:'Safe'})
    expect(parseSizeAndType('800×744 [Ero]')).toStrictEqual({size:{ width: 800, height: 744 },type:'Ero'})
})