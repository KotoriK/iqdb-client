# iqdb-client
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/iqdb-client/badge)](https://www.jsdelivr.com/package/npm/iqdb-client) [![npm](https://img.shields.io/npm/dm/iqdb-client?color=red&label=npm%20download)](https://www.npmjs.com/package/iqdb-client) ![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/iqdb-client) [![workflow](https://img.shields.io/github/workflow/status/KotoriK/iqdb-client/Test)](https://github.com/KotoriK/iqdb-client/actions/workflows/test.yml)

iqdb.org api client for Node.js.

 [English](./README.md) | 中文文档
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [亮点](#%E4%BA%AE%E7%82%B9)
- [安装](#%E5%AE%89%E8%A3%85)
- [用法](#%E7%94%A8%E6%B3%95)
  - [参数](#%E5%8F%82%E6%95%B0)
    - [iqdb2d (lib='www')时可用的值:](#iqdb2d-libwww%E6%97%B6%E5%8F%AF%E7%94%A8%E7%9A%84%E5%80%BC)
    - [3diqdb (lib='3d')时可用的值:](#3diqdb-lib3d%E6%97%B6%E5%8F%AF%E7%94%A8%E7%9A%84%E5%80%BC)
  - [返回值](#%E8%BF%94%E5%9B%9E%E5%80%BC)
- [进阶用法](#%E8%BF%9B%E9%98%B6%E7%94%A8%E6%B3%95)
- [支持](#%E6%94%AF%E6%8C%81)
- [许可协议](#%E8%AE%B8%E5%8F%AF%E5%8D%8F%E8%AE%AE)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 亮点
* 自带类型定义
* 支持“忽略颜色”（ignore color）选项.
* 支持对单一库的搜索.
* 同时支持iqdb2d与iqdb3d.
* 支持上传文件搜索(通过Buffer或Stream)和根据图片地址搜索
* 基于Fetch
## 安装
```bash
npm install iqdb-client
# 或者使用yarn
yarn add iqdb-client
```
## 用法
```ts
const searchPic = require('iqdb-client')
const result = (await searchPic('https://pixiv.cat/84035784-3.jpg', { lib: 'www' }))
/** 也支持ES风格的导入*/
//更多示例请查看./src/api.test.ts
if(result.ok){
    console.log(result.data)
}

```
### 参数
```ts
searchPic(pic: string | Buffer | Readable, 
{ lib, forcegray, libs,fileName }: IQDB_SEARCH_OPTIONS_ALL)
```
* **lib**: *string, 必须提供* 
想要使用多库搜索时，提供'www'(for iqdb2d)或'3d'(for 3diqdb),
使用在[h.ts](./src/h.ts)```IQDB_SEARCH_LIBRARY_2D```中定义的其他值时将执行单库搜索。
* **forcegray**: *boolean*  
是否忽略颜色
* **fileName**: *string*  
表示表单中的‘filename’应为何值。仅在根据文件查找时有效。若没有提供，会自动生成一个随机文件名代替。
* **service**: *Array&lt;number&gt;* 
执行多库搜索时，决定在哪些库上搜索
#### iqdb2d (lib='www')时可用的值:
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
#### 3diqdb (lib='3d')时可用的值:
```ts
export enum IQDBLibs_3D {
    '3dbooru' = 7,
    'idol' = 9
}
```
### 返回值
当成功完成请求, 函数会返回一个包含```{ok:boolean}```的对象， 如[返回结果示例](#%E8%BF%94%E5%9B%9E%E7%BB%93%E6%9E%9C%E7%A4%BA%E4%BE%8B)所展示的那样。如果相似度检查通过，```ok```字段会被设为```true```。
若在执行中碰到错误, 函数会返回如下一个对象:
```ts
{
    ok:false,
    /*错误信息*/
    err:'HTTP 400'
}
```
由于缺乏实例，错误处理还不是特别完善。欢迎就你碰到的问题提出issue。
**返回结果示例**
```json
{
    "ok": true,
    "data": [{
        "head": "Your image",
        "img": "/thu/thu_114514.jpg",
        "name": "84035784_p2.jpg",
        "size": {
            "width": 1703,
            "height": 2459
        }
    }, {
        "head": "Best match",
        "sourceUrl": "//danbooru.donmai.us/posts/4076714",
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
        "img": "/moe.imouto/8/0/1/801df5f665e61e6f87eb85431f2ca2a1.jpg",
        "size": {
            "width": 1703,
            "height": 2459
        },
        "type": "Safe",//是否nsfw, 可能是'Safe' | 'Ero' | 'Explicit'中的一个值
        "source": ["yande.re"]
    }],
    "service": [1, 2, 3, 4, 5, 6, 11, 13] //在本次搜索中用到了的库
}
```
## 进阶用法
```ts
interface IQDBClientConfig {
    baseDomain: string,
    simlarityPass: number
    userAgent: string,
    fetchOptions?: import('node-fetch').RequestInit
}
const { makeSearchFunc } = require('iqdb-client')
const searchPic = await makeSearchFunc({
            baseDomain: `127.0.0.1`,
            simlarityPass: 0.6,
            userAgent: 'testa',
        })
```
使用```makeSearchFunc()```来自定义代理使用，相似度判定等选项。```makeSearchFunc()```会返回一个新的```searchPic()```
默认导出的```searchPic()```使用```defaultConfig```：
```ts
export const defaultConfig: IQDBClientConfig = {
    baseDomain: 'iqdb.org',
    simlarityPass: 0.6,
    userAgent: 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)',
}
```
## 支持

* 支持[iqdb.org](https://www.iqdb.org/)
* 遇到问题时，提交issue或PR

## 许可协议
本仓库的代码在MIT许可下授权。 更多信息请查看 [LICENSE](./LICENSE)。
