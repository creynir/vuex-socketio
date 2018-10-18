import Vue from 'vue'
import Vuex from 'vuex'
import socketModule from "./socketModule.js"
import channelModule from "./channelModule.js"
import devicesModule from "./devicesModule.js"
import socketio from 'socket.io-client';
import createSocketIoPlugin from '../../../src/index.js'

const socket = socketio('http://localhost:3001', {autoConnect: false});
const nspSocket = socketio('http://localhost:3001/namespace', {autoConnect: false});

const socketIoPlugin = createSocketIoPlugin(socket, {channelFormat: 'CamelCase', onPrefix: 'socketOn_', emitPrefix: 'socketEmit_'});

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    socketModule,
    channelModule,
    devicesModule
  },
  plugins: [socketIoPlugin]
})
