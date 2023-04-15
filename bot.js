#!/usr/bin/env node
require('dotenv').config();

const { TwitterApi } = require('twitter-api-v2');
const twitterClient = new TwitterApi({
	appKey: process.env.API_KEY,
	appSecret: process.env.API_SECRET_KEY,
	accessToken: process.env.ACCESS_TOKEN,
	accessSecret: process.env.ACCESS_TOKEN_SECRET,
}).readWrite.v2;

const { Cron } = require('croner');
const https = require('https');

// Combine all the songs
var allSongs = [
	...require('./songs/songs.json'),
	...require('./songs/days_of_thunder.json'),
	...require('./songs/endless_summer.json'),
	...require('./songs/nocturnal.json'),
	...require('./songs/kids.json'),
	...require('./songs/monsters.json'),
	...require('./songs/horror_show.json'),
	...require('./songs/heroes.json'),
];

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// Lyric tweeting bot
const lyricTweet = async () => {
	// Special tweet at midnight
	if (new Date().getHours() === 0) {
		var tweet = 'We are one beating heart';
		var reply = '💓';
	} else {
		// Get a random song from files
		var randomInt = getRandomInt(allSongs.length - 1);
		var song = allSongs[randomInt];
		// then get a random lyric from that song
		var lyrics = song.lyrics.split('|');
		var tweet = lyrics[getRandomInt(lyrics.length - 1)];
		// get spotify id of song
		var id = song.id;
		var emoji = song.emoji;
		var reply = song.reply;
	}

	// Tweet that lyric
	try {
		const {data: createdTweet} = await twitterClient.tweet(tweet);

		// If reply is undefined, create one with emoji (if exist) and Spotify link
		if (reply === undefined) {
			reply = emoji
				? `${emoji} https://open.spotify.com/track/${id}`
				: `https://open.spotify.com/track/${id}`;
		}

		console.log('Tweet sent: ' + createdTweet.text);

		const {data: replyTweet} = await twitterClient.reply(reply, createdTweet.id);

		console.log('Reply sent: ' + replyTweet.text);
	}

	catch (err) {
		console.error(err);
	}
}

// Tweet at every 2 hours
Cron('00 */2 * * *', () => {
	lyricTweet();
});

// UptimeRobot heartbeat monitoring
if (process.env.UPTIMEROBOT_HEARTBEAT_URL !== '') {
	Cron('*/5 * * * *', () => {
		https.get(process.env.UPTIMEROBOT_HEARTBEAT_URL);
	});
}
