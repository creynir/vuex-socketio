import chai from 'chai';
import sinon from 'sinon';
import 'mocha-sinon';
import sinonChai from 'sinon-chai';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';

import createSocketIoPlugin, { __RewireAPI__ as pluginAPI } from '../index.js';
import socketMock from '../mocks/socket.io.mock.js';

const localVue = createLocalVue();
localVue.use(Vuex);

const expect = chai.expect;
chai.use(sinonChai);

describe('main', function () {
    let store;
    const socketOnConnectStub = sinon.stub();
    const socketOnDisconnectStub = sinon.stub();
    const socketOnMessageMutationStub = sinon.stub();
    const socketOnMessageActionStub = sinon.stub();

    const namespaceSocketOnConnectStub = sinon.stub();
    const namespaceSocketOnDisconnectStub = sinon.stub();
    const namespaceSocketOnMessageMutationStub = sinon.stub();
    const namespaceSocketOnMessageActionStub = sinon.stub();

    const module = {
        namespaced: true,
        mutations: {
            socketOnConnect: socketOnConnectStub,
            socketOnDisconnect: socketOnDisconnectStub,
            socketOnMessage: socketOnMessageMutationStub,

            namespaceSocketOnConnect: namespaceSocketOnConnectStub,
            namespaceSocketOnDisconnect: namespaceSocketOnDisconnectStub,
            namespaceSocketOnMessage: namespaceSocketOnMessageMutationStub
        },
        actions: {
            socketConnect: () => {},
            socketDisconnect: () => {},
            socketEmitSomeChannel: (context, message) => {},
            socketOnMessage: socketOnMessageActionStub,

            namespaceSocketConnect: () => {},
            namespaceSocketDisconnect: () => {},
            namespaceSocketEmitSomeChannel: (context, message) => {},
            namespaceSocketOnMessage: namespaceSocketOnMessageActionStub
        }
    };

    describe('store integration', function () {
        let io;
        let nspIo;
        beforeEach(function () {
            io = socketMock();
            nspIo = socketMock('namespace');
            const socketPlugin = createSocketIoPlugin([io, nspIo]);
            store = new Vuex.Store({
                modules: {
                    module
                },
                plugins: [socketPlugin]
            });
        });
        afterEach(function () {
            sinon.reset();
        });
        describe('call socket functions', function () {
            it('plugin should call socket connect', function () {
                const socketSpy = sinon.spy(io, 'connect');

                store.dispatch('module/socketConnect');

                expect(socketSpy).to.have.been.callCount(1);
                expect(socketOnConnectStub).to.have.been.callCount(1);
                expect(namespaceSocketOnConnectStub.notCalled).to.eql(true);
            });

            it('plugin should call nsp socket connect', function () {
                const nspSocketSpy = sinon.spy(nspIo, 'connect');

                store.dispatch('module/namespaceSocketConnect');

                expect(nspSocketSpy).to.have.been.callCount(1);
                expect(namespaceSocketOnConnectStub).to.have.been.callCount(1);
                expect(socketOnConnectStub.notCalled).to.eql(true);
            });

            it('plugin should call socket disconnect', function () {
                const socketSpy = sinon.spy(io, 'disconnect');

                store.dispatch('module/socketDisconnect');

                expect(socketSpy).to.have.been.callCount(1);
                expect(socketOnDisconnectStub).to.have.been.callCount(1);
                expect(namespaceSocketOnDisconnectStub.notCalled).to.eql(true);
            });

            it('plugin should call nsp socket disconnect', function () {
                const nspSocketSpy = sinon.spy(nspIo, 'disconnect');

                store.dispatch('module/namespaceSocketDisconnect');

                expect(nspSocketSpy).to.have.been.callCount(1);
                expect(namespaceSocketOnDisconnectStub).to.have.been.callCount(1);
                expect(socketOnDisconnectStub.notCalled).to.eql(true);
            });
        });
        describe('call on()', function () {
            it('should subscribe to all default events', function () {
                expect(Object.keys(io.eventsMap).length).to.eql(13);
                expect(Object.keys(nspIo.eventsMap).length).to.eql(13);
            });
        });
        describe('call emit()', function () {
            const mockPayload = 'somePayload';
            const mockChannelName = 'SOME_CHANNEL';

            it('should call emit in socket without namespace', function () {
                const socketEmitSpy = sinon.spy(io, 'emit');
                store.dispatch('module/socketEmitSomeChannel', (mockPayload));
                expect(socketEmitSpy).to.have.been.calledWith(mockChannelName, mockPayload);
            });

            it('should call emit in socket with namespace', function () {
                const nspSocketEmitSpy = sinon.spy(nspIo, 'emit');
                store.dispatch('module/namespaceSocketEmitSomeChannel', (mockPayload));
                expect(nspSocketEmitSpy).to.have.been.calledWith(mockChannelName, mockPayload);
            });
        });
        describe('call onevent()', function () {
            it('should call correct actions and mutations without socket namespace', function () {
                const mockPacket = { data: ['message', 'somePayload'] };

                io.onevent(mockPacket);

                expect(socketOnMessageMutationStub).to.have.been.callCount(1);
                expect(socketOnMessageActionStub).to.have.been.callCount(1);
                expect(namespaceSocketOnMessageMutationStub.notCalled).to.eql(true);
                expect(namespaceSocketOnMessageActionStub.notCalled).to.eql(true);
            });

            it('should call correct actions and mutations with socket namespace', function () {
                const mockPacket = { data: ['message', 'somePayload'] };

                nspIo.onevent(mockPacket);

                expect(namespaceSocketOnMessageMutationStub).to.have.been.callCount(1);
                expect(namespaceSocketOnMessageActionStub).to.have.been.callCount(1);
                expect(socketOnMessageMutationStub.notCalled).to.eql(true);
                expect(socketOnMessageActionStub.notCalled).to.eql(true);
            });
        });
    });
    describe('pluginApi', function () {
        describe('commitToStore', function () {
            it('should call store actions and mutations', function () {
                const mockPayload = 'someMessage';
                const mockChannelName = 'message';
                const mockOPtions = { storeMutations: Object.keys(module.mutations), storeActions: Object.keys(module.actions), onPrefix: '', modulesNspList: [], socketNsp: '' };

                const normalizeStringSpy = sinon.stub().returns(mockChannelName);
                pluginAPI.__Rewire__('normalizeString', normalizeStringSpy);
                const checkTypeSpy = sinon.stub().returns(true);
                pluginAPI.__Rewire__('checkType', checkTypeSpy);
                const commitToStore = pluginAPI.__get__('commitToStore');

                const commitSpy = sinon.stub();
                const dispatchSpy = sinon.stub();
                const store = { commit: commitSpy, dispatch: dispatchSpy };

                commitToStore(store, mockChannelName, mockPayload, mockOPtions);

                expect(normalizeStringSpy).calledWith(mockChannelName);
                mockOPtions.storeMutations.forEach(function (mutation) {
                    expect(checkTypeSpy).calledWith(mutation, mockOPtions.socketNsp + mockOPtions.onPrefix + mockChannelName, mockOPtions.modulesNspList);
                    expect(commitSpy).calledWith(mutation);
                });
                mockOPtions.storeActions.forEach(function (action) {
                    expect(checkTypeSpy).calledWith(action, mockOPtions.socketNsp + mockOPtions.onPrefix + mockChannelName, mockOPtions.modulesNspList);
                    expect(dispatchSpy).calledWith(action);
                });

                pluginAPI.__ResetDependency__('normalizeString');
                pluginAPI.__ResetDependency__('checkType');
            });
        });
        describe('checkType', function () {
            const mockWrongType = 'someaction';
            const mockCorrectType = 'socketonsometype';
            const mockTypeModuleNsp = 'modulesocketonsometype';
            const mockPrefix = 'socketon';
            const mockModuleNspList = ['module', 'otherModule'];
            const mockEmptyModuleNspList = [];

            const normalizeStringSpy = sinon.stub();
            const checkType = pluginAPI.__get__('checkType');

            beforeEach(function () {
                pluginAPI.__Rewire__('normalizeString', normalizeStringSpy);
            });
            afterEach(function () {
                normalizeStringSpy.reset();
                pluginAPI.__ResetDependency__('normalizeString');
            });

            it('should return false by wrong type name and empty moduleNspList', function () {
                normalizeStringSpy.onFirstCall().returns(mockWrongType)
                    .onSecondCall().returns(mockPrefix);
                const result = checkType(mockWrongType, mockPrefix, mockEmptyModuleNspList);
                expect(result).to.eql(false);
            });

            it('should return false by wrong type name and moduleNspList contains namespaces', function () {
                normalizeStringSpy.onFirstCall().returns(mockWrongType)
                    .onSecondCall().returns(mockPrefix);
                const result = checkType(mockWrongType, mockPrefix, mockModuleNspList);
                expect(result).to.eql(false);
            });

            it('should return true by correct type name and empty moduleNspList', function () {
                normalizeStringSpy.onFirstCall().returns(mockCorrectType)
                    .onSecondCall().returns(mockPrefix);
                const result = checkType(mockCorrectType, mockPrefix, mockEmptyModuleNspList);
                expect(result).to.eql(true);
            });

            it('should return true by correct type name and moduleNspList contains namespaces', function () {
                normalizeStringSpy.onFirstCall().returns(mockCorrectType)
                    .onSecondCall().returns(mockPrefix);
                const result = checkType(mockCorrectType, mockPrefix, mockModuleNspList);
                expect(result).to.eql(true);
            });

            it('should return true by by type with module namespace and moduleNspList contains namespaces', function () {
                normalizeStringSpy.onFirstCall().returns(mockTypeModuleNsp)
                    .onSecondCall().returns(mockPrefix);
                const result = checkType(mockTypeModuleNsp, mockPrefix, mockModuleNspList);
                expect(result).to.eql(true);
            });
        });
        describe('getChannelName', function () {
            it('should return correct channelName', function () {
                const mockActionType = 'SomeActionSocketEmitMessage';
                const mockPrefix = 'SocketEmit';
                const mockResult = 'Message';

                const toPascalCaseSpy = sinon.stub();
                toPascalCaseSpy.onFirstCall().returns(mockActionType)
                    .onSecondCall().returns(mockPrefix);
                const mockFormatters = { PascalCase: toPascalCaseSpy };
                pluginAPI.__Rewire__('formatters', mockFormatters);

                const getChannelName = pluginAPI.__get__('getChannelName');

                const result = getChannelName(mockActionType, mockPrefix);

                expect(toPascalCaseSpy).calledWith(mockActionType);
                expect(toPascalCaseSpy).calledWith(mockPrefix);
                expect(result).to.eql(mockResult);

                pluginAPI.__ResetDependency__('formatters');
            });
        });
        describe('isSocketFuncPersist', function () {
            const callSocketFunction = pluginAPI.__get__('callSocketFunction');

            it('should return true by correct function name', function () {
                const connectStub = sinon.stub();
                const socket = { connect: connectStub };
                const mockCorrectFnName = 'connect';

                callSocketFunction(socket, mockCorrectFnName);
                expect(connectStub).to.have.been.callCount(1);
            });

            it('should return false by wrong function name', function () {
                const connectStub = sinon.stub();
                const socket = { connect: connectStub };
                const mockWrongFnName = 'wrongName';

                callSocketFunction(socket, mockWrongFnName);
                expect(connectStub).to.have.been.callCount(0);
            });
        });
    });
});
