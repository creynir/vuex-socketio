import chai from 'chai';
import 'mocha-sinon';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { normalizeString, toUppSnakeCase, __RewireAPI__ as utilsAPI } from '../utils/utils.js';

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
    describe('converters', function () {
        const mockStrings = ['someString ', 'SomeString', '/someString/ ', '_SomeString_', '-some-string-', 'some_string', '_SOME-STRING_', ' SOME_STRING'];

        describe('toUppSnakeCase', function () {
            it('should convert all strings to snake case', function () {
                const mockInputString = 'some string';
                const resultString = 'SOME_STRING';
                const toSpaceCaseSpy = sinon.stub().returns(mockInputString);
                utilsAPI.__Rewire__('toSpaceCase', toSpaceCaseSpy);
                expect(toUppSnakeCase(mockInputString)).to.eql(resultString);
            });
        });
        describe('toSpaceCase', function () {
            it('should convert all strings to space case', function () {
                const toSpaceCase = utilsAPI.__get__('toSpaceCase');
                const resultString = 'some string';
                mockStrings.forEach(function (str) {
                    expect(toSpaceCase(str).toLowerCase()).to.eql(resultString);
                });
            });
        });
    });
});
