var socket = io('http://localhost:3100');

var queue = [];
var lastTen = [];

var list = document.getElementsByClassName('content')[0];

var sectionFactory = function(id, username, message) {
  list.insertAdjacentHTML('afterbegin', '<section id=\"' + id + '\"><span class=\"number\">' + id + '</span><div class=\"wrap\"><span class=\"title\">Username: </span> <span class=\"username\">' + username + '</span> <br> <span class=\"title\">Message: </span> <span class=\"message\">' + message + '</span> </div> </section>');
};

var findLastTen = function(data) {
  lastTen.push(data);
  if(lastTen.length > 10) {
    lastTen.pop();
   }
  for(var j = 0; j < lastTen.length; j++) {
    sectionFactory(j+1, lastTen[j].username, lastTen[j].message);
  }
};

var notify = function(data) {
  queue.push(data);

  if(!playing) {
    playing = true;
    var ttsUrl = 'http://text-to-speech-demo.mybluemix.net/synthesize?voice=en-US_AllisonVoice&text=';
    // var ttsUrl = 'http://hosted.stylerdev.io:3100/synthesize?voice=en-US_AllisonVoice&text=';
    var msg = queue[0].message;
    messageEl.textContent = queue[0].message;
    usernameEl.textContent = queue[0].username;
    queue.shift();
    container.classList.add('visible');
    setTimeout(function() {
      tts.src = ttsUrl + encodeURIComponent(msg);
      setTimeout(function(){
        container.classList.remove('visible');
        setTimeout(function() {
          playing = false;
          if(queue.length > 0) {
            notify(null);
          }
        }, 3000);
      }, displayTime - 2000);
    }, 2000);
  }
};

socket.on('subMsg', findLastTen);
socket.on('subMsg', notify);
socket.on('stopSound', function(){
  tts.stop();
});
