var socket = io('http://localhost:3100');

var lastTen = [];
var list = document.getElementsByClassName('content')[0];

var sectionFactory = function(username, message, resub) {
  if(resub > 0) list.insertAdjacentHTML('beforeend', '<div class=\"cart\"><div class=\"img-hold\"> img link </div><div class =\"message-wrap\"><div class =\"user-info\"> <span class=\"username\">' + username + ' (resub ' + resub + 'months)</span><span class=\"time\"> ' + Date.getDate() + '/' + Date.getMonth() + '/'  + Date.getFullYear() + '</span></div></div></div> <span class=\"message\">' + message + '</span></div></section>');
  else ist.insertAdjacentHTML('beforeend', '<div class=\"cart\"><div class=\"img-hold\"> img link </div><div class =\"message-wrap\"><div class =\"user-info\"> <span class=\"username\">' + username + '(New Subscriber)</span><span class=\"time\"> 15 minutes ago </div><span class=\"date\"> 0.1.08.2015 </span></div></div> <span class=\"message\">' + message + '</span></div></section>')
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

socket.on('subMsg', findLastTen);
