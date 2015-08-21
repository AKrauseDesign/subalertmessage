var port = 3100;

var identity = {
  name: ['izlbot'],
  channels: ['massansc', 'stylerdev'],
  oauth: 'oauth:vjfg2k6x1iwbeo9kt4v8ah9j8v8oxk',
};

var tmi = {
  options: {
    debug: true
  },
  connection: {
    random: 'chat',
    reconnect: true
  },
  identity: {
    username: identity.name,
    password: identity.oauth
  },
  channels: identity.channels
};
var grouptmi = {
  options: {
    debug: true
  },
  connection: {
    random: 'group',
    reconnect: true,
    server: '199.9.253.120',
    port: 80
  },
  identity: {
    username: identity.name,
    password: identity.oauth
  },
  channels: identity.channels
};

module.exports = {
  tmi: tmi,
  grouptmi: grouptmi,
  identity: identity,
  port: port,
};
