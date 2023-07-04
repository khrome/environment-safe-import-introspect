/* global describe:false, it:false */
import { chai } from 'environment-safe-chai';
import { scanImports, setBaseDir } from '../src/index.mjs';
const should = chai.should();
console.log('foo')

describe('module', ()=>{
    describe('performs a simple test suite', ()=>{
        it('can profile this file', async ()=>{
            setBaseDir('/');
            const result = await scanImports('./test/test.mjs');
            should.exist(result);
            result.indexOf('environment-safe-chai').should.not.equal(-1);
            result.indexOf('../src/index.mjs').should.not.equal(-1);
        });
    });
});

