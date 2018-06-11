const Discord = require('discord.js')

const execute = (fullArgs,message) => {
	const question = fullArgs.split(' ').filter((val) => val !== '').join('+');

	message.channel.send(`Hey celà pourrais t'aider !\nhttps://www.lmgtfy.com/?q=${question}`);
}

module.exports.execute = execute;