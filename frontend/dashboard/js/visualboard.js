var soundTiles = document.querySelectorAll('.sound-tile');

/*
 * Vars
 */


/*
 * Listeners
 */

[].forEach.call(soundTiles, function(e) {
  e.addEventListener('click', function() {
    var target = e.getAttribute('data-name');
    if (target === 'guns' || target === 'salt' || target === 'exorcism')
      sendEvent('overlay', 'kkona', target);
    else
      sendEvent('sound', 'kkona', target);
  });
});

/*
 * functions
 */

function sendEvent(mode, user, target) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3200/api/visualboard/' + mode + '/' + user + '/' + target);
  xhr.send();
  console.log('Sent event with mode: ' + mode + ', user: ' + user + ' and target: ' + target);
}
