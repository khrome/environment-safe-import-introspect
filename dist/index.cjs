"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBaseDir = exports.scanImports = void 0;
var _browserOrNode = require("browser-or-node");
var lexer = _interopRequireWildcard(require("es-module-lexer"));
var path = _interopRequireWildcard(require("path"));
var fs = _interopRequireWildcard(require("fs"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
//*

/*
import * as mod from 'module';
import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
//*/
/**
 * A JSON object
 * @typedef { object } JSON
 */
// init not present in the browser, so don't use decomposition
const init = lexer.init;
const parse = lexer.parse;
const makeImportsResultsFromSource = async source => {
  // eslint-disable-next-line no-async-promise-executor
  return await new Promise(async (resolve, reject) => {
    try {
      if (init) await init;
      const [importsPromise] = parse(source);
      const imports = await importsPromise;
      resolve(imports.map(imp => imp.n));
    } catch (ex) {
      reject(ex);
    }
  });
};

/**
 * set the baseDir
 * @function setBaseDir
 */
let baseDir = '..';
const setBaseDir = value => {
  baseDir = value;
};

/**
 * This function fetches the package in a uniform way
 * @async
 * @function scanImports
 * @returns { JSON } importList
 */
exports.setBaseDir = setBaseDir;
const scanImports = async filePath => {
  try {
    if (_browserOrNode.isBrowser || _browserOrNode.isJsDom) {
      let url = `${baseDir}/${filePath}`;
      if (url.substring(0, 4) === '//./') url = url.substring(3);
      const response = await fetch(url);
      const source = await response.text();
      return await makeImportsResultsFromSource(source);
    } else {
      if (filePath.indexOf('://') !== -1) {
        const response = await fetch(filePath);
        const source = await response.text();
        return await makeImportsResultsFromSource(source);
      } else {
        return await new Promise((resolve, reject) => {
          let location = filePath;
          if (location.substring(0, 2) === './') {
            location = path.join(process.cwd(), location);
          }
          fs.readFile(location, async (err, data) => {
            if (err) reject(err);
            const source = data.toString();
            const results = await makeImportsResultsFromSource(source);
            resolve(results);
          });
        });
      }
    }
  } catch (ex) {
    console.log('EX', ex);
  }
};
exports.scanImports = scanImports;