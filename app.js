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
    config  = require('./config'),


var client = new irc.client(config.tmi);
client.connect();

// ---------------------------------------------------

var subs = {};
var queue = [];


function sendEvent(user, msg){
  io.emit('subMsg', {
    username: user,
    message: msg
  });
}




client.on('subscription', function (channel, username) {
  subs[username] = {username: username, subbed: new Date().getSeconds()};
     subbed: new Date()};
  client.whisper(username, 'xanHY xanPE Thanks for Subscribing ' + username + ' xanLove You now have 1 minute to whisper me back with a message to show on stream!');
});



client.on('whisper', function(username, message){
if(subs.hasOwnProperty(username)) {
   var time = new Date().getSeconds() - subs[username].subbed;
   if(time < 60) queue.push({username: username, message : message});
}
// Pushing message object to que if they responded within 60 seconds
});








// User Subscribes -> Server Responds with message (Timer Starts - 1 minute) -> Client responds -> Removed from list -> socket connection -> frontend
// - Queue -
