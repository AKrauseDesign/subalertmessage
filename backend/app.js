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
    fs      = require('fs'),
    extend       = require('util')._extend,
    watson = require('watson-developer-cloud');

var credentials = {
  url: 'https://stream.watsonplatform.net/text-to-speech/api',
  version: 'v1',
  username: 'c6fa0d91-291e-4651-b2df-443933c1736a',
  password: 'Yr6WnIkiOPZQ',
};

var textToSpeech = watson.text_to_speech(credentials);

app.get('/synthesize', function(req, res) {
  var transcript = textToSpeech.synthesize(req.query);
  transcript.on('response', function(response) {
    if (req.query.download) {
      response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
    }
  });
  transcript.on('error', function(error) {
    console.log('Synthesize error: ', error);
  });
  transcript.pipe(res);
});

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

function sendEvent(user, resub, msg){
  io.emit('subMsg', {
    username: user,
    resub: resub,
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
  var words = message.split(' ');
  if(words[0] == '!sp') {
    if(user.username === 'stylerdev' || user.username === 'inormous') {
      switch(words[1]) {
        default:
        client.say(channel, 'Missing parameter SwiftRage '+ user.username);
        client.say(channel, 'Parameters are: permit/revoke');
        break;

        case 'permit':
          if(words[2]) {
            client.say(channel, 'Permitted: ' + words[2] + ' to use subperk!' );
            setTimeout(function () {
              group.whisper(words[2], 'xanHY xanPE Thanks for Subscribing ' + words[1] + ' xanLove You now have 5 minute to whisper me back with a message to show on stream!');
              group.whisper(words[2], '[EXAMPLE]:  /w izlbot Kappa Kappa HEY I LOVE YOU!!!');
              subs[words[2]] = {
                username: words[2],
                subbed: Date.now()
              };
            }, 	2000);
          } else {
            client.say(channel, 'Missing parameter: User SwiftRage');
          }
        break;

        case 'revoke':
        if(words[2]) {
          client.say(channel, 'Revoked: ' + words[2] + '\'s access to  use subperk!' );
          delete subs[words[2]];
        } else {
          client.say(channel, 'Missing parameter: User SwiftRage');
        }
        break;
      }
    }
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
client.on('subanniversary', function (channel, username, months) {
  group.whisper(username, 'xanHY xanPE Thanks for Resubscribing for '+ months + ' months ' + username + ' xanLove You now have 1 minute to whisper me back with a message to show on stream!');
  group.whisper(username, '[EXAMPLE]:  /w izlbot Kappa Kappa HEY I LOVE YOU!!!');
  subs[username] = {
    username: username,
    resub: months,
    subbed: Date.now()
  };
});

group.on('whisper', function(username, message) {
    if(subs.hasOwnProperty(username)) {
      var time = Date.now() - subs[username].subbed;
      var submonths = subs[username].months;
      if(time < 60000) {
        if(submonths) {
          group.whisper(username, '" '+ message +' "' + ' Will be shown on stream within 30 seconds 4Head');
          sendEvent(username, submonths, message);
          delete subs[username];
        } else {
          group.whisper(username, '" '+ message +' "' + ' Will be shown on stream within 30 seconds 4Head');
          sendEvent(username, 0, message);
          delete subs[username];
        }
      }
    }
    if(message === 'stop') {
      if(username === 'massansc' || username === 'INORMOUS' || username === 'stylerdev') {
        io.emit('stopSound');
      }
    }
});


// User Subscribes [done] -> Server Responds with message (Timer Starts - 1 minute) [done] -> Client responds [done] -> Removed from list [done] -> socket connection [TODO] -> frontend [TODO]
// NOTE: Create a que on the frontend
