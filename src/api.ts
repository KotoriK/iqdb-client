import { parseNum, parseSizeAndType, randomFileName } from "./util"
import { load } from 'cheerio'
import fetch from 'node-fetch'
import { IQDB_SEARCH_OPTIONS_ALL, IQDBClientOptions, IQDBLibs_2D, IQDBLibs_3D, IQDB_RESULT_TYPE } from "./h"
import FormData from 'form-data'
import { Readable } from 'stream'
export interface Size {
    width: number
    height: number
}
export type IQDBSearchResultItem = {
    head: string,
    img: string,
    name?: string,
    sourceUrl?: string,
    source?: string[],
    similarity?: number
} & ({
    size?: Size,
    type?: IQDB_RESULT_TYPE
} | { sizeAndType: string })
export function setIQDBOptions(newOption: IQDBClientOptions) {
    IQDB_OPTIONS = newOption
}
export let IQDB_OPTIONS: IQDBClientOptions = {
    baseDomain: 'iqdb.org',
    simlarityPass: 0.6,
    userAgent: 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)',
}
const _addToForm = (form: FormData, array: Array<IQDBLibs_2D | IQDBLibs_3D>) => array.forEach(lib => { form.append('service[]', lib) })

/**
 * 
 * @param body 服务器返回的body
 * @param noSource 指示结果中是否应该有source字段
 * @returns
 */
export function _parseResult(body: string, noSource?: boolean) {
    const $ = load(body)
    let ok = false
    const err = $('.err')
    if (err.length > 0) {
        return {
            /**是否找到满足相似度的结果 */
            ok,
            /**是否发生错误 */
            err: err.text()
        }
    }
    const data: Array<IQDBSearchResultItem> = $('#pages').children('div').toArray()
        .map(page => {
            const rows = $(page).find('tr')
            const head = $(rows[0]).text()
            if (head == 'Your image') {
                const sizeAndType = parseSizeAndType($(rows[3]).text())
                return {
                    head,
                    img: $(rows[1]).find('img').attr('src'),
                    name: $(rows[2]).text(),
                    ...typeof sizeAndType == 'object' ? sizeAndType : { sizeAndType }
                }
            } else if (head == 'No relevant matches') {
                return
            } else {
                let similarity: number | string, sizeAndType: string | { size: { width: number; height: number }; type: string }, source: string[]
                if (noSource) {
                    similarity = parseNum($(rows[3]).text())
                    sizeAndType = parseSizeAndType($(rows[2]).text())
                } else {
                    similarity = parseNum($(rows[4]).text())
                    sizeAndType = parseSizeAndType($(rows[3]).text())
                    source = $(rows[2]).text().split(' ')
                }
                if (similarity >= IQDB_OPTIONS.simlarityPass) ok = true
                const imgBox = $(rows[1]).find('a')

                return {
                    head,
                    sourceUrl: imgBox.attr('href'),
                    img: imgBox.find('img').attr('src'),
                    ...typeof sizeAndType == 'object' ? sizeAndType : { sizeAndType },
                    source
                }
            }
        })
        .filter(item => item != undefined)
    return {
        /**是否找到满足相似度的结果 */
        ok,
        /**返回数据 */
        data
    }
}
export default async function searchPic(pic: string | Buffer | Readable, { lib, forcegray, libs, fileName }: IQDB_SEARCH_OPTIONS_ALL) {
    const isMultiLib = lib == 'www' || lib == '3d'
    const form = new FormData()
    if (typeof pic == 'string') { form.append('url', pic) }
    else if (pic instanceof Buffer || pic instanceof Readable) { form.append('file', pic, { filename: fileName ? fileName : randomFileName() }) }
    else {
        throw new TypeError('expect string | Buffer | Readable')
    }
    if (isMultiLib && libs) _addToForm(form, libs)
    if (forcegray) form.append('forcegray', 'true')
    const resp = await fetch(`https://${lib}.${IQDB_OPTIONS.baseDomain}`,
        {
            method: 'POST',
            body: form,
            headers: {
                ...form.getHeaders(),
                'User-Agent': IQDB_OPTIONS.userAgent
            },
            ...IQDB_OPTIONS.fetchOptions
        })
    if (resp.ok) {
        return _parseResult(await resp.text(), !isMultiLib)
    } else {
        return {
            ok: false,
            err: 'HTTP ' + resp.status
        }
    }
}