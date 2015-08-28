var socket = io('http://hosted.stylerdev.io:3100');
var queue  = [];

var sound       = document.querySelector('.sound');
var container   = document.querySelector('.subalert');
var usernameEl  = document.querySelector('.username');
var messageEl   = document.querySelector('.message');
var resub       = document.querySelector('.resub');
var resubUsername = document.querySelector('.resub > .username');
var sub         = document.querySelector('.sub');
var subUsername = document.querySelector('.sub > .username');
var months      = document.querySelector('.months');

var displayTime = 5 * 1000;
var ttsTime     = 20 * 1000;
var lastTen     = [];
var playing     = false;
var list        = document.getElementsByClassName('content')[0];
var removeElement = function(node) {
    node.parentNode.removeChild(node);
};

var notify = function(data) {
  if(data !== null) {
  queue.push(data);
  $(sub).show();
  $(resub).show();
}
  if(!playing) {
    playing = true;
    var watson = 'http://hosted.stylerdev.io:3100/synthesize?voice=en-US_AllisonVoice&text=';
    var sound = new Audio();
    var msg = queue[0].message;
    messageEl.textContent = msg;
    usernameEl.textContent = queue[0].username;
    if(queue[0].resub > 0) {
      // do stuff
      $(sub).hide();
      resubUsername.textContent = queue[0].username;
      months.textContent = queue[0].resub;

    } else {
      $(resub).hide();
      subUsername.textContent = queue[0].username;
  }

    queue.shift();
    container.classList.add('visible');
    setTimeout(function () {
      sound.load();
      sound.src = watson + encodeURIComponent(msg);
      sound.onended = function(){
        setTimeout(function () {
          playing = false;
          if(queue.length > 0) {
            notify(null);
          }
        }, 5000);
      };
      sound.play();
    }, 1000);
    setTimeout(function () {
      container.classList.remove('visible');
    }, 6000);
  }
};

socket.on('subMsg', notify);
socket.on('stopSound', function(){
  sound.stop();
});
