const Discord = require('discord.js');
const rp = require('request-promise');
const fetch = require('node-fetch');
const ffmpeg = require('ffmpeg');
const config = require('../config.json');
const embeds = require('../embeds');

const Song = require('./Song');
const MusicPlayer = require('./MusicPlayer');

const emoji = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣'];
const emojiTxt = [':one:', ':two:', ':three:', ':four:', ':five:'];

let guilds = {};
const musics = new Map();

const execute = (fullArgs, message) => {
    if (!message.guild.available) return;
    if (!guilds[message.guild.id]) {
        guilds[message.guild.id] = new MusicPlayer();
    }

    let musicPlayer = guilds[message.guild.id];

    let musicCmd = fullArgs.split(' ').filter((val) => val !== '')[0];

    const args = fullArgs.split(' ').filter((val) => val !== '').slice(1);

    if (musicCmd) musicCmd.toLowerCase();
    switch (musicCmd) {
        case 'play':
            return playMusic(message, musicPlayer, args);
        case 'p':
            return playMusic(message, musicPlayer, args);
        case 'skip':
            return musicPlayer.skipSong(message);
        case 'next':
            return musicPlayer.skipSong(message);
        case 'pause':
            return musicPlayer.pauseSong();
        case 'resume':
            return musicPlayer.resumeSong();
        case 'queue':
            return musicPlayer.printQueue(message);
        case 'np':
            return musicPlayer.nowPlaying(message);
        case 'volume':
            return musicPlayer.setVolume(message);
        case 'clear':
            return musicPlayer.purgeQueue(message);
        case 'music':
            return musicPlayer.nowPlaying(message);
        case 'musique':
            return musicPlayer.nowPlaying(message);
        case 'leave':
            return musicPlayer.leaveVc(message);
        default:
            message.channel.send(embeds.helpm());
    }
}

