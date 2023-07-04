//*
import { isBrowser, isJsDom } from 'browser-or-node';
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
import * as lexer from 'es-module-lexer';
// init not present in the browser, so don't use decomposition
const init = lexer.init;
const parse = lexer.parse;
import * as path from 'path';
import * as fs from 'fs';

const makeImportsResultsFromSource = async (source)=>{
    return await new Promise(async (resolve, reject)=>{
        try{
            if(init) await init;
            const [importsPromise, exports] = parse(source);
            const imports = await importsPromise;
            resolve(imports.map((imp)=> imp.n));
        }catch(ex){
            reject(ex)
        }
    });
};

/**
 * set the baseDir
 * @function setBaseDir
 */
let baseDir = '..';

export const setBaseDir = (value)=>{
    baseDir = value;
}

/**
 * This function fetches the package in a uniform way
 * @async
 * @function scanImports
 * @returns { JSON } importList
 */
export const scanImports = async (filePath)=>{
    try{
        console.log()
        if(isBrowser || isJsDom){
            let url = `${baseDir}/${filePath}`;
            if(url.substring(0, 4) === '//./') url = url.substring(3);
            const response = await fetch(url);
            const source = await response.text();
            return await makeImportsResultsFromSource(source)
        }else{
            if(filePath.indexOf('://') !== -1){
                const response = await fetch(filePath);
                const source = await response.text();
                return await makeImportsResultsFromSource(source);
            }else{
                return await new Promise( (resolve, reject)=>{
                    let location = filePath;
                    if(location.substring(0,2) === './'){
                        location = path.join(process.cwd(), location);
                    }
                    fs.readFile(location, async(err, data)=>{
                        if(err) reject(err);
                        const source = data.toString();
                        const results = await makeImportsResultsFromSource(source);
                        resolve(results)
                    });
                });
            }
        }
    }catch(ex){
        console.log('EX', ex);
    }
};