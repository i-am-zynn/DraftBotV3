const Discord = require('discord.js')
const embeds = require('../embeds')

const execute = (message) => {
  message.reply(embeds.infos)
}

module.exports.execute = execute;