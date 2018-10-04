const socketModule = {
  namespaced: true,
  state: {
    channelMessages: [],
    nspChannelMessages: [],
  },
  mutations: {
    socket_on_message(state, message) {
      state.channelMessages.push(message);
    },
    setNspMessage(state, message) {
      state.nspChannelMessages.push(message);
    }
  },
  actions: {
    socket_on_message: (context, message) => {
      context.commit('socketModule/pushMessageToSocketMessages', 'socket MESSAGE: ' + message, {root: true});
    },
    namespace_socket_on_message: (context, message) => {
      context.commit('socketModule/pushMessageToSocketMessages', 'namespace/socket MESSAGE: ' + message, {root: true});
      context.commit("setNspMessage", message);
    }
  }
};

export default socketModule;
