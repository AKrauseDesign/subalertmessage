var socket = io('http://localhost:3100');

var queue = [];

var sound = document.querySelector('.sound');
var container = document.querySelector('.subalert');
var usernameEl = container.querySelector('.username');
var messageEl = container.querySelector('.message');

var displayTime = 10 * 1000;
// sound.addEventListener('loadedmetadata', function(){
//   displayTime = sound.duration * 1000;
//   console.log(displayTime);
// });
var playing = false;

var notify = function(data) {
  if(data !== null) {
    queue.push(data);
  }
  if(!playing) {
    playing = true;
    messageEl.textContent = queue[0].message;
    usernameEl.textContent = queue[0].username;
    queue.shift();
    sound.play();
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

socket.on('subMsg', notify);
