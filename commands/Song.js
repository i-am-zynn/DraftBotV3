const ytdl = require('ytdl-core');

class Song {
	constructor(title, url, type, authorname, thumbnail) {
		this.title = title;
		this.url = url;
		this.type = type; //youtube, soundcloud, search
		this.author = authorname;
		this.thumbnail = thumbnail;
	}

	getStream() {
		if (this.type == 'search') return this.url;
		if (this.type == 'youtube') {
			return ytdl(this.url, {
				retries: 7,
				highWaterMark: 32768,
			});
		}
		if (this.type == 'soundcloud') return null; //need api key.
	}
}

module.exports = Song;
