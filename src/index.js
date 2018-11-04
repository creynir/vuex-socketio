import { toUppSnakeCase, normalizeString } from './utils/utils.js';

export default function createSocketIoPlugin (socket, { converter = toUppSnakeCase, emitPrefix = 'socketEmit', onPrefix = 'socketOn', defaultFunctions: defaultFunctions = [] } = {}) {
    const sockets = getSocketAsArr(socket);

    defaultFunctions = defaultFunctions.concat(['socketConnect', 'socketDisconnect']);

    const options = { converter, emitPrefix, onPrefix, defaultFunctions };

    return store => {
        sockets.forEach(socket => {
            let _options = Object.assign({}, options);
            _options.defaultFnPrefix = 'socket';
            _options.socketNsp = socket.nsp === '/' ? '' : normalizeString(socket.nsp.slice(1));
            _options.modulesNspList = Object.keys(store._modulesNamespaceMap).map(nsp => normalizeString(nsp));
            _options.store = store;
            _options.socket = socket;
            _options.defaultChannels = [
                'connect',
                'error',
                'disconnect',
                'reconnect',
                'reconnect_attempt',
                'reconnecting',
                'reconnect_error',
                'reconnect_failed',
                'connect_error',
                'connect_timeout',
                'connecting',
                'ping',
                'pong'
            ];

            bindMutationsToSocket(_options);
            bindActionsToSocket(_options);
        });
    };
}
/** Binds all store mutations to socket listeners by prefix in their name
 * @param options
 * @api private
 */
function bindMutationsToSocket (options) {
    Object.entries(options.store._mutations).forEach(([mutationName, funcArr]) => {
        if (checkType(mutationName, options.socketNsp + options.onPrefix, options.modulesNspList)) {
            bindFunctionToListener(mutationName, funcArr, options);
        }
    });
}

/** Binds all store actions 3 different function types:
 * 1. Bind action to socket listener if its name contains onPrefix
 * 2. Bind action to socket emitter if its name contains emitPrefix
 * 3. Bind action to socket default function if its name contains defaultFnPrefix and the function exists
 * @param options
 * @api private
 */
function bindActionsToSocket (options) {
    Object.entries(options.store._actions).forEach(([actionName, funcArr]) => {
        if (checkType(actionName, options.socketNsp + options.onPrefix, options.modulesNspList)) {
            bindFunctionToListener(actionName, funcArr, options);
        }
        if (checkType(actionName, options.socketNsp + options.emitPrefix, options.modulesNspList)) {
            bindActionToEmitter(actionName, funcArr, options);
        }
        const functionName = options.defaultFunctions.find(fnName => checkType(actionName, options.socketNsp + fnName, options.modulesNspList));
        if (functionName && functionName.indexOf(options.defaultFnPrefix) !== -1) {
            bindDefaultActionToSocket(actionName, funcArr, functionName, options);
        }
    });
}

/** Bind store function to socket listener if its name contains onPrefix
 * @param functionName
 * @param funcArr
 * @param options
 * @api private
 */
function bindFunctionToListener (functionName, funcArr, options) {
    const channelName = getChannelName(functionName, options.onPrefix);
    const fChannelName = options.defaultChannels.find(item => item === channelName.toLowerCase()) || options.converter(channelName);
    funcArr.forEach((func) => {
        options.socket.on(fChannelName, (payload) =>
            func(payload));
    });
}

/** Bind action to socket emitter if its name contains emitPrefix
 * @param actionName
 * @param funcArr
 * @param options
 * @api private
 */
function bindActionToEmitter (actionName, funcArr, options) {
    const channelName = getChannelName(actionName, options.emitPrefix);
    funcArr.forEach((func, index) => {
        options.store._actions[actionName][index] = (payload) => {
            options.socket.emit(options.converter(channelName), payload);
            func.call(options.store, payload);
        };
    });
}

/** Bind action to sockets default function if actions name contains defaultFnPrefix and the function exists in socket
 * @param actionName
 * @param funcArr
 * @param functionName
 * @param options
 * @api private
 */
function bindDefaultActionToSocket (actionName, funcArr, functionName, options) {
    const socketFnName = getChannelName(functionName, options.defaultFnPrefix).toLowerCase();
    if (checkIfSocketFnExists(socketFnName, options.socket)) {
        funcArr.forEach((func, index) => {
            options.store._actions[actionName][index] = (payload) => {
                func.call(options.store, payload);
                options.socket[socketFnName]();
            };
        });
    }
}

/** Check if the function type (name)
 * includes the module namespace with prefix
 * @param type of function
 * @param prefix
 * @param modulesNspList with module namespaces
 * @return boolean
 * @api private
 */
function checkType (type, prefix, modulesNspList) {
    const normalizedType = normalizeString(type);
    const normalizedPrefix = normalizeString(prefix);
    const moduleNamespace = modulesNspList.find(moduleNsp => normalizedType.includes(moduleNsp + normalizedPrefix)) || '';
    return normalizedType.startsWith(moduleNamespace + normalizedPrefix);
}

/** Return socket channel name sliced from action type
 * @param actionType
 * @param prefix
 * @return string channelName
 * @api private
 */
function getChannelName (actionType, prefix) {
    const pActionType = toUppSnakeCase(actionType);
    const pPrefix = toUppSnakeCase(prefix);
    return pActionType.slice(pActionType.indexOf(pPrefix) + pPrefix.length + 1);
}

/** Return true if function exists in socket instance
 * @param socketFnName
 * @param socket
 * @return boolean
 * @api private
 */
function checkIfSocketFnExists (socketFnName, socket) {
    return typeof socket[socketFnName] === 'function';
}

/** Return socket in array
 * @param socket
 * @return []
 * @api private
 */
function getSocketAsArr (socket) {
    return Array.isArray(socket) ? socket : [socket];
}
