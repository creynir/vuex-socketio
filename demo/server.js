/* eslint-disable no-console */
const express = require('express');
const app = express();

const server = app.listen(3001, function () {
    console.log('server running on port 3001');
});

const io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('socket id: ', socket.id);
    socket.on('SEND_MESSAGE', function (data) {
        console.log('SEND_MESSAGE', data);
        io.emit('MESSAGE', data);
    });
});

let nsp = io.of('/namespace');
nsp.on('connection', function (socket) {
    console.log('namespace socket id: ', socket.id);
    socket.on('SEND_MESSAGE', function (data) {
        console.log('/namespace/SEND_MESSAGE', data);
        nsp.emit('MESSAGE', data);
    });
});
