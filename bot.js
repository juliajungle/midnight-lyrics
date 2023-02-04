#!/usr/bin/env node
const config = require("./config/config");
const twit = require("twit");
const T = new twit(config);
const CronJob = require("cron").CronJob;
var songs = require("./songs.json");
var daysOfThunder = require("./days_of_thunder.json");
var endlessSummer = require("./endless_summer.json");
var nocturnal = require("./nocturnal.json");
var kids = require("./kids.json");
var monsters = require("./monsters.json");
var horrorShow = require("./horror_show.json");
var heroes = require("./heroes.json");

// combine all the songs
var allSongs = [
	...songs,
	...daysOfThunder,
	...endlessSummer,
	...nocturnal,
	...kids,
	...monsters,
	...horrorShow,
	...heroes,
];

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Lyric tweeting bot
function lyricTweet(isMidnight, isAprilFools) {
	if (isMidnight) {
		var tweet = "We are one beating heart";
		var id = "heart";
	} else if (isAprilFools) {
		var tweet = "Alt er klart i bakspejlet";
		var id = "eyes";
	} else {
		// Get a random song from files
		var randomInt = getRandomInt(0, allSongs.length - 1);
		var song = allSongs[randomInt];
		// then get a random lyric from that song
		var lyrics = song.lyrics.split("|");
		var tweet = lyrics[getRandomInt(0, lyrics.length - 1)];
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

// lyricTweet();

// Tweet at midnight -  "We are one beating heart"
const job = new CronJob("00 00 00 * * *", function () {
	lyricTweet(true);
});

// Tweet at 2am
const job2 = new CronJob("00 00 02 * * *", function () {
	lyricTweet();
});

// Tweet at 4am
const job3 = new CronJob("00 00 04 * * *", function () {
	lyricTweet();
});

// Tweet at 6am
const job4 = new CronJob("00 00 06 * * *", function () {
	lyricTweet();
});

// Tweet at 8am
const job5 = new CronJob("00 00 08 * * *", function () {
	lyricTweet();
});

// Tweet at 10am
const job6 = new CronJob("00 00 010 * * *", function () {
	lyricTweet();
});

// Tweet at midday
const job7 = new CronJob("00 00 12 * * *", function () {
	lyricTweet();
});

// Tweet at 2pm
const job8 = new CronJob("00 00 14 * * *", function () {
	lyricTweet();
});

// Tweet at 4pm
const job9 = new CronJob("00 00 16 * * *", function () {
	lyricTweet();
});

// Tweet at 6pm
const job10 = new CronJob("00 00 18 * * *", function () {
	lyricTweet();
});

// Tweet at 8pm
const job11 = new CronJob("00 00 20 * * *", function () {
	lyricTweet();
});

// Tweet at 10pm
const job12 = new CronJob("00 00 22 * * *", function () {
	lyricTweet();
});

job.start();
job2.start();
job3.start();
job4.start();
job5.start();
job6.start();
job7.start();
job8.start();
job9.start();
job10.start();
job11.start();
job12.start();
