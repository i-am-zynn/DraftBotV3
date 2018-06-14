const embeds = require('../embeds');

class MusicPlayer {
    constructor(guild) {
        this.queue = [];
        this.musicChannel = null;
        this.voiceConnection = null;
        this.dispatch = null;
        this.volume = 1;
        this.status = 'offline'; //States: offline, playing, stopped
        this.inactivityTimer = 60;
    }
    queueSong(song) {
        let index;
        if (arguments.length == 2) index = arguments[1];
        if (index != undefined) {
            this.queue[index] = song;
        } else {
            this.queue.push(song);
        }
    }
    playSong(msg) {
        if (this.queue.length === 0) {
            this.musicChannel.send(`:musical_note: | Musiques en attente terminés.`);
            this.changeStatus('stopped');
        } else {
            let song = this.queue[0];
            let stream = song.getStream();
            if (this.voiceConnection) {
                this.musicChannel.send(embeds.songEmbed(song));
                this.changeStatus('playing');
                if (this.queue.length === 0) this.playSong(msg);
                this.dispatch = this.voiceConnection.playStream(stream, {
                    passes: 2,
                    volume: this.volume
                });

                this.dispatch.on('error', error => {
                    this.dispatch = null;
                    this.queue.shift();
                    this.playSong(msg);
                });

                this.dispatch.on('end', reason => {
                    this.dispatch = null;
                    this.queue.shift();
                    if (reason != 'leave') {
                        this.playSong(msg);
                    }
                });

                this.dispatch.on('debug', info => {
                    console.log(info);
                });
            } else {
                this.musicChannel = msg.channel;
                msg.member.voiceChannel.join().then(connection => {
                    this.voiceConnection = connection;
                    this.changeStatus('stopped');
                    if (this.queue.length > 0) this.playSong(msg);
                    this.dispatch = connection.playStream(stream, {
                        passes: 2,
                        volume: this.volume
                    });

                    this.dispatch.on('error', error => {
                        this.dispatch = null;
                        this.queue.shift();
                        this.playSong(msg);
                    });

                    this.dispatch.on('end', reason => {
                        this.dispatch = null;
                        this.queue.shift();
                        if (reason != 'leave') {
                            this.playSong(msg);
                        }
                    });

                    this.dispatch.on('debug', info => {
                        console.log(info);
                    });
                })
            }
        }
    }
    skipSong() {
        if (this.dispatch && this.status == 'playing') {
            this.musicChannel.send(`:fast_forward: ${this.queue[0].title} viens d'être passé !`);
            this.dispatch.end();
        } else {
            this.musicChannel.send(
                `:no_entry_sign: | Il n'y a pas de musique à passer !`
            );
        }
    }
    pauseSong() {
        if (this.dispatch) {
            this.dispatch.pause();
            this.musicChannel.send(":musical_note: | La musique viens d'être mis en pause.");
        } else {
            this.musicChannel.send(
                `:no_entry_sign: | Il n'y a pas de musique en cours !`
            );
        }
    }
    resumeSong() {
        if (this.dispatch) {
            this.dispatch.resume();
            this.musicChannel.send(":musical_note: | La musique viens d'être remise.");
        } else {
            this.musicChannel.send(
                `:no_entry_sign: | Il n'y a pas de musique en pause !`
            );
        }
    }
    printQueue(msg) {
        if (this.queue.length > 0) {
            try {
                let queueString = '';
                for (let i = 0; i < this.queue.length && i < 15; i++)
                    queueString += `${i + 1}. ${this.queue[i].title} (\`${
						this.queue[i].time
					}\`) ajoué par ${this.queue[i].author}\n`;
                if (this.queue.length > 15)
                    queueString += `\net ${this.queue.length - 15} de plus.`;
                msg.channel.send(queueString, {
                    code: true,
                });
            } catch (err) {
                console.log('ERROR CAUGHT:\n' + err);
                msg.channel.send(
                    `Impossible d'afficher la file d'attente. Réessayez dans quelques instants.`
                );
            }
        } else {
            msg.channel.send(
                `:no_entry_sign: | Il n'y a pas de musique en attente !`
            );
        }
    }
    purgeQueue(msg) {
        this.queue = [];
        msg.channel.send(
            ":musical_note: | La liste d'attente viens d'être vidé."
        );
    }
    nowPlaying(msg) {
        if (this.queue.length > 0) {
            msg.channel.send(embeds.songEmbed(this.queue));
        } else {
            msg.channel.send(
                ":no_entry_sign: | Il n'y a pas de musique en cours !"
            );
        }
    }
    setVolume(msg) {
        let vol = parseInt(msg.content.split(/\s+/)[2]) / 100;
        if (vol && (vol >= 0 && vol <= 1)) {
            if (this.dispatch) {
                this.dispatch.setVolume(vol);
                this.volume = vol;
                msg.channel.send(
                    `:speaker: | Le volume viens d'être réglé sur \`${vol * 100} %\``
                );
            } else {
                msg.channel.send(
                    `:no_entry_sign: | Il n'y a pas de musique en cours !`
                );
            }
        } else {
            msg.channel.send(
                ':no_entry_sign: | Veuillez utiliser un nombre entre `0` et `100` !'
            );
        }
    }
    leaveVc(msg) {
        if (this.voiceConnection) {
            this.musicChannel = null;
            if (this.dispatch) this.dispatch.end('leave');
            this.voiceConnection.disconnect();

            this.changeStatus('offline');

            this.voiceConnection = null;
            this.dispatch = null;
        } else {
            msg.channel.send(
                `:no_entry_sign: | Je ne peux pas quitter un salon si je n'y suis pas 🤔 !`
            );
        }
    }
    changeStatus(status) {
        this.status = status;
        this.inactivityTimer = status == 'paused' ? 600 : 120;
    }
}

module.exports = MusicPlayer;
