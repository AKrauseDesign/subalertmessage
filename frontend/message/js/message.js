var socket = io('http://localhost:3100');
var queue  = [];

var sound       = document.querySelector('.sound');
var container   = document.querySelector('.subalert');
var usernameEl  = container.querySelector('.username');
var messageEl   = container.querySelector('.message');
var displayTime = 5 * 1000;
var lastTen     = [];
var playing     = false;
var list        = document.getElementByClassName('content');

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
      var element = document.createElement('section');
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
    var msg                = queue[0].message;
    messageEl.textContent  = queue[0].message;
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
