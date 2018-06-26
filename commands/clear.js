const Discord = require('discord.js')

const execute = (fullArgs,message) => {

    const number = fullArgs.split(' ').filter((val) => val !== '')[0];
    
	if (!message.member.hasPermission("MANAGE_MESSAGES")) {
		return message.channel.send(":no_entry_sign: | Vous n'avez pas la permission de supprimer des messages")
	}
	if(isNaN(number)){
		return message.channel.send(":no_entry_sign: | /clear <nombre de messages")
	}
			
    try {
        message.channel.bulkDelete(number);
        const embed = new Discord.RichEmbed()
        .setTitle(`Félicitation : \`${number}\` Messages `+(number == 1 ? "supprimé" : "supprimés"))
        .setColor(0xcd6e57);
        message.channel.send({ embed }).then(msg => {msg.delete(5000)});
    } catch (e) {
        message.channel.send(":no_entry_sign: | Je n'ai pas réussi a supprimer les messages")
    }
}

module.exports.execute = execute;