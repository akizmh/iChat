/*global $,io*/
const io = require('../../vendor/socket.io');

$(function () {
    ( function initSocket () {
        var socket = io.connect('http://' + window.location.host + '/chat'), curSocketId;

        function showMsg (data) {
            var $msg = $('#chat-tpl-message').clone(false);
            $msg.find('.chat-msg-user').html(data.user).attr('title', data.fullUser);
            $msg.find('.chat-msg-time').html(data.time);
            $msg.find('.chat-msg-content').html(data.msg);
            $msg.removeAttr('id').removeClass('webim_hidden').show();
            $('#chat-tpl-message').parent().append($msg);
            $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight);
        }

        function addUser (data) {
            var $user = $('#chat-tpl-list-user').clone(false);
            $user.find('.socketId').val(data.socketId);
            $user.find('.chat-user-name').html(data.user).attr('title', data.fullUser);
            $user.attr('id', 'user-' + data.socketId).show();
            $('#chat-dialog-user-list').append($user);
        }

        function showNotice (msg) {
            var $msg = $('#chat-tpl-message').clone(false);
            $msg.find('.chat-msg-info').hide();
            $msg.find('.chat-msg-content').addClass('webim_chat_content_notice').html(msg);
            $msg.removeAttr('id').removeClass('webim_hidden').show();
            $('#chat-tpl-message').parent().append($msg);
            $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight);
        }

        function removeUser (user) {
            $('#user-' + user).remove();
        }

        function updateUserList (users) {
            var userKey, socketId, $user, $userArr = [];
            for (userKey in users) {
                if (users.hasOwnProperty(userKey)) {
                    socketId = userKey.substr(5);
                    $user = $('#chat-tpl-list-user').clone(false);
                    $user.find('.socketId').val(socketId);
                    $user.find('.chat-user-name').html(users[userKey]).attr('title', users[userKey]);
                    $user.attr('id', 'user-' + socketId).removeClass('webim_hidden').show();
                    $userArr.push($user);
                }
            }
            $('#chat-dialog-user-list li:gt(0)').remove();
            $('#chat-dialog-user-list').append($userArr);
            $('#chat-dialog-user-num-online,#chat-dialog-user-num-total').html($userArr.length);
        }

        socket.on('message', function (data) {
            showMsg(data);
        });
        socket.on('logon', function (data) {
            curSocketId = socket.id;
            showNotice('[通知] 用户：' + data.fullUser + ' 加入聊天');
            // addUser(data);
            updateUserList(data.userList);
            $('#chat-dialog').show();
        });
        socket.on('logout', function (data) {
            showNotice('[消息] 用户：' + data.fullUser + ' 下线');
            // removeUser(data.socketId);
            updateUserList(data.userList);
        });
        socket.on('error', function (data) {
            // socket.emit('error');//会导致stack overflow
            showNotice('[消息] 连接断开');
        });
        socket.on('reconnect', function () {
            showNotice('[消息] 正在重新连接...');
        });
        socket.on('disconnect', function (data) {
            if (curSocketId) {
                removeUser(curSocketId);
                curSocketId = '';
            }
        });

        $('#chat-content').on('keyup', function (e) {
            if (e.which === 13 && e.ctrlKey === true) {
                socket.emit('message', $(this).val());
                $('#chat-content').val('');
            }
        });
        $('#chat-form').on('submit', function (e) {
            socket.emit('message', $('#chat-content').val());
            $('#chat-content').val('');
            return false;
        });
    }());

    $('body').on('click', '#icon-chat', function (e) {
        var $userList = $('#chat-dialog-contact');
        if ($userList.is(':visible')) {
            $userList.hide();
        } else {
            $userList.show();
        }
    }).on('click', '#btn-list-min', function (e) {
        $('#chat-dialog-contact').hide();
    }).on('click', '.chat-contact', function (e) {
        $('#chat-dialog').show();
    }).on('mouseover', '.chat-user,.chat-user-add', function (e) {
        $(this).addClass('hover');
    }).on('mouseout', '.chat-user,.chat-user-add', function (e) {
        $(this).removeClass('hover');
    }).on('click', '#btn-dialog-min,#btn-dialog-close', function (e) {
        $('#chat-dialog').hide();
    }).on('click', '#btn-chat-face', function (e) {
        var $chatFace = $('#chat-face');
        if ($chatFace.is(':visible')) {
            $chatFace.hide();
        } else {
            $chatFace.show();
        }
        $('#chat-dialog-add-user').hide();
        $('#chat-send-type').hide();
    }).on('click', '#btn-chat-clear', function (e) {

    }).on('click', '#btn-chat-add-user', function (e) {
        var $userList = $('#chat-dialog-add-user');
        if ($userList.is(':visible')) {
            $userList.hide();
        } else {
            $userList.show();
        }
        $('#chat-face').hide();
        $('#chat-send-type').hide();
    }).on('click', '#btn-chat-log', function (e) {
        var $chatDialog = $('#chat-dialog');
        if ($chatDialog.is('.webim_chat')) {
            $chatDialog.removeClass('webim_chat').addClass('webim_chatlog');
            $('#chat-log').show();
            $('#btn-chat-log').removeClass('webim_chat_ctrl_chatlog').addClass('webim_chat_ctrl_chatlogon');
        } else {
            $chatDialog.removeClass('webim_chatlog').addClass('webim_chat');
            $('#chat-log').hide();
            $('#btn-chat-log').removeClass('webim_chat_ctrl_chatlogon').addClass('webim_chat_ctrl_chatlog');
        }
    }).on('focus', '#chat-content', function (e) {
        $('#chat-dialog-add-user').hide();
        $('#chat-face').hide();
        $('#chat-send-type').hide();
    }).on('click', '#btn-send-type', function (e) {
        var $sendType = $('#chat-send-type');
        if ($sendType.is(':visible')) {
            $sendType.hide();
        } else {
            $sendType.show();
        }
        $('#chat-dialog-add-user').hide();
        $('#chat-face').hide();
    }).on('click', '#chat-send-type p', function (e) {
        $(this).addClass('on').siblings().removeClass('on');
        $('#chat-send-type').hide();
    }).on('click', '.chat-user-add', function (e) {

    });
});
