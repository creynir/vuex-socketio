const socketModule = {
    namespaced: true,
    state: {
        connected: false,
        nspConnected: false,
        socketMessages: []
    },
    mutations: {
        socketOnConnect (state) {
            state.socketMessages.push('socket connected');
            state.connected = true;
        },
        socketOnDisconnect (state) {
            state.socketMessages.push('socket disconnected');
            state.connected = false;
        },
        namespaceSocketOnConnect (state) {
            state.socketMessages.push('namespace/socket connected');
            state.nspConnected = true;
        },
        namespaceSocketOnDisconnect (state) {
            state.socketMessages.push('namespace/socket disconnected');
            state.nspConnected = false;
        },
        pushMessageToSocketMessages (state, message) {
            state.socketMessages.push(message);
        }

    },
    actions: {
        socketConnect: () => {},
        socketDisconnect: () => {},
        socketEmitSendMessage: (context, message) => {},
        namespaceSocketConnect: () => {},
        namespaceSocketDisconnect: () => {},
        namespaceSocketEmitSendMessage: (context, message) => {}
    }
};

export default socketModule;
