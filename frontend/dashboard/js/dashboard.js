 var socket = io('http://hosted.stylerdev.io:3100');

var lastTen = [];
var list = document.getElementsByClassName('content')[0];

var getAvatar = function(user) {
  var defer = jQuery.Deferred();
  $.getJSON('https://api.twitch.tv/kraken/users/' + user + '?&callback=?', function(data) {
    defer.resolve(data.logo);
  });
  return defer.promise();
};

var sectionFactory = function(username, message, resub, timestamp) {
  getAvatar(username).then(function(avatar){
    var date = new Date();
    if(resub > 0)
    list.insertAdjacentHTML('beforeend', '<div class=\"cart\"><div class=\"img-hold\"> <img src="' + avatar + '"> </div><section class =\"message-wrap\"><div class =\"user-info\"> <span class=\"username\">' + username + ' (Resub for ' + resub + ' months)</span><span class=\"time\">' + moment().startOf(timestamp).fromNow() + '</span></div><p class=\"message\">' + message + '</p></div></div></section></div>');
    else
    list.insertAdjacentHTML('beforeend', '<div class=\"cart\"><div class=\"img-hold\"> <img src="' + avatar + '"> </div><section class =\"message-wrap\"><div class =\"user-info\"> <span class=\"username\">' + username + ' (New Subscriber)</span><span class=\"time\">' + moment().startOf(timestamp).fromNow() +  '</span></div><p class=\"message\">' + message + '</p></div></div></section></div>');
  });
};



var findLastTen = function(data) {
  if(data !== null) {
    lastTen.unshift(data);
    if(lastTen.length > 10) {
      lastTen.pop();
    }
    list.innerHTML = ' ';
    for(var j = 0; j < lastTen.length; j++) {
      sectionFactory(lastTen[j].username, lastTen[j].message, lastTen[j].resub, lastTen[j].timestamp);
    }
  }
};


sectionFactory('itsawesomebacon', 'hey kappa kappa hey', 4, Date.now());
socket.on('subMsg', findLastTen);
