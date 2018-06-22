const Discord = require('discord.js')
const embeds = require('../embeds')

const execute = (message) => {
  message.channel.send(embeds.infos(message))
}

module.exports.execute = execute;