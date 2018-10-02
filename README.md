# vuex-socketio

> Socket.io Vuex Plugin

## Install

``` bash
npm install vuex-socketio --save
```

## Usage
#### Configuration
Bind one socket.io-client instance
``` js
import createSocketIoPlugin from 'vuex-socketio';
const socket = socketio('http://socketserver.com:3001');
const socketPlugin = createSocketIoPlugin(socket);
```

Bind multiple socket.io-client instances
``` js
import createSocketIoPlugin from 'vuex-socketio';
const socket = socketio('http://socketserver.com:3001');
const socketNsp = socketio('http://socketserver.com:3001/namespace');
const socketPlugin = createSocketIoPlugin([socket, socketNsp]);
```

Usage with vuex
``` js
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ...
  },
  plugins: [socketPlugin]
})
```
#### Vuex Store integration

You may define prefix for `socket.emit` with options object:
``` js
const socketPlugin = createSocketIoPlugin(socket, {emitPrefix: 'someEmitPrefix');
```
The **default** value is `socket_emit_`

The same for `socket.on` prefix:
``` js
const socketPlugin = createSocketIoPlugin(socket, {onPrefix: 'someOnPrefix');
```
The **default** value is 'socket_on_'

For opening and closing the connection use: `socket_connect` && `socket_disconnect` names for actions

It's also possible to add some prefixes for default functions e.g. `socket_reconnect`,
where `socket_` is a mandatory prefix and `reconnect` is a function name

``` js
const socketPlugin = createSocketIoPlugin(socket, {defaultPrefixes: ['socket_reconnect']);
```

#### You can use only **actions** for emit messages. Only one prefix for each function can be used.
#### Namespaced store modules and sockets are supported.

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
        socket_on_other_message: () => {},
    },
    plugins: [websocketPlugin]
})
```

Where `socket_emit_` is a prefix and `message` is a desired channel

#### Same with namespaced socket connection:

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
        namespace_socket_on_other_message: () => {},
    },
    plugins: [websocketPlugin]
})
```


