// var socket = io('http://hosted.stylerdev.io:3100');
var socket = io('http://localhost:3100');

var lastTen = [];
var list = document.getElementsByClassName('content')[0];
var subCount = 0;
var resubCount = 0;
var userCount = 0;
var viewerMessages;

var viewerMsg = function(data){
  viewerMessages = data.userMessages;
  viewerMessages ? $('.button').text('Disable Viewer Messages') : $('.button').text('Enable Viewer Messages');
};

$('.button').click(function() {
  viewerMessages = !viewerMessages;
  viewerMessages ? $('.button').text('Disable Viewer Messages') : $('.button').text('Enable Viewer Messages');
  socket.emit('changeSettings', {
    viewerMessages: viewerMessages
  });
});

var getAvatar = function(user) {
  var defer = jQuery.Deferred();
  $.getJSON('https://api.twitch.tv/kraken/users/' + user + '?&callback=?', function(data) {
    defer.resolve(data.logo);
  });
  return defer.promise();
};

var sectionFactory = function(username, message, type, resub) {
  getAvatar(username).then(function(avatar){
    switch(type){

      default:
      console.log('ERROR');
      break;

      case 'userMsg':
      userCount++;
      list.insertAdjacentHTML('afterbegin', '<div class=\"cart\"><div class=\"img-hold\"> <img src="' + avatar + '"> </div><section class =\"message-wrap\"><div class =\"user-info\"> <span class=\"username\">' + username + '</span><span class=\"type\"> (Viewer Message)</span><span class=\"time\">' + moment().format('h:mm:ss a') +  '</span></div><p class=\"message\">' + message + '</p></div></div></section></div>');
      $('#viewer').text(userCount);
      break;

      case 'resubMsg':
      resubCount++;
      list.insertAdjacentHTML('afterbegin', '<div class=\"cart\"><div class=\"img-hold\"> <img src="' + avatar + '"> </div><section class =\"message-wrap\"><div class =\"user-info\"> <span class=\"username\">' + username + '</span><span class=\"type\"> (' + resub + ' months)</span><span class=\"time\">' +  moment().format('h:mm:ss a') + '</span></div><p class=\"message\">' + message + '</p></div></div></section></div>');
      $('#resub').text(resubCount);
      break;

      case 'subMsg':
      subCount++;
      list.insertAdjacentHTML('afterbegin', '<div class=\"cart\"><div class=\"img-hold\"> <img src="' + avatar + '"> </div><section class =\"message-wrap\"><div class =\"user-info\"> <span class=\"username\">' + username + '</span><span class=\"type\"> (New Sub)</span><span class=\"time\">' +  moment().format('h:mm:ss a') +  '</span></div><p class=\"message\">' + message + '</p></div></div></section></div>');
      $('#sub').text(subCount);
      break;

    }
  });
};



var findLastTen = function(data) {
  if(data !== null) {
    lastTen.unshift(data);
    if(lastTen.length > 10) {
      lastTen.pop();
    }

    // list.innerHTML = ' ';
    sectionFactory(lastTen[0].username, lastTen[0].message, lastTen[0].type, lastTen[0].resub);
  }
};

socket.on('message', findLastTen);
socket.on('settings', viewerMsg);
