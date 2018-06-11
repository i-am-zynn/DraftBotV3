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
      clearCmd = require('./commands/clear');

// ;


DraftBot.on('ready', () => {
  console.log("DraftBot connecté !")
  DraftBot.user.setActivity('Lire ses lignes', { type: 'PLAYING' })
});

DraftBot.on('message', message => {
  getCommand(message);
});

DraftBot.on('messageUpdate', message => {
  getCommand(message);
});

const getCommand = (message) => {
    const { content } = message;
    
    if (message.author.bot || message.channel.type != 'text')
        return;
    
    if(content[0] !== config.prefix)
        return;
    
    const [, cmd, fullArgs] = /^!([a-z]+)\s*(.*)/.exec(content);
    
    executeCommand(cmd,message,fullArgs);
}

const executeCommand = (cmd,message,fullArgs) => {
    const commands = {
        music: () => musicCmd.execute(fullArgs,message),
        m: () => musicCmd.execute(fullArgs,message),
        fortnite: () => fortniteCmd.execute(fullArgs,message),
        ftn: () => fortniteCmd.execute(fullArgs,message),
        commmande: () => commmandeCmd.execute(message),
        quote: () => quoteCmd.execute(fullArgs,message),
        google: () => googleCmd.execute(fullArgs,message),
        help: () => helpCmd.execute(message),
        infos: () => infosCmd.execute(message),
        info: () => infosCmd.execute(message),
        ping: () => pingCmd.execute(message),
        say: () => sayCmd.execute(fullArgs,message),
        clear: () => clearCmd.execute(fullArgs,message)
    }
    if(!commands[cmd]){
        message.channel.send('help')
        return;
    }
    return commands[cmd]();
}

DraftBot.login(config.token)

process.on('SIGINT', () => {
  DraftBot.destroy()
});