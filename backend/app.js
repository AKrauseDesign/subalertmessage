'use strict';
// _______ _______ __   __ ___     _______ ______   ______  _______ __   __    ___ _______
// |       |       |  | |  |   |   |       |    _ | |      ||       |  | |  |  |   |       |
// |  _____|_     _|  |_|  |   |   |    ___|   | || |  _    |    ___|  |_|  |  |   |   _   |
// | |_____  |   | |       |   |   |   |___|   |_||_| | |   |   |___|       |  |   |  | |  |
// |_____  | |   | |_     _|   |___|    ___|    __  | |_|   |    ___|       ___|   |  |_|  |
//  _____| | |   |   |   | |       |   |___|   |  | |       |   |___ |     |   |   |       |
// |_______| |___|   |___| |_______|_______|___|  |_|______||_______| |___||___|___|_______|


// Dependencies
var irc     = require('tmi.js'),
    app     = require('express')(),
    http    = require('http').Server(app),
    io      = require('socket.io')(http),
    config  = require('./config');


var client = new irc.client(config.tmi);
client.connect().then(function(){
  console.log('Connected to TMI');
});
var group = new irc.client(config.grouptmi);
group.connect().then(function(){
  console.log('Connected to Group TMI');
});

http.listen(config.port, function(){
  console.log('Connection Successful: listening on *:' + config.port);
});

var subs = {};

io.on('connection', function(socket){
  socket.on('fakeSub', function(data) {
    console.log('Client: Hey, can I have a fake sub?');
    console.log('Server: Hi! Want a fake sub? Have one!');
    sendEvent(data.username, data.message);
  });
});

function sendEvent(user, msg){
  io.emit('subMsg', {
    username: user,
    message: msg
  });
}


setInterval(function() {
  for(var sub in subs) {
    var time = Date.now() - sub.subbed;
    if(time > 60000) {
      delete subs[sub];
    }
  }
}, 1000 * 60 * 60);

client.on('chat', function (channel, user, message, self) {
  if(message === '!subscribe') {
    group.whisper(user.username, 'xanHY xanPE Thanks for Subscribing ' + user.username + ' xanLove You now have 1 minute to whisper me back with a message to show on stream!');
    group.whisper(user.username, '[EXAMPLE]:  /w izlbot Kappa Kappa HEY I LOVE YOU!!!');
    subs[user.username] = {
      username: user.username,
      subbed: Date.now()
    };
  }
});

client.on('subscription', function (channel, username) {
  group.whisper(username, 'xanHY xanPE Thanks for Subscribing ' + username + ' xanLove You now have 1 minute to whisper me back with a message to show on stream!');
  group.whisper(username, '[EXAMPLE]:  /w izlbot Kappa Kappa HEY I LOVE YOU!!!');
  subs[username] = {
    username: username,
    subbed: Date.now()
  };
});

group.on('whisper', function(username, message) {
  if(subs.hasOwnProperty(username)) {
    var time = Date.now() - subs[username].subbed;
    if(time < 60000) {
      group.whisper(username, '" '+ message +' "' + ' Will be shown on stream within 30 seconds 4Head');
      sendEvent(username, message);
      delete subs[username];
    }
  } else {
    group.whisper(username, 'Sorry you don\'t have permission SwiftRage');
  }
});


// User Subscribes [done] -> Server Responds with message (Timer Starts - 1 minute) [done] -> Client responds [done] -> Removed from list [done] -> socket connection [TODO] -> frontend [TODO]
// NOTE: Create a que on the frontend
