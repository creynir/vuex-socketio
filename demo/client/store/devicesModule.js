const devicesModule = {
  namespaced: true,
  state: {
    applicationsSession: [],
    devices: [],
    screenCaptured: {},
    messages: {
      lastOutgoing: [],
      lastIncoming: []
    }
  },
  mutations: {
    socketOnDisconnect(state) {
      state.socketMessages.push('socket disconnected');
      state.connected = false;
    },
    socketOn_sessionJoined: (state, payload) => {
      state.messages.lastIncoming = ['sessionJoined', payload];
      state.applicationsSession.push[payload.data];
      state.devices.concat(payload.data.devices);
    },
    socketOn_deviceJoinedSession: (state, payload) => {
      state.messages.lastIncoming = ['deviceJoinedSession', payload];
      state.devices.push(payload.data);
    },
    socketOn_pairedModeUpdated: (state, payload) => {
      state.messages.lastIncoming = ['pairedModeUpdated', payload];
    },
    socketOn_captureModeEntered: (state, payload) => {
      state.messages.lastIncoming = ['captureModeEntered', payload];
    },
    socketOn_prepareToReceiveScreen: (state, payload) => {
      state.messages.lastIncoming = ['prepareToReceiveScreen', payload];
    },
    socketOn_screenCaptured: (state, payload) => {
      state.messages.lastIncoming = ['screenCaptured', payload];
      state.screenCaptured = payload.data;
    },
    socketOn_captureModeExited: (state, payload) => {
      state.messages.lastIncoming = ['captureModeExited', payload];
    },
    socketOn_disconnected: (state, payload) => {
      state.messages.lastIncoming = ['disconnected', payload];
    }
  },
  actions: {
    socketEmit_joinSession: (context, payload) => {
      context.state.messages.lastOutgoing = ['joinSession', payload];
    },
    socketEmit_enterCaptureMode: (context, payload) => {
      state.messages.lastOutgoing = ['enterCaptureMode', payload];
    },
    socketEmit_readyToReceiveScreen: (context, payload) => {
      state.messages.lastOutgoing = ['readyToReceiveScreen', payload];
    },
    socketEmit_screenReceived: (context, payload) => {
      state.messages.lastOutgoing = ['screenReceived', payload];
    },
    socketEmit_exitCaptureMode: (context, payload) => {
      state.messages.lastOutgoing = ['exitCaptureMode', payload];
    }
  }
};

export default devicesModule;
