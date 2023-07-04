/**
 * A JSON object
 */
declare type JSON = any;

/**
 * set the baseDir
 */
declare function setBaseDir(): void;

/**
 * This function fetches the package in a uniform way
 * @returns importList
 */
declare function scanImports(): JSON;

