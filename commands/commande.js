const Discord = require('discord.js')

const execute = (message) => {
	const guild = message.guild;

	const name = Math.floor(Math.random() * 3000 + 999)+"-"+message.author.username;

	message.member.createDM().then(channel => {
        const embed = new Discord.RichEmbed()
        .setTitle("DraftMan.fr - WebDesigner", "https://www.draftman.fr")
        .setColor(0xcd6e57)
        .setDescription(`Félicitaion tu es maintenant client !\nJe viens de remarquer que tu viens d'executer la commande \`/commande\`.\n\nUn channel t'as été crée, tu pourras y parler avec DraftMan et lui expliquer ta commande !\n\n**Channel : **${name}`)
        .setFooter("DraftMan | Développeur FrontEnd & Graphiste", "https://www.draftman.fr/images/favicon.png");
        return channel.send({embed});
    });
	guild.createChannel(name,"text").then(data => {
		data.setParent('433765400405344256');
		data.send("Hey, "+message.author+" !\nJe t'encourage a faire une petite description de ta commande à <@207190782673813504> !");
		data.overwritePermissions(message.author, { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': true });
		data.overwritePermissions(guild.defaultRole, { 'VIEW_CHANNEL': false, 'SEND_MESSAGES': false });
	});

	guild.member(message.author).addRole(guild.roles.find("name","Client"));
}

module.exports.execute = execute;