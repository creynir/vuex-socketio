# vuex-socketio
[![NPM version](https://img.shields.io/npm/v/vuex-socketio.svg)](https://www.npmjs.com/package/vuex-socketio)
![Vuex v3 compatible](https://img.shields.io/badge/Vuex%20v3-compatible-green.svg)
<a href="https://www.npmjs.com/package/vuex-socketio"><img src="https://img.shields.io/npm/dt/vuex-socketio.svg" alt="Downloads"></a>

> Vuex plugin for Socket.io-client.

## Install

``` bash
npm install vuex-socketio --save
```

## Usage
#### Configuration
One socket.io-client instance
``` js
import createSocketIoPlugin from 'vuex-socketio';
const socket = socketio('http://socketserver.com:3001');
const socketPlugin = createSocketIoPlugin(socket);
```

With namespace:
``` js
import createSocketIoPlugin from 'vuex-socketio';
const socket = socketio('http://socketserver.com:3001');
const socketNsp = socketio('http://socketserver.com:3001/namespace');
const socketPlugin = createSocketIoPlugin([socket, socketNsp]);
```

In vuex:
``` js
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ...
  },
  plugins: [socketPlugin]
})
```
### Vuex Store integration
#### Set up listeners
You may define prefix for `socket.on` with options object:
``` js
const socketPlugin = createSocketIoPlugin(socket, {onPrefix: 'someOnPrefix'});
```
The **default** value is `socket_on_`

``` js
mutations: {
        socket_on_connect: (state,  status ) => {
            state.connect = true;
        },
        socket_on_message: (state,  message) => {
            state.message = message;
        },
        ...
    },
actions: {
        socket_on_other_message: (context, message) => {
        ...some code here
        },
        ...
    }
```
Where `socket_on_` is a prefix for listener and `message` is a desired channel name

#### Set up emiters
**Emiters can be used only with actions**

Define `socket.emit` prefix:
``` js
const socketPlugin = createSocketIoPlugin(socket, {emitPrefix: 'someEmitPrefix'});
```
Or use the **default** value: `socket_emit_`

``` js
actions: {
        socket_emit_message: (context, message) => {},
        ...
     }
```
Where `socket_emit_` is a prefix for emit messages and `message` is a desired channel name

**For opening and closing the connection use: `socket_connect` && `socket_disconnect` actions**

You can also add some prefixes for default functions, e.g.: `socket_reconnect`,

where `socket_` is a mandatory prefix and `reconnect` is a function name

``` js
const socketPlugin = createSocketIoPlugin(socket, {defaultPrefixes: ['socket_reconnect']);
```
#### Namespaces for store modules and for sockets are supported.

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        connect: false,
        message: null
    },
    mutations:{
        socket_on_connect: (state,  status ) => {
            state.connect = true;
        },
        socket_on_disconnect: (state,  status ) => {
            state.connect = false;
        },
        socket_on_message: (state,  message) => {
            state.message = message;
        }
    },
    actions: {
        socket_connect: () => {},
        socket_emit_message: () => {},
        socket_on_other_message: (context, message) => {
        ...some code here
        },
    },
    plugins: [websocketPlugin]
})
```

#### Socket with namespace:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        connect: false,
        message: null
    },
    mutations:{
        namespace_socket_on_connect: (state,  status ) => {
            state.connect = true;
        },
        namespace_socket_on_disconnect: (state,  status ) => {
            state.connect = false;
        },
        namespace_socket_on_message: (state,  message) => {
            state.message = message;
        }
    },
    actions: {
        namespace_socket_connect: () => {},
        namespace_socket_emit_message: () => {},
        namespace_socket_on_other_message: (context, message) => {
        ...some code here
        },
    },
    plugins: [websocketPlugin]
})
```
### Hints
**Only one emitPrefix or onPrefix can be used at the same time.**<br />
**Channel name on server side should be declared in upper case.**<br />
**Channel prefixes in actions and mutations should be written in lower case.**

### Example
[demo](./demo)
