var socket = io('http://localhost:3100');

var lastTen = [];
var list = document.getElementsByClassName('content')[0];

var sectionFactory = function(id, username, message, resub) {
  if(resub > 0) list.insertAdjacentHTML('beforeend', '<section id=\"' + id + '\"><span class=\"number\">' + id + '</span><div class=\"wrap\"><span class=\"title\">Username: </span> <span class=\"username\">' + username + '</span> <br> <span class=\"title\">Message: </span> <span class=\"message\">' + message + '</span> <span> Thanks For Resubscribing For' +  resub + ' in a row! </span> </div> </section>');
  else list.insertAdjacentHTML('beforeend', '<section id=\"' + id + '\"><span class=\"number\">' + id + '</span><div class=\"wrap\"><span class=\"title\">Username: </span> <span class=\"username\">' + username + '</span> <br> <span class=\"title\">Message: </span> <span class=\"message\">' + message + '</span> </div> </section>');
};

var findLastTen = function(data) {
  if(data !== null) {
  lastTen.unshift(data);
  if(lastTen.length > 10) {
    lastTen.pop();
   }
  list.innerHTML = ' ';
  for(var j = 0; j < lastTen.length; j++) {
    sectionFactory(j+1, lastTen[j].username, lastTen[j].message, lastTen[j].resub);
  }
}
};

socket.on('subMsg', findLastTen);
