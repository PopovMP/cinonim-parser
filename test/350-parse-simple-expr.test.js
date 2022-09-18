'use strict'

const {strictEqual} = require('assert')

const {tokenize, clean} = require('@popovmp/tokenizer')
const {describe, it}    = require('@popovmp/mocha-tiny')

const {parse, stringifyAst} = require('../src/parser')

/**
 * Parses source code to Nodes
 * @param {string} src
 *
 * @return {Node}
 */
function parseModule(src)
{
	const tokens  = tokenize(src)
	const cleaned = clean(tokens)
	return parse(cleaned)
}

describe('parse expression chain', () => {

	it('expr two', () => {
		const src = '' +
`void foo() {
	double out;
	out = 1+2;
	out = 1+(2+3);
	out = (1+2)*(3+4);
	out = (1+2)*3;
	out = -out;
}`
		const str = stringifyAst( parseModule(src) )
		const expected = '' +
`module module
    function foo: void
        funcParams
        funcBody: void
            localVar out: f64
            localSet out: f64
                binaryOperator +: f64
                    number 1: f64
                    number 2: f64
            localSet out: f64
                binaryOperator +: f64
                    number 1: f64
                    binaryOperator +: f64
                        number 2: f64
                        number 3: f64
            localSet out: f64
                binaryOperator *: f64
                    binaryOperator +: f64
                        number 1: f64
                        number 2: f64
                    binaryOperator +: f64
                        number 3: f64
                        number 4: f64
            localSet out: f64
                binaryOperator *: f64
                    binaryOperator +: f64
                        number 1: f64
                        number 2: f64
                    number 3: f64
            localSet out: f64
                prefixOperator -: f64
                    localGet out: f64`
		strictEqual(str, expected)
	})
})
