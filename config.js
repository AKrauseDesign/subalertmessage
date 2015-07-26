var port = 3000;

var identity = {
  name: ['izlbot'],
  channels: ['massansc', 'stylerdev', 'forsenlol'],
  oauth: 'oauth:vjfg2k6x1iwbeo9kt4v8ah9j8v8oxk',
};

var tmi = {
  options: {
    debug: true
  },
  connection: {
    random: 'group',
    reconnect: true
  },
  identity: {
    username: identity.name,
    password: identity.oauth
  },
  channels: identity.channels
};

module.exports = {
  tmi: tmi,
  identity: identity,
  port: port,
};
