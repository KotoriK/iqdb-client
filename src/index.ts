/**
 * iqdb-client
 * @description iqdb.org api client for Node.js.
 * @version 1.0.4
 * @author KotoriK
 * @license MIT
 */
export * from './h'
import searchPic, { IQDBSearchResultItem, Size, makeSearchFunc, defaultConfig } from './api'
export { searchPic, IQDBSearchResultItem, Size, makeSearchFunc, defaultConfig }
