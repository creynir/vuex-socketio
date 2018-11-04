const socketModule = {
    namespaced: true,
    state: {
        channelMessages: [],
        nspChannelMessages: []
    },
    mutations: {
        socketOnMessage (state, message) {
            state.channelMessages.push(message);
        },
        namespaceSocketOnMessage (state, message) {
            state.nspChannelMessages.push(message);
        }
    },
    actions: {
        socketOnMessage: ({ commit }, message) => {
            commit('socketModule/pushMessageToSocketMessages', 'socket on MESSAGE: ' + message, { root: true });
        },
        namespaceSocketOnMessage: ({ commit }, message) => {
            commit('socketModule/pushMessageToSocketMessages', 'namespace/socket on MESSAGE: ' + message, { root: true });
        }
    }
};

export default socketModule;
