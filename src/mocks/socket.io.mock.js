const DEFAULT_EVENTS = [
    'connect',
    'error',
    'disconnect',
    'reconnect',
    'reconnect_attempt',
    'reconnecting',
    'reconnect_error',
    'reconnect_failed',
    'connect_error',
    'connect_timeout',
    'connecting',
    'ping',
    'pong'
];

function Socket (nsp) {
    this.nsp = nsp ? '/' + nsp : '/';
    this.eventsMap = {};
}

Socket.prototype.emit = function (event, ...args) {
    if (this.eventsMap[event]) {
        this.eventsMap[event].forEach(func => func(...args));
    }
};

Socket.prototype.on = function (event, func) {
    if (this.eventsMap[event]) {
        return this.eventsMap[event].push(func);
    }
    this.eventsMap[event] = [func];
};

Socket.prototype.onevent = function (packet) {
    if (DEFAULT_EVENTS.indexOf(packet.data[0]) === -1) {
        this.emit(packet.data[0], packet.data[1]);
    }
};

Socket.prototype.connect = function () {
    this.emit('connect');
};
Socket.prototype.disconnect = function () {
    this.emit('disconnect');
};

function socketMock (nsp) {
    return new Socket(nsp);
}

export default socketMock;
