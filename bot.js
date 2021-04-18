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
  //   console.log(lyrics);
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
// setInterval(lyricTweet, 21600000);
// testing
// setInterval(lyricTweet, 10000);

// Tweet at midnight
const job = new CronJob("00 00 00 * * *", function () {
  const d = new Date();
  console.log("Midnight:", d);
  lyricTweet();
});

// Tweet at 6am
const job2 = new CronJob("00 00 06 * * *", function () {
  const d = new Date();
  console.log("6am:", d);
  lyricTweet();
});

// Tweet at midday
const job3 = new CronJob("00 00 12 * * *", function () {
  const d = new Date();
  console.log("Midday:", d);
  lyricTweet();
});

// Tweet at 6pm
const job4 = new CronJob("00 00 18 * * *", function () {
  const d = new Date();
  console.log("6pm:", d);
  lyricTweet();
});

job.start();
job2.start();
job3.start();
job4.start();
