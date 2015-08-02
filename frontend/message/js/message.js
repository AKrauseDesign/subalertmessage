var socket = io('http://hosted.stylerdev.io:3100');
var queue  = [];

var sound       = document.querySelector('.sound');
var container   = document.querySelector('.subalert');
var usernameEl  = container.querySelector('.username');
var messageEl   = container.querySelector('.message');
var displayTime = 5 * 1000;
var ttsTime     = 20 * 1000;
var lastTen     = [];
var playing     = false;
var list        = document.getElementsByClassName('content')[0];
var notify = function(data) {
  queue.push(data);
  if(!playing) {
    playing = true;
    // var ttsUrl = 'http://text-to-speech-demo.mybluemix.net/synthesize?voice=en-US_AllisonVoice&text=';
    var ttsUrl = 'http://hosted.stylerdev.io:3100/synthesize?voice=en-US_AllisonVoice&text=';
    if(queue[0].message !== null && queue[0].username !== null) {
    var msg = queue[0].message;
    messageEl.textContent = msg;
    usernameEl.textContent = queue[0].username;
  }
    queue.shift();
    container.classList.add('visible');
    setTimeout(function() {
      var audio = new Audio(ttsUrl + encodeURIComponent(msg));
      audio.play();
      setTimeout(function() {
        container.classList.remove('visible');
        setTimeout(function() {
          playing = false;
          if(queue.length > 0) {
            notify(null);
          }
        }, ttsTime);
      }, displayTime);
    }, 2000);
  }
};

socket.on('subMsg', notify);
socket.on('stopSound', function(){
  tts.stop();
});
