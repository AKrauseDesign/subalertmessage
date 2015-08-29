 //var socket = io('http://hosted.stylerdev.io:3100');

var lastTen = [];
var list = document.getElementsByClassName('content')[0];

var getAvatar = function(user) {
  var Default = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPDxAQDxARDhAPDxEQEA8QDA8OEAwVFhQWGBURGBQYHCohGRslJxQUITEiJSkrLi46FyszQD8sNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAHgAeAMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAAAQIGBwQFA//EADQQAAIBAgIIAgkEAwAAAAAAAAABAgMRBAYFEiExQVFhcSIyFEJSYoGRocHREyNT4UOCsf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDsQKAICgCApbAYgysLAYgysLAYgtgBAUAQFKABQBAUtgIebHY+lQV6s1G+5b5S7I8OYNMrDpRhaVWS2J7qa9p/g0mrVlOTlOTlJ723dsDZsRm1f46LfWc7X+C/J51myr/FT+cjXwBtmFzZB7KtNw96MtdfLefdwuJp1Y61OSmuj3dGuBzY/bB4udGanTlqtfKXRrigOkkPDobSccTT1l4Zxspwv5XzXRnvAgKAICgCgoAh+eKrqlTlUluhFyfW3A/U+HnGrq4ay9ecU+y2gabicRKrOVSe2U3d9OhgRFAoIABARsD26Hx7w9aM/V3TXOL3/k6L229eZyxnRdA1XPDUW9+ok/hs+wHuBQBAUAUFAENfzrF+jxfKqr/FM2E+fp/CurhqsVterrR7x2gc5uW5gmW4GVxcxuLgW4uY3FwLc6FliLWEpX4pv6s57CLk1GKu5NJLm3sSOpYPDqlThTXqRUe9ltYH6AoAgKAKCgCAoA55mfRfo9a8V+3VblDlF8Ynx7nUdJYGGIpSpz3Pc+MHwkjm+k9HVcNPUqq1/LJeWa5oDzXJcxuLgZXFzG59/L2XJYi1Sp4aPR+Kp0XJdQPXkzRTlL0ia8MNlO680uMuyNzJTpqKUYpRjFWSSskuRkBAUAQoKABQBD8sTXhTi51JKEY75N2SGLxMKMJVKj1YxV2/t3Oaac0zPFzvLwwj5Kd7qPV82B9nS2cJyvHDL9OP8klecuy4Gs1q85vWnKU2+MpNs/G4uBlcXMbluBbn74TF1KMtalOUH7rtfuuJ57i4G56Hzgm1DEpR5VY7v9o8O6NuhJNJpppq6ad01zOPXPvZazBLDS1J3lQk9q3ul7y6c0B0QCElJJp3TV01tTT4lAgKAKCnm0niv0aFWr7EG11fBf8AANHztpZ1av6EX+3Rfit68/6NZLKTbbbu222+be9mNwKCEAyBiAMgYlApTG4uBu+RNLNp4ab8q1qT6etH7m4HIdH4t0atOrHfCSl3XFHXoSUkmtqaTT5pgAUAU1/PVTVwcl7U4R+t/sABzYgAAEAAAAUEAFAAFOs5eqOeEoSe90o/TYAB9AoAH//Z';
  var defer = jQuery.Deferred();
  $.getJSON('https://api.twitch.tv/kraken/users/' + user + '?&callback=?', function(data) {
    console.log(data.logo);
    defer.resolve(data.logo || Default);
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
