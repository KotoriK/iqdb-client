import { Size } from "./api"
import { IQDB_RESULT_TYPE } from "./h"

export function parseSimilarity(txt: string): number | null {
    const result = txt.match(/(-?\d+\.?\d*)(%?)/)
    if (result) {
        return (result[2] == undefined || result[2] == '') ? parseFloat(result[1]) : parseFloat(result[1]) / 100
    } else {
        return null//couldn't parse similarity
    }
}
export function parseSizeAndType(txt: string): { size: Size, type: IQDB_RESULT_TYPE } | string {
    const result = txt.match(/(\d+)×(\d+)(?: \[([A-z]*)\])?/)
    if (result) {
        return {
            size: {
                width: parseInt(result[1]),
                height: parseInt(result[2])
            },
            type: result[3]
        }
    } else {
        return txt
    }
}
const availCharset = '0123456789abcdefghijklmnopqrstuvwxyz@ABCDEFGHIJKLMNOPQRSTUVWXYZ_'
const availCharsetLen = availCharset.length
export function getRandomName() {
    const length = 5 + (Math.random() * 10 | 0)
    let str = ''
    for (let i = 0; i < length; i++) {
        str += availCharset[Math.random() * availCharsetLen | 0]
    }
    return str + '.jpg'
}
