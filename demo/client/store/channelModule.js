const socketModule = {
  namespaced: true,
  state: {
    channelMessages: [],
    nspChannelMessages: [],
  },
  mutations: {
    socketOnMessage(state, message) {
      state.channelMessages.push(message);
    },
    namespaceSocketOnMessage(state, message) {
      state.nspChannelMessages.push(message);
    }
  },
  actions: {
    socketOnMessage: (context, message) => {
      context.commit('socketModule/pushMessageToSocketMessages', 'socket MESSAGE: ' + message, {root: true});
    },
    namespaceSocketOnMessage: (context, message) => {
      context.commit('socketModule/pushMessageToSocketMessages', 'namespace/socket MESSAGE: ' + message, {root: true});
    }
  }
};

export default socketModule;
