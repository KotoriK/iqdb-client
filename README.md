# iqdb-client
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/iqdb-client/badge)](https://www.jsdelivr.com/package/npm/iqdb-client) [![npm](https://img.shields.io/npm/dm/iqdb-client?color=red&label=npm%20download)](https://www.npmjs.com/package/iqdb-client) ![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/iqdb-client) [![workflow](https://img.shields.io/github/workflow/status/KotoriK/iqdb-client/Test)](https://github.com/KotoriK/iqdb-client/actions/workflows/test.yml)[![dependents](https://badgen.net/npm/dependents/iqdb-client)](https://www.npmjs.com/package/iqdb-client?activeTab=dependents)

iqdb.org api client for Node.js.

 English | [中文文档](./README.cn.md)
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Feature](#feature)
- [BREAK CHANGE](#break-change)
- [Install](#install)
- [Usage](#usage)
  - [Params](#params)
    - [services avaliable for iqdb2d (lib='www'):](#services-avaliable-for-iqdb2d-libwww)
    - [services avaliable for 3diqdb (lib='3d'):](#services-avaliable-for-3diqdb-lib3d)
  - [Returns](#returns)
- [Advanced Usage](#advanced-usage)
- [Support this package](#support-this-package)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Feature
* Type definitions ready.
* Support 'ignore color'.
* Support searching on single lib (simple search).
* Support both iqdb2d and iqdb3d.
* Support searching by file(buffer or stream) and url
* Based on Fetch
## BREAK CHANGE
Since ```2.0.0```, miss typo of word ```similarity``` has been fixed, thus corresponding field in your custom ```IQDBClientConfig``` should be change. If you are using default config, you are good to go.
The type of field ```similarity``` in interface ```IQDBSearchResultItem``` has been changed from ```number | string``` to ```number | null```，meaning it will not fallback to string while parsing failed.
## Install
```bash
npm install iqdb-client
# or with yarn
yarn add iqdb-client
```
## Usage
```ts
const searchPic = require('iqdb-client')
const result = (await searchPic('https://pixiv.cat/84035784-3.jpg', { lib: 'www' }))
/** also support ES Module Import*/

//see ./src/api.test.ts for more examples.
if(result.ok){
    console.log(result.data)
}

```
### Params
```ts
searchPic(pic: string | Buffer | Readable, 
{ lib, forcegray, libs,fileName }: IQDB_SEARCH_OPTIONS_ALL)
```
* **lib**: *string, required* 
'www'(for iqdb2d) or '3d'(for 3diqdb), or other lib name defined in type ```IQDB_SEARCH_LIBRARY_2D``` in [h.ts](./src/h.ts) for single-lib search.
* **forcegray**: *boolean, default false* 
whether ignore color.
* **fileName**: *string*  
Determines field 'filename' in form data. Only make sense when searching by files. When not provide, a random-summon string will hold the place.
* **service**: *Array&lt;number&gt;* 
Determine services to search on when performing search on multi-service.
#### services avaliable for iqdb2d (lib='www'):
```ts
export enum IQDBLibs_2D {
    danbooru = 1,
    konachan = 2,
    'yande.re' = 3,
    gelbooru = 4,
    'sankaku channel' = 5,
    'e-shuushuu' = 6,
    zerochan = 11,
    'anime-picture' = 13
}
```
#### services avaliable for 3diqdb (lib='3d'):
```ts
export enum IQDBLibs_3D {
    '3dbooru' = 7,
    'idol' = 9
}
```
### Returns
While successfully request iqdb.org, function will return an object with ```{ok:boolean}```. If similarity check passes, field ```ok``` will be set to ```true```. See [Example Result](#example-result)
While meet exceptions, function will return it in an object as text. For example:
```ts
{
    ok:false,
    /*error info*/
    err:'HTTP 400'
}
```
Exception handle in this package is not mature yet due to lack of real test.
**Example Result**
```json
{
    "ok": true,
    "data": [{
        "head": "Your image",
        "img": "/thu/thu_114514.jpg",
        "name": "84035784_p2.jpg",
        "similarity": null,
        "size": {
            "width": 1703,
            "height": 2459
        },
        "type": null
    }, {
        "head": "Best match",
        "sourceUrl": "//danbooru.donmai.us/posts/4076714",
        "similarity": 0.96,
        "img": "/danbooru/1/f/8/1f8ff3c560a0689e795938138dac7b1f.jpg",
        "size": {
            "width": 1703,
            "height": 2459
        },
        "type": "Safe",
        "source": ["Danbooru", "Gelbooru"]
    }, {
        "head": "Additional match",
        "sourceUrl": "https://yande.re/post/show/678391",
        "similarity": 0.92,
        "img": "/moe.imouto/8/0/1/801df5f665e61e6f87eb85431f2ca2a1.jpg",
        "size": {
            "width": 1703,
            "height": 2459
        },
        "type": "Safe",//shows whether is nsfw, might be one of 'Safe' | 'Ero' | 'Explicit'
        "source": ["yande.re"]
    }],
    "service": [1, 2, 3, 4, 5, 6, 11, 13] //services used in this search
}
```
## Advanced Usage
```ts
interface IQDBClientConfig {
    baseDomain: string,
    similarityPass: number
    userAgent: string,
    fetchOptions?: import('node-fetch').RequestInit
}
const { makeSearchFunc } = require('iqdb-client')
const searchPic = await makeSearchFunc({
            baseDomain: `127.0.0.1`,
            similarityPass: 0.6,
            userAgent: 'testa',
        })
```
Use ```makeSearchFunc()```to customize config. ```makeSearchFunc()```will return a new ```searchPic()```
```searchPic()``` which is default exported by this module uses ```defaultConfig```: 
```ts
export const defaultConfig: IQDBClientConfig = {
    baseDomain: 'iqdb.org',
    similarityPass: 0.6,
    userAgent: 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)',
}
```
## Support this package

* This package makes sense because of [iqdb.org](https://www.iqdb.org/). Support them is supporting the package.
* Open issue or PR for questions.

## License
The code contained within this repository is licensed under the MIT License. See [LICENSE](./LICENSE) for more information.
