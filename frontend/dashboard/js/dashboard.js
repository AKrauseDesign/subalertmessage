var socket = io('http://hosted.stylerdev.io:3100');

var lastTen = [];
var list = document.getElementsByClassName('content')[0];

var sectionFactory = function(id, username, message, resub) {
  if(resub > 0) list.insertAdjacentHTML('beforeend', '<section id=\"' + id + '\"><span class=\"number\">' + id + '</span><div class=\"wrap\"><span class=\"title\">Username: </span> <span class=\"username\">' + username+' (Resub: '+resub+' months)'+'</span> <br> <span class=\"title\">Message: </span> <span class=\"message\">' + message + '</span></section>');
  else list.insertAdjacentHTML('beforeend', '<section id=\"' + id + '\"><span class=\"number\">' + id + '</span><div class=\"wrap\"><span class=\"title\">Username: </span> <span class=\"username\">' + username + ' (New Subscriber)</span> <br> <span class=\"title\">Message: </span> <span class=\"message\">' + message + '</span> </div> </section>');
};
var sectionFactory = function(username, message, resub) {
  var date = new Date();
  if(resub > 0)
  list.insertAdjacentHTML('beforeend', '<div class=\"cart\"><div class=\"img-hold\"> img link </div><section class =\"message-wrap\"><div class =\"user-info\"> <span class=\"username\">' + username + ' (Resub for ' + resub + ' months)</span><span class=\"time\">' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + '</span></div><p class=\"message\">' + message + '</p></div></div></section></div>');
  else list.insertAdjacentHTML('beforeend', '<div class=\"cart\"><div class=\"img-hold\"> img link </div><section class =\"message-wrap\"><div class =\"user-info\"> <span class=\"username\">' + username + ' (New Subscriber)</span><span class=\"time\">' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + '</span></div><p class=\"message\">' + message + '</p></div></div></section></div>');
};

var findLastTen = function(data) {
  if(data !== null) {
    lastTen.unshift(data);
  if(lastTen.length > 10) {
    lastTen.pop();
   }
  list.innerHTML = ' ';
  for(var j = 0; j < lastTen.length; j++) {
    sectionFactory(lastTen[j].username, lastTen[j].message, lastTen[j].resub);
  }
}
};

sectionFactory('test', 'test', 5);
sectionFactory('max', 'test', 0);

socket.on('subMsg', findLastTen);
