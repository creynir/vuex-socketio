const socketModule = {
  namespaced: true,
  state: {
    connected: false,
    nspConnected: false,
    socketMessages: []
  },
  mutations: {
    socket_on_connect(state) {
      state.socketMessages.push('socket connected');
      state.connected = true;
    },
    socket_on_disconnect(state) {
      state.socketMessages.push('socket disconnected');
      state.connected = false;
    },
    namespace_socket_on_connect(state) {
      state.socketMessages.push('namespace/socket connected');
      state.nspConnected = true;
    },
    namespace_socket_on_disconnect(state) {
      state.socketMessages.push('namespace/socket disconnected');
      state.nspConnected = false;
    },
    pushMessageToSocketMessages(state, message){
      state.socketMessages.push(message);
    }

  },
  actions: {
    socket_connect: () => {},
    socket_disconnect: () => {},
    socket_emit_send_message: (context, message) => {},
    namespace_socket_connect: () => {},
    namespace_socket_disconnect: () => {},
    namespace_socket_emit_send_message: (context, message) => {}
  }
};

export default socketModule;
