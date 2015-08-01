var socket = io('http://localhost:3100');

var queue = [];

var sound = document.querySelector('.sound');
var container = document.querySelector('.subalert');
var usernameEl = container.querySelector('.username');
var messageEl = container.querySelector('.message');
var displayTime = 5 * 1000;
var lastTen = [];
var playing = false;
var list = document.getElementByClassName('lastTen');

var sectionFactory  = function(id, username, message) {
      var section = document.createElement('section');
      section.className = id;

  var numberTitle           = document.createElement('span');
  var numberTitleText       = document.createTextNode(id);
      numberTitle.className = 'number';
      numberTitle.appendChild(numberTitleText);
      section.appendChild(numberTitle);

  var wrap                     = document.createElement('div');
  var usernameTitle            = document.createElement('span');
  var usernameTitleText        = document.createTextNode('Username: ');
  var messageTitle             = document.createElement('span');
  var messageTitleText         = document.createTextNode('Message: ');
  var usernameContent          = document.createElement('span');
  var messageContent           = document.createElement('span');
  var usernameContentText      = document.createTextNode(username);
  var messageContentText       = document.createTextNode(message);



  usernameTitle.appendChild(usernametitleText);
  messageTitle.appendChild(messageTitleText);



  wrap.appendChild(usernameTitle);
  wrap.appendChild(usernameContent);
  wrap.appendChild(messageTitle);
  wrap.appendChild(messageContent);

};



var lastTen = function(data) {
  if(data !== null) {
    for(var i = 0; i < data.length; i++) {
      lastTen.push(data[i]);
    }
    if(lastTen.length > 10) {
      lastTen.pop();
      list.removeChild(list.lastChild);
     }
    for(var j = 0; j < lastTen.length; j++) {
      var element = document.createElement('li');
      var text = 'username: ' + lastTen[i].username + ', message: ' + lastTen[i].message + ', resub: ' + lastTen[i].resub;
      element.appendChild(text);
      list.appendChild(element);
    }
  }
};

var notify = function(data) {
  if(data !== null) {
    queue.push(data);
  }
  if(!playing) {
    playing = true;
    var tts = 'http://text-to-speech-demo.mybluemix.net/synthesize?voice=en-US_AllisonVoice&text=';
    // var tts = 'http://hosted.stylerdev.io:3100/synthesize?voice=en-US_AllisonVoice&text=';
    var msg = queue[0].message;
    messageEl.textContent = queue[0].message;
    usernameEl.textContent = queue[0].username;
    setTimeout(function () {
      $('.tts').attr('src',  tts + encodeURIComponent(msg));
    }, 2000);
    queue.shift();
    container.classList.add('visible');
    setTimeout(function(){
      container.classList.remove('visible');
      setTimeout(function() {
        playing = false;
        if(queue.length > 0) {
          notify(null);
        }
      }, 3000);
    }, displayTime);
  }
};

socket.on('subMsg', lastTen);
socket.on('subMsg', notify);
socket.on('stopSound', function(){
  $('.tts').attr('src', '');
});
