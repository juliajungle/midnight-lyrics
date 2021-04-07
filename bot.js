#!/usr/bin/env node
const config = require("./config/config");
const twit = require("twit");
const T = new twit(config);
var songs = require("./songs.json");
var daysOfThunder = require("./days_of_thunder.json");
var endlessSummer = require("./endless_summer.json");
var nocturnal = require("./nocturnal.json");
var kids = require("./kids.json");
var monsters = require("./monsters.json");
var horrorShow = require("./horror_show.json");

// combine all the songs
var allSongs = [
	...songs,
	...daysOfThunder,
	...endlessSummer,
	...nocturnal,
	...kids,
	...monsters,
	...horrorShow,
];

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Lyric tweeting bot
function lyricTweet() {
	// Get a random song from files
	var randomInt = getRandomInt(0, allSongs.length - 1);
	var song = allSongs[randomInt];

	// then get a random lyric from that song
	var lyrics = song.split("|");
	var tweet = lyrics[getRandomInt(0, lyrics.length - 1)];

	// Tweet that lyric
	T.post("statuses/update", { status: tweet }, tweeted);

	// Callback for when the tweet is sent
	function tweeted(err, data, response) {
		if (err) {
			console.log(err);
		} else {
			console.log("Success: " + data.text);
			//   console.log(response);
		}
	}
}

// tweet once every 6 hours
setInterval(lyricTweet, 14400000);
// testing
// setInterval(lyricTweet, 100000);
