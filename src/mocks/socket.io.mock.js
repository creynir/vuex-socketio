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
