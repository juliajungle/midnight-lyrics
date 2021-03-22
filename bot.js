const config = require("./config/config");
const twit = require("twit");
const T = new twit(config);
var songs = require("./songs.json");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Lyric tweeting bot
function lyricTweet() {
  // Get a random song from file
  var song = songs[getRandomInt(0, songs.length - 1)];

  // then get a random lyric from that song
  var lyrics = song.split("\n");
  var tweet = lyrics[getRandomInt(0, lyrics.length - 1)];
  //   console.log(tweet);
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

// tweet once a day
setInterval(lyricTweet, 86400000);
// testing
// setInterval(lyricTweet, 100000);
