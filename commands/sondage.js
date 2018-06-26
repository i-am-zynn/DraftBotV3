const Discord = require('discord.js')
    
const execute = (fullArgs,message) => {

    const question = fullArgs.split(' ').filter(value => value).join(' ');

    const embed = new Discord.RichEmbed()
        .setDescription(":newspaper: Sondage")
        .addField(question,'Veuillez voter avec :white_check_mark: et :x:')
        .setColor(0xcd6e57)
        .setTimestamp(new Date())
        .setFooter("DraftMan | Développeur FrontEnd & Graphiste", "https://www.draftman.fr/images/favicon.png")
    message.delete();
    return message.channel.send({embed}).then(async message => {
        await message.react('✅')
        await message.react('❌')
    }).then(message => {
        message.client.on('messageReactionAdd', (messageReaction, user) => {
            const member = messageReaction.message.guild.member(user);
            const channel = messageReaction.message.channel;
            if (user.bot) return;
            if (messageReaction.message.embeds[0].description.startsWith(':newspaper: Sondage')) {
                const emoji = messageReaction.emoji.name;
                if (messageReaction.users.exists('username', user.username)) {
                    messageReaction.remove(user)
                    message.channel.send(`:no_entry_sign: | Vous ne pouvez voter qu'une seule fois !`).then(message => {message.delete(2000)})
                    return;
                }
            }
        });
    });
}

module.exports.execute = execute;