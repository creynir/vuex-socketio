# vuex-socketio
[![Build Status](https://travis-ci.org/creynir/vuex-socketio.svg?branch=master)](https://travis-ci.org/creynir/vuex-socketio)
[![Coverage Status](https://coveralls.io/repos/github/creynir/vuex-socketio/badge.svg?branch=master)](https://coveralls.io/github/creynir/vuex-socketio?branch=master)
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

In store:
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
The **default** value is `socketOn`

``` js
mutations: {
        socketOnConnect: (state,  status ) => {
            state.connect = true;
        },
        socketOnMessage: (state,  message) => {
            state.message = message;
        },
        ...
    },
actions: {
        socketOnOtherMessage: (context, message) => {
        ...some code here
        },
        ...
    }
```
Where `socketOn` is a prefix for listeners and `message` is a desired channel name

#### Set up emiters
**Only actions can be used for emitting to socket**

Define `socket.emit` prefix:
``` js
const socketPlugin = createSocketIoPlugin(socket, {emitPrefix: 'someEmitPrefix'});
```
Or use the **default** value: `socketEmit`

``` js
actions: {
        socketEmitMessage: (context, message) => {},
        ...
     }
```
Where `socketEmit` is a prefix for emitting messages and `message` is a desired channel name

**Open and close socket connection**
Use: `socketConnect` && `socketDisconnect` actions

You can also add some prefixes for default functions, e.g.: `socketReconnect`,

where `socket` is a mandatory prefix and `reconnect` is an existing function name
``` js
const socketPlugin = createSocketIoPlugin(socket, {defaultFunctions: ['socketReconnect']);
```

#### Set up channel name formatter
You can provide your own channel converter function:<br />

``` js
const socketPlugin = createSocketIoPlugin(socket, {converter: _.camelCase});
```
The **default** channel name will be in `UPPER_SNAKE_CASE`

#### Namespaces for store modules and for socket instances are supported.

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
        socketOnConnect: (state,  status ) => {
            state.connect = true;
        },
        socketOnDisconnect: (state,  status ) => {
            state.connect = false;
        },
        socketOnMessage: (state,  message) => {
            state.message = message;
        }
    },
    actions: {
        socketConnect: () => {},
        socketEmitMessage: () => {},
        socketOnOtherMessage: (context, message) => {
        ...some code here
        },
    },
    plugins: [socketPlugin]
})
```

#### Socket instance with namespace:

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
        namespaceSocketOnConnect: (state,  status ) => {
            state.connect = true;
        },
        namespaceSocketOnDisconnect: (state,  status ) => {
            state.connect = false;
        },
        namespaceSocketOnMessage: (state,  message) => {
            state.message = message;
        }
    },
    actions: {
        namespaceSocketConnect: () => {},
        namespaceSocketEmitMessage: () => {},
        namespaceSocketOnOtherMessage: (context, message) => {
        ...some code here
        },
    },
    plugins: [socketPlugin]
})
```
### Notes
**Plugin doesn't support dynamic registred store modules.**<br />

### Example
[demo](./demo)
