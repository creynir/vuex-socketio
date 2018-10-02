# vuex-socketio

> Vuex plugin for Socket.io connection.

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
You may define prefix for `socket.emit` with options object:
``` js
const socketPlugin = createSocketIoPlugin(socket, {emitPrefix: 'someEmitPrefix');
```
The **default** value is `socket_emit_`

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

Define `socket.on` prefix:
``` js
const socketPlugin = createSocketIoPlugin(socket, {onPrefix: 'someOnPrefix');
```
Or use the **default** value: `socket_on_`

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
#### Only one emitPrefix or onPrefix can be used at the same time. Namespaces for store modules and for sockets are supported.

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

#### With namespaced socket connection:

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

### Example
[demo](./demo)
