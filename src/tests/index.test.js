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
            socketConnect: () => {
            },
            socketDisconnect: () => {
            },
            socketEmitSomeChannel: (context, message) => {
            },
            socketOnMessage: socketOnMessageActionStub,

            namespaceSocketConnect: () => {
            },
            namespaceSocketDisconnect: () => {
            },
            namespaceSocketEmitSomeChannel: (context, message) => {
            },
            namespaceSocketOnMessage: namespaceSocketOnMessageActionStub
        }
    };

    const module2 = {
        mutations: {
            socketOnConnect: socketOnConnectStub,
            socketOnDisconnect: socketOnDisconnectStub,
            socketOnMessage: socketOnMessageMutationStub,

            namespaceSocketOnConnect: namespaceSocketOnConnectStub,
            namespaceSocketOnDisconnect: namespaceSocketOnDisconnectStub,
            namespaceSocketOnMessage: namespaceSocketOnMessageMutationStub
        },
        actions: {
            socketConnect: () => {
            },
            socketDisconnect: () => {
            },
            namespaceSocketConnect: () => {
            },
            namespaceSocketDisconnect: () => {
            }
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
                    module,
                    module2
                },
                plugins: [socketPlugin]
            });
        });
        afterEach(function () {
            sinon.reset();
        });
        describe('call socket functions', function () {
            it('plugin should call module socket connect', function () {
                const socketSpy = sinon.spy(io, 'connect');

                store.dispatch('module/socketConnect');

                expect(socketSpy).to.have.been.callCount(1);
                expect(socketOnConnectStub).to.have.been.callCount(2);
                expect(namespaceSocketOnConnectStub.notCalled).to.eql(true);
            });

            it('plugin should call socket connect', function () {
                const socketSpy = sinon.spy(io, 'connect');

                store.dispatch('socketConnect');

                expect(socketSpy).to.have.been.callCount(1);
                expect(socketOnConnectStub).to.have.been.callCount(2);
                expect(namespaceSocketOnConnectStub.notCalled).to.eql(true);
            });

            it('plugin should call nsp module socket connect', function () {
                const nspSocketSpy = sinon.spy(nspIo, 'connect');

                store.dispatch('module/namespaceSocketConnect');

                expect(nspSocketSpy).to.have.been.callCount(1);
                expect(namespaceSocketOnConnectStub).to.have.been.callCount(2);
                expect(socketOnConnectStub.notCalled).to.eql(true);
            });

            it('plugin should call nsp socket connect', function () {
                const nspSocketSpy = sinon.spy(nspIo, 'connect');

                store.dispatch('namespaceSocketConnect');

                expect(nspSocketSpy).to.have.been.callCount(1);
                expect(namespaceSocketOnConnectStub).to.have.been.callCount(2);
                expect(socketOnConnectStub.notCalled).to.eql(true);
            });

            it('plugin should call module socket disconnect', function () {
                const socketSpy = sinon.spy(io, 'disconnect');

                store.dispatch('module/socketDisconnect');

                expect(socketSpy).to.have.been.callCount(1);
                expect(socketOnDisconnectStub).to.have.been.callCount(2);
                expect(namespaceSocketOnDisconnectStub.notCalled).to.eql(true);
            });

            it('plugin should call socket disconnect', function () {
                const socketSpy = sinon.spy(io, 'disconnect');

                store.dispatch('socketDisconnect');

                expect(socketSpy).to.have.been.callCount(1);
                expect(socketOnDisconnectStub).to.have.been.callCount(2);
                expect(namespaceSocketOnDisconnectStub.notCalled).to.eql(true);
            });

            it('plugin should call nsp module socket disconnect', function () {
                const nspSocketSpy = sinon.spy(nspIo, 'disconnect');

                store.dispatch('module/namespaceSocketDisconnect');

                expect(nspSocketSpy).to.have.been.callCount(1);
                expect(namespaceSocketOnDisconnectStub).to.have.been.callCount(2);
                expect(socketOnDisconnectStub.notCalled).to.eql(true);
            });

            it('plugin should call nsp socket disconnect', function () {
                const nspSocketSpy = sinon.spy(nspIo, 'disconnect');

                store.dispatch('namespaceSocketDisconnect');

                expect(nspSocketSpy).to.have.been.callCount(1);
                expect(namespaceSocketOnDisconnectStub).to.have.been.callCount(2);
                expect(socketOnDisconnectStub.notCalled).to.eql(true);
            });
        });
        describe('call on()', function () {
            const mockDefaultChannels = [
                'connect',
                'disconnect'
            ];
            it('should subscribe to default events', function () {
                mockDefaultChannels.forEach(function (channel) {
                    expect(io.eventsMap[channel]).to.be.an('array');
                    expect(nspIo.eventsMap[channel]).to.be.an('array');
                });
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
        describe('call store listeners', function () {
            it('should call correct actions and mutations without socket namespace', function () {
                const mockChannelName = 'MESSAGE';
                const mockPayload = 'somePayload';
                io.emit(mockChannelName, mockPayload);

                expect(socketOnMessageMutationStub).to.have.been.callCount(2);
                expect(socketOnMessageMutationStub.getCall(0).args[1]).to.eql(mockPayload);
                expect(socketOnMessageActionStub).to.have.been.callCount(1);
                expect(socketOnMessageActionStub.getCall(0).args[1]).to.eql(mockPayload);

                expect(namespaceSocketOnMessageMutationStub.notCalled).to.eql(true);
                expect(namespaceSocketOnMessageActionStub.notCalled).to.eql(true);
            });

            it('should call correct actions and mutations with socket namespace', function () {
                const mockChannelName = 'MESSAGE';
                const mockPayload = 'somePayload';
                nspIo.emit(mockChannelName, mockPayload);

                expect(namespaceSocketOnMessageMutationStub).to.have.been.callCount(2);
                expect(namespaceSocketOnMessageMutationStub.getCall(0).args[1]).to.eql(mockPayload);
                expect(namespaceSocketOnMessageActionStub).to.have.been.callCount(1);
                expect(namespaceSocketOnMessageActionStub.getCall(0).args[1]).to.eql(mockPayload);

                expect(socketOnMessageMutationStub.notCalled).to.eql(true);
                expect(socketOnMessageActionStub.notCalled).to.eql(true);
            });
        });
    });
    describe('pluginApi', function () {
        describe('bind functions', function () {
            const socketOnStub = sinon.stub();
            const getChannelNameStub = sinon.stub();
            const converterStub = sinon.stub();
            const onConnectStub = sinon.stub();
            const onMessageStub = sinon.stub();
            const socketConnectStub = sinon.stub();
            const socketEmitterStub = sinon.stub();

            let checkTypeStub;

            const options = {
                store: {
                    _mutations: {},
                    _actions: {}
                },
                defaultChannels: ['connect'],
                socket: {
                    on: socketOnStub,
                    emit: socketEmitterStub,
                    connect: socketConnectStub
                },
                defaultFunctions: ['socketConnect', 'socketDisconnect'],
                converter: converterStub
            };
            beforeEach(function () {
                checkTypeStub = sinon.stub();
                pluginAPI.__Rewire__('checkType', checkTypeStub);
                pluginAPI.__Rewire__('getChannelName', getChannelNameStub);
            });
            afterEach(function () {
                socketOnStub.reset();
                getChannelNameStub.reset();
                converterStub.reset();
                onConnectStub.reset();
                onMessageStub.reset();
                socketConnectStub.reset();
                socketEmitterStub.reset();
                pluginAPI.__ResetDependency__('checkType');
                pluginAPI.__ResetDependency__('getChannelName');
            });
            describe('bindMutationsToSocket', function () {
                const bindMutationsToSocket = pluginAPI.__get__('bindMutationsToSocket');

                it('should bind mutation to default channel listener', function () {
                    const bindFunctionToListenerStub = sinon.stub();
                    pluginAPI.__Rewire__('bindFunctionToListener', bindFunctionToListenerStub);
                    checkTypeStub.returns(true);
                    options.store._mutations = { socketOnConnect: [onConnectStub] };
                    bindMutationsToSocket(options);

                    expect(bindFunctionToListenerStub).to.have.been.callCount(1);
                });
            });
            describe('bindActionsToSocket', function () {
                let bindFunctionToListenerStub;
                let bindActionToEmitterStub;
                let bindDefaultActionToSocketStub;
                const bindActionsToSocket = pluginAPI.__get__('bindActionsToSocket');

                beforeEach(function () {
                    bindFunctionToListenerStub = sinon.stub();
                    bindActionToEmitterStub = sinon.stub();
                    bindDefaultActionToSocketStub = sinon.stub();
                    pluginAPI.__Rewire__('checkType', checkTypeStub);
                    pluginAPI.__Rewire__('bindFunctionToListener', bindFunctionToListenerStub);
                    pluginAPI.__Rewire__('bindActionToEmitter', bindActionToEmitterStub);
                    pluginAPI.__Rewire__('bindDefaultActionToSocket', bindDefaultActionToSocketStub);
                });
                afterEach(function () {
                    pluginAPI.__ResetDependency__('bindActionToListener');
                    pluginAPI.__ResetDependency__('bindActionToEmitter');
                    pluginAPI.__ResetDependency__('bindDefaultActionToSocket');
                });

                it('should call bindFunctionToListener', function () {
                    checkTypeStub.onFirstCall().returns(true);
                    options.store._actions = {
                        socketOnMessage: [function () {
                        }]
                    };
                    bindActionsToSocket(options);

                    expect(bindFunctionToListenerStub).to.have.been.callCount(1);
                    expect(bindActionToEmitterStub).to.have.been.callCount(0);
                    expect(bindDefaultActionToSocketStub).to.have.been.callCount(0);
                });

                it('should call bindActionToEmitter', function () {
                    checkTypeStub.onSecondCall().returns(true);
                    options.store._actions = {
                        socketEmitMessage: [function () {
                        }]
                    };
                    bindActionsToSocket(options);

                    expect(bindActionToEmitterStub).to.have.been.callCount(1);
                    expect(bindFunctionToListenerStub).to.have.been.callCount(0);
                    expect(bindDefaultActionToSocketStub).to.have.been.callCount(0);
                });

                it('should call bindDefaultActionToSocket', function () {
                    checkTypeStub.onThirdCall().returns(true);
                    options.defaultFnPrefix = 'socket';
                    options.store._actions = {
                        socketConnect: [function () {
                        }]
                    };
                    bindActionsToSocket(options);

                    expect(bindDefaultActionToSocketStub).to.have.been.callCount(1);
                    expect(bindFunctionToListenerStub).to.have.been.callCount(0);
                    expect(bindActionToEmitterStub).to.have.been.callCount(0);
                });
            });
            describe('bindFunctionToListener', function () {
                const bindFunctionToListener = pluginAPI.__get__('bindFunctionToListener');

                it('should subscribe action to default channel', function () {
                    const mockChannelName = 'Connect';
                    const mockChannel = 'connect';
                    const mockActionName = 'socketOnConnect';
                    getChannelNameStub.onFirstCall().returns(mockChannelName);

                    bindFunctionToListener(mockActionName, [onConnectStub], options);
                    expect(socketOnStub.getCall(0).args[0]).to.eql(mockChannel);
                    expect(socketOnStub.getCall(0).args[1]).to.be.a('function');
                });

                it('should subscribe action to MESSAGE channel', function () {
                    const mockChannelName = 'Message';
                    const mockChannel = 'MESSAGE';
                    const mockActionName = 'socketOnMessage';
                    options.converter.returns(mockChannel);
                    getChannelNameStub.onFirstCall().returns(mockChannelName);

                    bindFunctionToListener(mockActionName, [onMessageStub], options);
                    expect(socketOnStub.getCall(0).args[0]).to.eql(mockChannel);
                    expect(socketOnStub.getCall(0).args[1]).to.be.a('function');
                });
            });
            describe('bindActionToEmitter', function () {
                it('should bind socket emitter to store action', function () {
                    const mockChannelName = 'Message';
                    const mockFuncArr = [function () {
                    }];
                    const mockActionName = 'socketEmitMessage';
                    const mockPayload = 'somePayload';
                    getChannelNameStub.onFirstCall().returns(mockChannelName);
                    options.store._actions = { socketEmitMessage: mockFuncArr };
                    const bindActionToEmitter = pluginAPI.__get__('bindActionToEmitter');

                    bindActionToEmitter(mockActionName, mockFuncArr, options);
                    options.store._actions.socketEmitMessage[0](mockPayload);
                    expect(socketEmitterStub).to.have.been.callCount(1);
                    expect(socketEmitterStub.getCall(0).args[1]).to.eql(mockPayload);
                });
            });
            describe('bindDefaultActionToSocket', function () {
                const bindDefaultActionToSocket = pluginAPI.__get__('bindDefaultActionToSocket');
                const checkIfSocketFnExistsStub = sinon.stub();
                const mockChannelName = 'Connect';
                const mockActionName = 'socketConnect';
                let mockFuncArr;

                beforeEach(function () {
                    mockFuncArr = [function () {}];
                    getChannelNameStub.returns(mockChannelName);
                    options.store._actions = { 'socketConnect': mockFuncArr };
                    pluginAPI.__Rewire__('checkIfSocketFnExists', checkIfSocketFnExistsStub);
                });
                afterEach(function () {
                    socketConnectStub.reset();
                    pluginAPI.__ResetDependency__('checkIfSocketFnExists');
                });

                it('should bind socket connect to store action', function () {
                    checkIfSocketFnExistsStub.returns(true);

                    bindDefaultActionToSocket(mockActionName, mockFuncArr, mockActionName, options);
                    options.store._actions.socketConnect[0]();
                    expect(socketConnectStub).to.have.been.callCount(1);
                });

                it('should ignore store action', function () {
                    checkIfSocketFnExistsStub.returns(false);

                    bindDefaultActionToSocket(mockActionName, mockFuncArr, mockActionName, options);
                    options.store._actions.socketConnect[0]();
                    expect(socketConnectStub).to.have.been.callCount(0);
                });
            });
        });
        describe('checkType', function () {
            const mockWrongType = 'someaction';
            const mockCorrectType = 'socketonsometype';
            const mockTypeModuleNsp = 'modulesocketonsometype';
            const mockPrefix = 'socketon';
            const mockModuleNspList = ['module', 'otherModule'];
            const mockEmptyModuleNspList = [];

            const normalizeStringStub = sinon.stub();
            const checkType = pluginAPI.__get__('checkType');

            beforeEach(function () {
                pluginAPI.__Rewire__('normalizeString', normalizeStringStub);
            });
            afterEach(function () {
                normalizeStringStub.reset();
                pluginAPI.__ResetDependency__('normalizeString');
            });

            it('should return false by wrong type name and empty moduleNspList', function () {
                normalizeStringStub.onFirstCall().returns(mockWrongType)
                    .onSecondCall().returns(mockPrefix);
                const result = checkType(mockWrongType, mockPrefix, mockEmptyModuleNspList);
                expect(result).to.eql(false);
            });

            it('should return false by wrong type name and moduleNspList contains namespaces', function () {
                normalizeStringStub.onFirstCall().returns(mockWrongType)
                    .onSecondCall().returns(mockPrefix);
                const result = checkType(mockWrongType, mockPrefix, mockModuleNspList);
                expect(result).to.eql(false);
            });

            it('should return true by correct type name and empty moduleNspList', function () {
                normalizeStringStub.onFirstCall().returns(mockCorrectType)
                    .onSecondCall().returns(mockPrefix);
                const result = checkType(mockCorrectType, mockPrefix, mockEmptyModuleNspList);
                expect(result).to.eql(true);
            });

            it('should return true by correct type name and moduleNspList contains namespaces', function () {
                normalizeStringStub.onFirstCall().returns(mockCorrectType)
                    .onSecondCall().returns(mockPrefix);
                const result = checkType(mockCorrectType, mockPrefix, mockModuleNspList);
                expect(result).to.eql(true);
            });

            it('should return true by by type with module namespace and moduleNspList contains namespaces', function () {
                normalizeStringStub.onFirstCall().returns(mockTypeModuleNsp)
                    .onSecondCall().returns(mockPrefix);
                const result = checkType(mockTypeModuleNsp, mockPrefix, mockModuleNspList);
                expect(result).to.eql(true);
            });
        });
        describe('getChannelName', function () {
            it('should return correct channelName', function () {
                const mockActionType = 'SOME_SOCKET_EMIT_MESSAGE';
                const mockPrefix = 'SOCKET_EMIT';
                const mockResult = 'MESSAGE';

                const toUppSnakeCaseStub = sinon.stub();
                toUppSnakeCaseStub.onFirstCall().returns(mockActionType)
                    .onSecondCall().returns(mockPrefix);
                pluginAPI.__Rewire__('toUppSnakeCase', toUppSnakeCaseStub);

                const getChannelName = pluginAPI.__get__('getChannelName');

                const result = getChannelName(mockActionType, mockPrefix);

                expect(toUppSnakeCaseStub).calledWith(mockActionType);
                expect(toUppSnakeCaseStub).calledWith(mockPrefix);
                expect(result).to.eql(mockResult);

                pluginAPI.__ResetDependency__('toUppSnakeCase');
            });
        });
        describe('checkIfSocketFnExists', function () {
            const mockSocket = { connect: function () {} };
            const checkIfSocketFnExists = pluginAPI.__get__('checkIfSocketFnExists');

            it('should return true by correct function name', function () {
                const mockCorrectFnName = 'connect';
                expect(checkIfSocketFnExists(mockCorrectFnName, mockSocket)).to.eql(true);
            });

            it('should return false by wrong function name', function () {
                const mockWrongFnName = 'wrongName';
                expect(checkIfSocketFnExists(mockWrongFnName, mockSocket)).to.eql(false);
            });
        });
        describe('getSocketAsArr', function () {
            const getSocketAsArr = pluginAPI.__get__('getSocketAsArr');

            it('should put socket into array and return', function () {
                const mockSocket = '';
                expect(getSocketAsArr(mockSocket)).to.be.an('array').that.have.length(1);
            });

            it('should return false by wrong function name', function () {
                const mockSocketArr = ['', ''];
                expect(getSocketAsArr(mockSocketArr)).to.be.an('array').that.have.length(2);
            });
        });
    });
});
