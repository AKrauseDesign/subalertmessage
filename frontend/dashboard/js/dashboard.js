// var socket = io('http://hosted.stylerdev.io:3100');

var lastTen = [];
var list = document.getElementsByClassName('content')[0];

var getAvatar = function(user) {
  console.log('testing...');
  $.getJSON('https://api.twitch.tv/kraken/users/' + user + '?&callback=?', function(data) {
    console.log(data.logo);
    return data.logo;
  });
};



var sectionFactory = function(username, message, resub) {
  var date = new Date();
  if(resub > 0)
       list.insertAdjacentHTML('beforeend', '<div class=\"cart\"><div class=\"img-hold\"> <img src="' + getAvatar(username) + '"> </div><section class =\"message-wrap\"><div class =\"user-info\"> <span class=\"username\">' + username + ' (Resub for ' + resub + ' months)</span><span class=\"time\">' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + '</span></div><p class=\"message\">' + message + '</p></div></div></section></div>');
  else
       list.insertAdjacentHTML('beforeend', '<div class=\"cart\"><div class=\"img-hold\"> <img src="' + getAvatar(username) + '"> </div><section class =\"message-wrap\"><div class =\"user-info\"> <span class=\"username\">' + username + ' (New Subscriber)</span><span class=\"time\">' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + '</span></div><p class=\"message\">' + message + '</p></div></div></section></div>');
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


sectionFactory('itsawesomebacon', 'hey kappa kappa hey', 4);
socket.on('subMsg', findLastTen);
