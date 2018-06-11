const Discord = require('discord.js')

const execute = (message) => {
  const start = Date.now();
  message.channel.send("pong").then(sendedMessage => {
      const stop = Date.now();
      const diff = (stop - start);
      sendedMessage.edit(`pong \`${diff}ms\``);
  });
}

module.exports.execute = execute;