const playMusic = (message, musicPlayer, args) => {
    if (!args[0]) return;
    if (!args[0].startsWith('http')) {
        search(message, args);

    } else if (args.search('youtube.com')) {
        let playlist = args.match(/list=(\S+?)(&|\s|$|#)/);
        if (playlist) {
            youtube.playlist(message, musicPlayer, playlist[1]);
        } else if (url.search(/v=(\S+?)(&|\s|$|#)/)) {
            youtube.song(message, musicPlayer, args[1])
        } else {
            message.channel.send(`:no_entry_sign: | Lien youtube invalide !`);
        }
    } else if (url.search('soundcloud.com')) {
        //Soundcloud.
        message.channel.send(`:no_entry_sign: | Bientôt disponible !`);
    } else {
        message.channel.send(`:no_entry_sign: | Nous ne supportons uniquement Youtube pour l'instant`);
    }
}

const search = (message, args) => {
    const keywords = encodeURIComponent(args.join(' ')).replace(/%20/g, '+');
    fetch(`https://www.googleapis.com/youtube/v3/search?order=viewCount&type=video&part=snippet&maxResults=5&key=${config.youtube_api}&q=${keywords}`)
        .then((res) => res.json())
        .then((data) => {
            const {
                items: videos
            } = data;

            const author = `${message.author.username}#${message.author.discriminator}`;
            const temp = new Map();

            const description = videos.reduce((prev, curr, i) => {
                temp.set(emoji[i], `${emojiTxt[i]}§${videos[i].snippet.title}§https://www.youtube.com/watch?v=${videos[i].id.videoId}§${author}§${videos[i].snippet.thumbnails.default.url}`);
                return `${prev}\n${emoji[i]} | [${videos[i].snippet.title}](https://www.youtube.com/watch?v=${videos[i].id.videoId})`;
            }, `Ajoutez une réaction à la musique de votre choix pour la lancer !\n`);
            // title§url§author§image

            const id = Math.floor(Math.random() * 3000 + 999);

            const embed = new Discord.RichEmbed()
                .setTitle(`Liste des musiques disponibles (${id})`)
                .setDescription(description)
                .setColor(0xcd6e57);

            musics.set(id.toString(), temp);

            message.reply({embed}).then(async (msg) => {
                for (let j = 0; j < videos.length; j++) await msg.react(emoji[j]);
            });

            message.client.on('messageReactionAdd', (messageReaction, user) => {
                const member = messageReaction.message.guild.member(user);
                const channel = messageReaction.message.channel;
                if (user.bot) return;
                if (messageReaction.message.embeds[0].description.startsWith('Ajoutez une réaction à la musique de votre choix')) {
                    const id = messageReaction.message.embeds[0].title.substring(32, 36);
                    const emoji = messageReaction.emoji.name;
                    if (musics.get(id)) {
                        if (member.voiceChannel) {
                            const info = musics.get(id).get(emoji).split("§");
                            const musicPlayer = guilds[messageReaction.message.guild.id];
                            console.log(info[1]);
                            musicPlayer.queueSong(new Song(info[1], info[2], 'youtube', info[3], info[4]));
                            if (musicPlayer.status != 'playing') musicPlayer.playSong(message);
                            messageReaction.message.clearReactions();
                        } else {
                            message.channel.send(`:no_entry_sign: | Vous devez être dans un salon vocal pour lancer une musique !`)
                            messageReaction.remove(user)
                        }
                    }
                }
            });
        }).catch((error) => {
            console.log(error.message);
        });
}

const youtube = {
    song(msg, guild, args) {
        args = args.match(/v=(\S+?)(&|\s|$|#)/).subtring(2);
        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${config.youtube_api}&id=${args}`)
            .then((res) => res.json())
            .then((data) => {
                const videos = data.items;
                const author = `${message.author.username}#${message.author.discriminator}`;
                musicPlayer.queueSong(
                    new Song(videos[i].snippet.title, `https://www.youtube.com/watch?v=${args}`, 'youtube', author, videos[i].snippet.thumbnails.default.url)
                );
                message.channel.send(
                    `:musical_note: | La piste \`${videos[i].snippet.title}\` viens d'être ajouté par \`${author}\``);
                if (musicPlayer.status != 'playing')
                    musicPlayer.playSong(message);
            });
    },
    playlist(message, musicPlayer, playlistId) {
        Promise.all([getPlaylistName(), getPlaylistSongs([], null)])
            .then((results) => addToQueue(results[0], results[1]))
            .catch((err) => {
                console.log(err);
                message.channel.send(`:no_entry_sign: | Impossible d'ajouter la playlist a la file d'attente. Réessayez plus tard.`);
            });

        async function getPlaylistName() {
            let options = {
                url: `https://www.googleapis.com/youtube/v3/playlists?id=${playlist[1]}&part=snippet&key=${config.youtube_api}`,
            };
            let body = await rp(options);
            let playlistTitle = JSON.parse(body).items[0].snippet.title;
            return playlistTitle;
        }
        async function getPlaylistSongs(playlistItems, pageToken) {
            pageToken = pageToken ? `&pageToken=${pageToken}` : '';

            let options = {
                url: `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlist[1]}${pageToken}&part=snippet,contentDetails&fields=nextPageToken,items(snippet(title,resourceId/videoId,thumbnails),contentDetails)&maxResults=50&key=${config.youtube_api}`,
            };

            let body = await rp(options);
            let playlist = JSON.parse(body);
            playlistItems = playlistItems.concat(
                playlist.items.filter(
                    (item) => item.snippet.title != 'Deleted video'
                )
            );

            if (playlist.hasOwnProperty('nextPageToken')) {
                //More videos in playlist.
                playlistItems = await getPlaylistSongs(
                    playlistItems,
                    playlist.nextPageToken
                );
            }

            return playlistItems;
        }
        async function addToQueue(playlistTitle, playlistItems) {
            let queueLength = musicPlayer.queue.length;
            const author = `${message.author.username}#${message.author.discriminator}`;
            for (let i = 0; i < playlistItems.length; i++) {
                let song = new Song(
                    playlistItems[i].snippet.title,
                    `https://www.youtube.com/watch?v=${
                        playlistItems[i].snippet.resourceId.videoId
                    }`,
                    'youtube',
                    author,
                    '0:00',
                    playlistItems[i].snippet.thumbnails.medium.url ||
                    playlistItems[i].snippet.thumbnails.default.url
                );
                musicPlayer.queueSong(song, i + queueLength);
            }

            message.channel.send(`:musical_note: | ${playlistItems.length} pistes de \`${playlistTitle}\` viens d'être ajouté par \`${author}\``);

            if (musicPlayer.status != 'playing') {
                musicPlayer.playSong(message);
            }
        }
    },
}

module.exports.execute = execute;
