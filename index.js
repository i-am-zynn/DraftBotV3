const Discord = require('discord.js')

const config = require('./config.json')

const DraftBot = new Discord.Client()

// Commandes : 

const musicCmd = require('./commands/music'),
    fortniteCmd = require('./commands/fortnite'),
    commmandeCmd = require('./commands/commande'),
    quoteCmd = require('./commands/quote'),
    googleCmd = require('./commands/google'),
    helpCmd = require('./commands/help'),
    infosCmd = require('./commands/infos'),
    pingCmd = require('./commands/ping'),
    sayCmd = require('./commands/say'),
    clearCmd = require('./commands/clear'),
    sondageCmd = require('./commands/sondage'),
    embeds = require('./embeds');
// ;

DraftBot.on('ready', () => {
    console.log('DraftBot connecté !')
    console.log(`Actif sur ${DraftBot.guilds.size} serveurs.`);
    DraftBot.user.setActivity('Lire ses lignes', {
        type: 'PLAYING'
    })
});

DraftBot.on('messageUpdate', message => {
    getCommand(message);
});

DraftBot.on('message', message => {
    getCommand(message);
    pinCreation(message);
});

DraftBot.on('guildMemberAdd', member => {
	if(member.guild.name === "DraftMan - WebDesign"){
		member.addRole(member.guild.roles.find("name","Membre"));
		try {
			member.createDM().then(channel => {
				return channel.send(embeds.welcome(member));
			});
		} catch (e) {
			member.guild.defaultChannel.send("Hé "+member.author+", tu as désactivé tes messages privés !\nDommage !\nJe voulais t'envoyer un message de bienvenue et pourquoi pas prévoir un rendez-vous chez toi 😉")
		}
	}else{
		member.createDM().then(channel => {
			return channel.send(embeds.welcomeOtherGuild(member));
		});
	}

	if(member.guild.channels.find("name","logs")){
		member.guild.channels.find("name","logs").send(embeds.join(member.user));
	}
});

DraftBot.on('guildMemberRemove', member => {
	if(member.guild.channels.find("name","logs")){
		member.guild.channels.find("name","logs").send(embeds.left(member.user));
	}
});

const getCommand = (message) => {
    const {
        content
    } = message;

    if (message.author.bot || message.channel.type != 'text')
        return;

    if (content[0] !== config.prefix)
        return;

    const [, cmd, fullArgs] = /^!([a-z]+)\s*(.*)/.exec(content);

    executeCommand(cmd, message, fullArgs);
}

const executeCommand = (cmd, message, fullArgs) => {
    const commands = {
        music: () => musicCmd.execute(fullArgs, message),
        m: () => musicCmd.execute(fullArgs, message),
        fortnite: () => fortniteCmd.execute(fullArgs, message),
        ftn: () => fortniteCmd.execute(fullArgs, message),
        commmande: () => commmandeCmd.execute(message),
        quote: () => quoteCmd.execute(fullArgs, message),
        google: () => googleCmd.execute(fullArgs, message),
        help: () => helpCmd.execute(message),
        infos: () => infosCmd.execute(message),
        info: () => infosCmd.execute(message),
        ping: () => pingCmd.execute(message),
        say: () => sayCmd.execute(fullArgs, message),
        clear: () => clearCmd.execute(fullArgs, message),
        sondage: () => sondageCmd.execute(fullArgs, message)
    }
    if (!commands[cmd]) {
        message.channel.send(embeds.help())
        return;
    }
    return commands[cmd]();
}

DraftBot.login(config.token)

process.on('SIGINT', () => {
    DraftBot.destroy()
});


const pinCreation = message => {
    if (message.channel === DraftBot.channels.find('name','creations')) {
		if(message.attachments.filename !== undefined || message.content.includes('http')){
			message.react("❤");
			message.pin();
		}
		if (message.type == 'PINS_ADD'){
			message.delete();
		}
	}
}