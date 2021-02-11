# iqdb-client
![](https://data.jsdelivr.com/v1/package/npm/iqdb-client/badge)
iqdb.org api client for Node.js.(https://www.jsdelivr.com/package/npm/iqdb-client)

 English | [中文文档](./README.cn.md)
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Feature](#feature)
- [Install](#install)
- [Usage](#usage)
    - [Advanced Usage](#advanced-usage)
    - [Example Result](#example-result)
- [API](#api)
    - [params](#params)
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
//see ./src/api.test.ts for more examples.
if(result.ok){
    console.log(result.data)
}

```
#### Advanced Usage
```ts
export interface IQDBClientOptions {
    baseDomain: string,
    simlarityPass: number
    userAgent:string
}
export let IQDB_OPTIONS: IQDBClientOptions = {
    baseDomain: 'iqdb.org',
    simlarityPass: 0.6,
    userAgent:'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'
}
```
These options are saved in ```IQDB_OPTIONS```. Simply modify it to change the options.

#### Example Result
```json
{
    "ok": true,
    "data": [
        {
            "head": "Your image",
            "img": "/thu/thu_114514jpg",
            "name": "84035784_p2.jpg",
            "size": {
                "width": 1703,
                "height": 2459
            }
        },
        {
            "head": "Best match",
            "sourceUrl": "//danbooru.donmai.us/posts/4076714",
            "img": "/danbooru/1/f/8/1f8ff3c560a0689e795938138dac7b1f.jpg",
            "size": {
                "width": 1703,
                "height": 2459
            },
            "type": "Safe",//safe for work
            "source": [
                "Danbooru",
                "Gelbooru"
            ]
        },
        {
            "head": "Additional match",
            "sourceUrl": "https://yande.re/post/show/678391",
            "img": "/moe.imouto/8/0/1/801df5f665e61e6f87eb85431f2ca2a1.jpg",
            "size": {
                "width": 1703,
                "height": 2459
            },
            "type": "Safe",
            "source": [
                "yande.re"
            ]
        }
    ]
}
```
## API
```ts
searchPic(pic: string | Buffer | Readable, 
{ lib, forcegray, libs,fileName }: IQDB_SEARCH_OPTIONS_ALL)
```
#### params
* **lib**: *string, required* 
'www'(for iqdb2d) or '3d'(for 3diqdb), or other lib name defined in type ```IQDB_SEARCH_LIBRARY_2D``` in [h.ts](./src/h.ts) for single-lib search.
* **forcegray**: *boolean, default false* 
whether ignore color.
* **fileName**: *string*  
Determines field 'filename' in form data. Only make sense when searching by files. When not provide, a random-summon string will hold the place.
* **libs**: *Array&lt;number&gt;* 
When performing search on multi-libs, determine which lib to search on. Only make sense when ```lib``` is 'www' or '3d'. Check type ```IQDBLibs_2D``` and type ```IQDBLibs_2D``` in [h.ts](./src/h.ts) for details.
## Support this package

* This package makes sense because of [iqdb.org](https://www.iqdb.org/). Support them is supporting the package.
* Open issue or PR for questions.

## License
The code contained within this repository is licensed under the MIT License. See [LICENSE](./LICENSE) for more information.
