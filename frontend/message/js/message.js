var socket = io('http://hosted.stylerdev.io:3100');
 // var socket = io('http://localhost:3100');
var queue = [];

var sound         = document.querySelector('.sound');
var container     = document.querySelector('.subalert');
var usernameEl    = document.querySelector('.username');
var messageEl     = document.querySelector('.message');
var typeEl        = document.querySelector('.type');
var user          = document.querySelector('.user');
var months        = document.querySelector('.months');



var displayTime = 5 * 1000;
var ttsTime = 20 * 1000;
var lastTen = [];
var playing = false;
var list = document.getElementsByClassName('content')[0];

var removeElement = function(node) {
  node.parentNode.removeChild(node);
};

var notify = function(data) {
  if (data !== null) {
    queue.push(data);
    $(user).show();
  }
  if (!playing) {
    playing      = true;
    var watson   = 'http://hosted.stylerdev.io:3100/synthesize?voice=en-US_AllisonVoice&text=';
    var sound    = new Audio();
    var msg      = queue[0].message;
    var username = queue[0].username;
    var type     = queue[0].type;

    // This allways going to display regardless of the type of the message
    messageEl.textContent  = msg;
    usernameEl.textContent = queue[0].username;

    switch(queue[0].type) {

      case "userMsg":
            typeEl.textContent = "Viewer Message";
            break;

      case "resubMsg":
            typeEl.textContent = "Resub: (" + queue[0].resub + ") Month(s)!";
            break;

      case "subMsg":
            typeEl.textContent = "New Subscriber!";
            break;

      default:
            console.warn("Failed retrieve type");
            typeEl.textContent = "Error";
            break;
  }


    queue.shift();
    container.classList.add('visible');
    setTimeout(function() {
      sound.load();
      sound.src = watson + encodeURIComponent(msg);
      sound.onended = function() {
        setTimeout(function() {
          playing = false;
          if (queue.length > 0) {
            notify(null);
          }
        }, 5000);
      };
      sound.play();
    }, 1000);
    setTimeout(function() {
      container.classList.remove('visible');
    }, 6000);
  }
};

socket.on('message', notify);
socket.on('stopSound', function() {
  sound.stop();
});
