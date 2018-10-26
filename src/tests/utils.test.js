import chai from 'chai';
import sinon from 'sinon';
import 'mocha-sinon';
import sinonChai from 'sinon-chai';

import { normalizeString, formatters, __RewireAPI__ as utilsAPI } from '../utils/utils.js';

const expect = chai.expect;
chai.use(sinonChai);

describe('utils', function () {
    describe('normalizeString', function () {
        it('should return string cleaned from non-char symbols', function () {
            const mockString = 'test-string_for/Testing?normalizeString';
            const resString = 'teststringfortestingnormalizestring';
            expect(normalizeString(mockString)).to.eql(resString);
        });
    });
    describe('formatters', function () {
        const mockString = 'someString';
        it('formatter should call toCamelCase', () => {
            const camelCase = 'CamelCase';
            const toCamelCaseSpy = sinon.stub();

            utilsAPI.__Rewire__('toCamelCase', toCamelCaseSpy);
            formatters[camelCase](mockString);
            expect(toCamelCaseSpy).calledWith(mockString);
            utilsAPI.__ResetDependency__('toCamelCase');
        });
        it('formatter should call toPascalCase', () => {
            const pascalCase = 'PascalCase';
            const toPascalCaseSpy = sinon.stub();

            utilsAPI.__Rewire__('toPascalCase', toPascalCaseSpy);
            formatters[pascalCase](mockString);
            expect(toPascalCaseSpy).calledWith(mockString);
            utilsAPI.__ResetDependency__('toPascalCase');
        });
        it('formatter should call toSnakeCase with different params', () => {
            const uppSnakeCase = 'UppSnakeCase';
            const lowSankeCase = 'LowSnakeCase';

            const toSnakeCaseSpy = sinon.stub().returns(mockString);
            utilsAPI.__Rewire__('toSnakeCase', toSnakeCaseSpy);

            formatters[uppSnakeCase](mockString + 'upp');
            expect(toSnakeCaseSpy).calledWith(mockString + 'upp');

            formatters[lowSankeCase](mockString + 'low');
            expect(toSnakeCaseSpy).calledWith(mockString + 'low');
            utilsAPI.__ResetDependency__('toSnakeCase');
        });
    });
    describe('converters', function () {
        const mockStrings = ['someString', 'SomeString', 'some-string', 'some_string', 'SOME-STRING', 'SOME_STRING'];
        describe('toCamelCase', function () {
            it('should convert all strings to camel case', function () {
                const toCamelSase = utilsAPI.__get__('toCamelCase');
                const resultString = 'someString';
                mockStrings.forEach(function (str) {
                    expect(toCamelSase(str)).to.eql(resultString);
                });
            });
        });
        describe('toPascalCase', function () {
            it('should convert all strings to pascal case', function () {
                const toPascalCase = utilsAPI.__get__('toPascalCase');
                const resultString = 'SomeString';
                mockStrings.forEach(function (str) {
                    expect(toPascalCase(str)).to.eql(resultString);
                });
            });
        });
        describe('toSnakeCase', function () {
            it('should convert all strings to snake case', function () {
                const toSnakeCase = utilsAPI.__get__('toSnakeCase');
                const resultString = 'some_string';
                mockStrings.forEach(function (str) {
                    expect(toSnakeCase(str).toLowerCase()).to.eql(resultString);
                });
            });
        });
    });
});
