#!/usr/bin/env node
require("dotenv").config();

const twit = require("twit");
const T = new twit({
	consumer_key: process.env.API_KEY,
	consumer_secret: process.env.API_SECRET_KEY,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const CronJob = require("cron").CronJob;
const https = require('https');

// Combine all the songs
var allSongs = [
	...require("./songs/songs.json"),
	...require("./songs/days_of_thunder.json"),
	...require("./songs/endless_summer.json"),
	...require("./songs/nocturnal.json"),
	...require("./songs/kids.json"),
	...require("./songs/monsters.json"),
	...require("./songs/horror_show.json"),
	...require("./songs/heroes.json"),
];

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// Lyric tweeting bot
function lyricTweet() {
	// Special tweet at midnight
	if (new Date().getHours() === 0) {
		var tweet = "We are one beating heart";
		var reply = "💓";
	} else {
		// Get a random song from files
		var randomInt = getRandomInt(allSongs.length - 1);
		var song = allSongs[randomInt];
		// then get a random lyric from that song
		var lyrics = song.lyrics.split("|");
		var tweet = lyrics[getRandomInt(lyrics.length - 1)];
		// get spotify id of song
		var id = song.id;
		var emoji = song.emoji;
		var reply = song.reply;
	}

	// Tweet that lyric and handle callback after it has been sent
	T.post("statuses/update", { status: tweet }, function (err, data, response) {
		if (err) {
			console.log(err);
		} else {
			console.log("Success: " + data.text, id);

			// If reply is undefined, create one with emoji (if exist) and Spotify link
			if (reply === undefined) {
				reply = emoji
					? `${emoji} https://open.spotify.com/track/${id}`
					: `https://open.spotify.com/track/${id}`;
			}
			T.post(
				"statuses/update",
				{ status: reply, in_reply_to_status_id: data.id_str },
				function (err, data, response) {
					console.log("Success: " + data.text);
				}
			);
		}
	});
}

// Tweet at every 2 hours
const job = new CronJob("00 00 */2 * * *", function () {
	lyricTweet();
});

// UptimeRobot heartbeat monitoring
const uptime = new CronJob("00 */5 * * * *", function () {
	https.get(process.env.UPTIMEROBOT_HEARTBEAT_URL);
});

job.start();
uptime.start();
