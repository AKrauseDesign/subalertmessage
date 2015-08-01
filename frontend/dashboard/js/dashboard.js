var socket = io('http://localhost:3100');

var lastTen = [];
var list = document.getElementsByClassName('content')[0];

var sectionFactory = function(id, username, message) {
  list.insertAdjacentHTML('beforeend', '<section id=\"' + id + '\"><span class=\"number\">' + id + '</span><div class=\"wrap\"><span class=\"title\">Username: </span> <span class=\"username\">' + username + '</span> <br> <span class=\"title\">Message: </span> <span class=\"message\">' + message + '</span> </div> </section>');
};

var findLastTen = function(data) {
  lastTen.push(data);
  if(lastTen.length > 10) {
    lastTen.pop();
   }
  list.innerHTML = ' ';
  for(var j = 0; j < lastTen.length; j++) {
    sectionFactory(j+1, lastTen[j].username, lastTen[j].message);
  }
};

socket.on('subMsg', findLastTen);
