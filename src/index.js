export default function createSocketIoPlugin(socket, options) {
    const sockets = Array.isArray(socket) ? socket : [socket];
    options = options || {};
    options.emitPrefix = options.emitPrefix || 'socket_emit_';
    options.onPrefix = options.onPrefix || 'socket_on_';
    options.defaultPrefixes = options.defaultPrefixes || [];
    options.defaultPrefixes = options.defaultPrefixes.concat(['socket_connect', 'socket_disconnect']);

    return store => {
        sockets.forEach(socket => {

            let _options = Object.assign({}, options);
            _options.socketNsp = socket.nsp === '/' ? '' : socket.nsp.slice(1) + '_';
            _options.modulesNspList = Object.keys(store._modulesNamespaceMap);
            _options.storeMutations = Object.keys(store._mutations);
            _options.storeActions = Object.keys(store._actions);

            /**Fire on all socket events,
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

            /**Fire on all default events,
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

            /**Subscribe the socket.emit and default socket fn's to all related actions
             * by prefix, moduleNspList and socket namespace
             *  @param action
             *  @api private
             */
            store.subscribeAction(action => {
                if (checkType(action.type, _options.socketNsp + _options.emitPrefix, _options.modulesNspList)) {
                    const channelName = getChannelName(action.type, _options.emitPrefix);
                    socket.emit(channelName, action.payload);
                }
                const prefix = _options.defaultPrefixes.find(prefix => checkType(action.type, _options.socketNsp + prefix, _options.modulesNspList));
                if (prefix && prefix.lastIndexOf('socket_') !== -1) {
                    const defaultFn = prefix.slice(prefix.indexOf('socket_') + 'socket_'.length);
                    typeof socket[defaultFn] === 'function' ? socket[defaultFn]() : null;
                }
            })
        });
    }
}

/**Commit payload to target mutation by channelName,
 * socket namespace, prefix and modulesNspList
 *  @param store
 *  @param channelName
 *  @param payload
 *  @param _options with storeMutations, onPrefix and modulesNspList
 *  @api private
 */
function commitToStore(store, channelName, payload, _options) {
    const channelNameLowCase = channelName.toLowerCase();
    _options.storeMutations.map(mutationType => {
        if (checkType(mutationType, _options.socketNsp + _options.onPrefix + channelNameLowCase, _options.modulesNspList)
        || mutationType === _options.socketNsp + _options.onPrefix + channelNameLowCase) {
            store.commit(mutationType, payload);
        }
    });
    _options.storeActions.map(actionType => {
        if (checkType(actionType, _options.socketNsp + _options.onPrefix + channelNameLowCase, _options.modulesNspList)
        || actionType === _options.socketNsp + _options.onPrefix + channelNameLowCase) {
            store.dispatch(actionType, payload);
        }
    });
}

/**Check if the function type (name)
 * includes the module namespace with prefix
 * @param type of function
 * @param prefix
 * @param modulesNspList with module namespaces
 * @api private
 */
function checkType(type, prefix, modulesNspList) {
    return modulesNspList.find(moduleNsp => type.includes(moduleNsp + prefix));
}

/**Return socket channel name from action type
 * @param actionType
 * @param prefix
 * @return string channelName
 * @api private
 */
function getChannelName(actionType, prefix) {
    return actionType.slice(actionType.indexOf(prefix) + prefix.length).toUpperCase();
}
