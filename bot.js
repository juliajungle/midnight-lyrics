#!/usr/bin/env node
const config = require("./config/config");
const twit = require("twit");
const T = new twit(config);
const CronJob = require("cron").CronJob;

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
	if (new Date().getHours() == 0) {
		var tweet = "We are one beating heart";
		var id = "heart";
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
	}

	// Tweet that lyric
	T.post("statuses/update", { status: tweet }, tweeted);

	// Callback for when the tweet is sent
	function tweeted(err, data, response) {
		if (err) {
			console.log(err);
		} else {
			console.log("Success: " + data.text, id);
			// on success, tweet reply with spotify link or other option

			if (id === "eyes") {
				var reply = `👀`;
			} else if (id === "saxsolo") {
				var reply = `🎷🎷🎷`;
			} else if (id === "heart") {
				var reply = `💓`;
			} else if (id === "coldpizza") {
				var reply = `🍕 https://www.youtube.com/watch?v=8i5MYaVSSHE`;
			} else {
				var reply = emoji
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
	}
}

// Tweet at every 2 hours
const job = new CronJob("00 00 */2 * * *", function () {
	lyricTweet();
});

job.start();
