const Discord = require('discord.js')
const embeds = require('../embeds')

const execute = (message) => {
  message.channel.send(embeds.help)
}

module.exports.execute = execute;