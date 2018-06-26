const Discord = require('discord.js')
    
const execute = (fullArgs,message) => {

    const question = fullArgs.split(' ').filter(value => value).join(' ');

    if (!message.content.includes("§")) {
        return message.reply(":no_entry_sign: | !say <title>**§**<content>**§**<link(optional)>");
    }
    const msg = message.content.split("§");
    if (msg.length < 2 || msg.length > 3) {
        return message.reply(":no_entry_sign: | !say <title>**§**<content>**§**<link(optional)>");
    }

    const embed = new Discord.RichEmbed()
        .setTitle(":newspaper: " + msg[0])
        .setColor(0xcd6e57)
        .setTimestamp(new Date())
        .setFooter("DraftMan | Développeur FrontEnd & Graphiste", "https://www.draftman.fr/images/favicon.png")
    if (msg.length === 3) {
        embed.setURL(msg[2]);
    }
    message.channel.send({embed});
    message.delete();
}

module.exports.execute = execute;