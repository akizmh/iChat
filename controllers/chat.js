/**
 *
 * @author fuyun
 * @since 2017/08/14
 */
const redis = require('redis');
const adapter = require('socket.io-redis');
const moment = require('moment');
const redisConfig = require('../config/redis');
const appConfig = require('../config/core');
const util = require('../helper/util');
const pubClient = redis.createClient(redisConfig.port, redisConfig.host, {auth_pass: redisConfig.passwd});
const subClient = redis.createClient(redisConfig.port, redisConfig.host, {auth_pass: redisConfig.passwd, detect_buffers: true});
const chatRedis = redis.createClient(redisConfig.port, redisConfig.host, {auth_pass: redisConfig.passwd});

module.exports = {
    initSocket: function (io) {
        if (!appConfig.isDev) {
            io.enable('browser client minification');
            io.enable('browser client etag');
            io.enable('browser client gzip');
        }
        chatRedis.on('error', function (err) {
            console.log('Redis Error: ' + err);
        });
        chatRedis.del('chat user');

        let chat = io.of('/chat');
        chat.on('connection', function (socket) {
            chatRedis.hset('chat user', 'user-' + socket.id, socket.handshake.address);
            chatRedis.hgetall('chat user', function (err, users) {
                chat.emit('logon', {
                    socketId: socket.id,
                    clientIP: socket.handshake.address,
                    user: util.cutStr(socket.handshake.address, 7),
                    fullUser: socket.handshake.address,
                    time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    userList: users
                });
            });
            socket.on('message', function (data) {
                chat.emit('message', {
                    socketId: socket.id,
                    clientIP: socket.handshake.address,
                    user: util.cutStr(socket.handshake.address, 7),
                    fullUser: socket.handshake.address,
                    time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    msg: data
                });
            });
            socket.on('error', function () {
                chatRedis.hdel('chat user', 'user-' + socket.id);
                chatRedis.hgetall('chat user', function (err, users) {
                    socket.broadcast.emit('logout', {
                        socketId: socket.id,
                        clientIP: socket.handshake.address,
                        user: util.cutStr(socket.handshake.address, 7),
                        fullUser: socket.handshake.address,
                        userList: users
                    });
                });
            });
            socket.on('disconnect', function () {
                chatRedis.hdel('chat user', 'user-' + socket.id);
                chatRedis.hgetall('chat user', function (err, users) {
                    chat.emit('logout', {
                        socketId: socket.id,
                        clientIP: socket.handshake.address,
                        user: util.cutStr(socket.handshake.address, 7),
                        fullUser: socket.handshake.address,
                        userList: users
                    });
                });
            });
        });

        io.adapter(adapter({
            pubClient,
            subClient
        }));

        io.on('connection', function (socket) {
            socket.emit('ready', 'Welcome...');
            socket.on('disconnect', function () {
                console.log('client ' + socket.id + ' is disconnect.');
            });
        });
    }
};