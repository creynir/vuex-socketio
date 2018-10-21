import Vue from 'vue';

const devicesModule = {
  namespaced: true,
  state: {
    applicationsSession: {},
    devices: {},
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

/////////////////
      payload = {data:{applicationId:24,devices:[{accessToken:"eyJhbGc",apiVersion:"2",appVersion:"2.95.82.11",applicationId:24,applicationVersionId:3,cname:"mobiletagging",companyId:14,deviceId:"17E581BF230D538A088B0CB5BD243D335E14AB02F23359BF1CCEC14C7FE02A44",locale:"en_IL",manufacturer:"Xiaomi",marketerGuid:"9e2f6ba22b92d0b5d02705568c12878d3f68c6ecb444a8bd88dc4eb38586ae063b6ec82f9d2440ac5b4570b49f3a4a2536fa006094abbe95eeeeb40f4b57da87",model:"Mi A1",os:"Android",osVersion:"27",sdkVersion:"1.51.51.444",socketId:"shJKampYrUMamD_OAAZM_1",version:"v2"},{accessToken:"eyJhbGc",apiVersion:"2",appVersion:"2.95.82.11",applicationId:24,applicationVersionId:3,cname:"mobiletagging",companyId:14,deviceId:"17E581BF230D538A088B0CB5BD243D335E14AB02F23359BF1CCEC14C7FE02A44",locale:"en_IL",manufacturer:"Xiaomi",marketerGuid:"9e2f6ba22b92d0b5d02705568c12878d3f68c6ecb444a8bd88dc4eb38586ae063b6ec82f9d2440ac5b4570b49f3a4a2536fa006094abbe95eeeeb40f4b57da87",model:"Mi A1",os:"Android",osVersion:"27",sdkVersion:"1.51.51.444",socketId:"shJKampYrUMamD_OAAZM_2",version:"v2"}]}};
/////////////////

      state.messages.lastIncoming = ['sessionJoined', payload];
      Vue.set(state.applicationsSession, payload.data.applicationId, payload.data);
      payload.data.devices.map(device => Vue.set(state.devices, device.socketId, device));
    },
    socketOn_deviceJoinedSession: (state, payload) => {
      state.messages.lastIncoming = ['deviceJoinedSession', payload];
      Vue.set(state.devices, payload.from,  payload.data);
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
      Vue.delete(state.devices, payload.from);
    }
  },
  actions: {
    socketConnect: () => {},

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
