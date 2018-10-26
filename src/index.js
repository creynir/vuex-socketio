import { formatters, normalizeString } from './utils/utils.js';

export default function createSocketIoPlugin (socket, { channelFormat = 'UppSnakeCase', emitPrefix = 'socketEmit', onPrefix = 'socketOn', defaultPrefixes = [] } = {}) {
    const sockets = Array.isArray(socket) ? socket : [socket];
    const defaultFnPrefix = 'socket';
    const channelFormatter = formatters[channelFormat];

    defaultPrefixes = defaultPrefixes.concat(['socketConnect', 'socketDisconnect']).map(prefix => normalizeString(prefix));

    const options = { channelFormat, emitPrefix, onPrefix, defaultPrefixes };

    return store => {
        sockets.forEach(socket => {
            let _options = Object.assign({}, options);
            _options.socketNsp = socket.nsp === '/' ? '' : normalizeString(socket.nsp.slice(1));
            _options.modulesNspList = Object.keys(store._modulesNamespaceMap).map(nsp => normalizeString(nsp));
            _options.storeMutations = Object.keys(store._mutations);
            _options.storeActions = Object.keys(store._actions);

            /** Fire on all socket events,
             * trigger commitToStoreFunction
             *  @param packet with channel name and payload
             *  @api private
             */
            const onevent = socket.onevent;
            socket.onevent = function (packet) {
                onevent.call(socket, packet);
                const channelName = packet.data[0];
                const payload = packet.data[1];
                commitToStore(store, channelName, payload, _options);
            };

            /** Fire on all default events,
             * trigger commitToStoreFunction
             * @api private
             */
            [
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
            ].forEach(channelName =>
                socket.on(channelName, (payload) =>
                    commitToStore(store, channelName, payload, _options)));

            /** Subscribe the socket.emit and default socket fn's to all related actions
             * by prefix, moduleNspList and socket namespace
             *  @param action
             *  @api private
             */
            store.subscribeAction(action => {
                if (checkType(action.type, _options.socketNsp + _options.emitPrefix, _options.modulesNspList)) {
                    const channelName = getChannelName(action.type, _options.emitPrefix);
                    socket.emit(channelFormatter(channelName), action.payload);
                }
                const prefix = _options.defaultPrefixes.find(prefix => checkType(action.type, _options.socketNsp + prefix, _options.modulesNspList));
                if (prefix && prefix.indexOf(defaultFnPrefix) !== -1) {
                    const fnName = prefix.slice(prefix.indexOf(defaultFnPrefix) + defaultFnPrefix.length);
                    callSocketFunction(socket, fnName);
                }
            });
        });
    };
}

/** Commit payload to target mutation and action by channelName,
 * socket namespace, prefix and modulesNspList
 *  @param store
 *  @param channelName
 *  @param payload
 *  @param _options with storeMutations, onPrefix and modulesNspList
 *  @api private
 */
function commitToStore (store, channelName, payload, _options) {
    const normalizedChannelName = normalizeString(channelName);
    _options.storeMutations.forEach(mutationType => {
        if (checkType(mutationType, _options.socketNsp + _options.onPrefix + normalizedChannelName, _options.modulesNspList)) {
            store.commit(mutationType, payload);
        }
    });
    _options.storeActions.forEach(actionType => {
        if (checkType(actionType, _options.socketNsp + _options.onPrefix + normalizedChannelName, _options.modulesNspList)) {
            store.dispatch(actionType, payload);
        }
    });
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
    const moduleNamespace = modulesNspList.find(moduleNsp => normalizedType.includes(moduleNsp + normalizedPrefix));
    if (moduleNamespace) {
        return normalizedType.slice(normalizedType.indexOf(moduleNamespace) + moduleNamespace.length).startsWith(normalizedPrefix);
    }
    return normalizedType.startsWith(normalizedPrefix);
}

/** Return socket channel name sliced from action type
 * @param actionType
 * @param prefix
 * @return string channelName
 * @api private
 */
function getChannelName (actionType, prefix) {
    const pActionType = formatters.PascalCase(actionType);
    const pPrefix = formatters.PascalCase(prefix);
    return pActionType.slice(pActionType.indexOf(pPrefix) + pPrefix.length);
}

/** Calls requested socket function if exists
 * @param socket
 * @param fnName
 * @api private
 */
function callSocketFunction (socket, fnName) {
    if (typeof socket[fnName] === 'function') {
        socket[fnName]();
    }
}
