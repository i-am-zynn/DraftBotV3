const Discord = require('discord.js')

const execute = (fullArgs,message) => {
	const question = fullArgs.split(' ').filter((val) => val !== '').join('+');

	message.channel.send(`Hey, clique  [ici](https://www.lmgtfy.com/?q=${question}) celà pourrais t'aider !`);
}

module.exports.execute = execute;