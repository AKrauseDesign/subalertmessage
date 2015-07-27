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
client.connect();

http.listen(config.port, function(){
  console.log('Connection Successful: listening on *:' + config.port);
});

var subs = {};
var queue = [];

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
    if(time < 60000) {
      delete subs[sub];
    }
  }
}, 1000 * 60 * 60);


client.on('subscription', function (channel, username) {
  subs[username] = {
    username: username,
    subbed: Date.now()
  };

  client.whisper(username, 'xanHY xanPE Thanks for Subscribing ' + username + ' xanLove You now have 1 minute to whisper me back with a message to show on stream!');
});


client.on('whisper', function(username, message) {
  if(subs.hasOwnProperty(username)) {
    var time = Date.now() - subs[username].subbed;
    if(time < 60000) {
      // Give response, tell user we'll display their message on-stream asap.
      queue.push(subs[username]);
      delete subs[username];
    }
  }
  // Pushing message object to que if they responded within 60 seconds
});


// User Subscribes [done] -> Server Responds with message (Timer Starts - 1 minute) [done] -> Client responds [done] -> Removed from list [done] -> socket connection [TODO] -> frontend [TODO]
// NOTE: Create a que on the frontend
