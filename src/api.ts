import { parseSimilarity, parseSizeAndType, randomFileName } from "./util"
import { load } from 'cheerio'
import fetch from 'node-fetch'
import { IQDB_SEARCH_OPTIONS_ALL, IQDBClientConfig, IQDBLibs_2D, IQDBLibs_3D, IQDB_RESULT_TYPE } from "./h"
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
export type SearchPicResult = SearchPicResultWithError |
{
    /**是否找到满足相似度的结果 */
    ok: boolean,
    /**返回数据 */
    data: IQDBSearchResultItem[]
    /**在哪些库做了搜索 */
    service: Array<IQDBLibs_2D | IQDBLibs_3D>
}
export interface SearchPicResultWithError {
    /**是否找到满足相似度的结果 */
    ok: false,
    /**是否发生错误 */
    err?: string
    data?: IQDBSearchResultItem[]
}
export const defaultConfig: IQDBClientConfig = {
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
export function parseResult(body: string, simlarityPass: number, noSource?: boolean) {
    const $ = load(body)
    let ok = false
    const err = $('.err')
    if (err.length > 0) {
        return {
            ok: false,
            err: err.text()
        } as SearchPicResultWithError
    }
    const service = $('input[type=checkbox][name="service[]"][checked]').toArray().map(element => {
        const value = parseInt(element.attribs.value)
        const name = IQDBLibs_2D[value] || IQDBLibs_3D[value]
        if (!name) console.warn('Unknown lib: ' + value)
        return value
    })
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
                let similarity: number | string,
                    sizeAndType: string | { size: { width: number; height: number }; type: string },
                    source: string[]
                if (noSource) {
                    similarity = parseSimilarity($(rows[3]).text())
                    sizeAndType = parseSizeAndType($(rows[2]).text())
                } else {
                    similarity = parseSimilarity($(rows[4]).text())
                    sizeAndType = parseSizeAndType($(rows[3]).text())
                    source = $(rows[2]).text().split(' ')
                }
                if (similarity >= simlarityPass) ok = true
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
        ok,
        data,
        service
    }
}
export function makeSearchFunc(config: IQDBClientConfig) {
    return async function searchPic(pic: string | Buffer | Readable, { lib, forcegray, service: libs, fileName }: IQDB_SEARCH_OPTIONS_ALL): Promise<SearchPicResult> {
        const isMultiLib = lib == 'www' || lib == '3d'
        const form = new FormData()
        if (typeof pic == 'string') { form.append('url', pic) }
        else if (pic instanceof Buffer || pic instanceof Readable) { form.append('file', pic, { filename: fileName ? fileName : randomFileName() }) }
        else {
            throw new TypeError('expect string | Buffer | Readable')
        }
        if (isMultiLib && libs) _addToForm(form, libs)
        if (forcegray) form.append('forcegray', 'true')
        const resp = await fetch(`https://${lib}.${config.baseDomain}`,
            {
                method: 'POST',
                body: form,
                headers: {
                    ...form.getHeaders(),
                    'User-Agent': config.userAgent
                },
                ...config.fetchOptions
            })
        if (resp.ok) {
            return parseResult(await resp.text(), config.simlarityPass, !isMultiLib)
        } else {
            return {
                ok: false,
                err: 'HTTP ' + resp.status
            } as SearchPicResultWithError
        }
    }
}
const searchPic = makeSearchFunc(defaultConfig)
export default searchPic