
require("dotenv").config();

var axios = require("axios");
var inquirer = require("inquirer");
var keys = require("./keys.js");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var userQuery = process.argv.slice(3).join(" ");
var userInput = process.argv[2];
var fs = require("fs");
var filename = './random.txt';

inquirer.prompt([{
    type: "list",
    message: "Please choose one of the following choices",
    choices: ["movie-this", "concert-this", "spotify-this", "do-what-it-says"],
    name: "input"
}]).then(function (res) {
    userInput = res.input;
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;

        case "spotify-this":
            spotifyThis();
            break;

        case "movie-this":
            movieThis();
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
        default: console.log("Nothing here")
            break;
    }
});


/* Concert Section */

function concertThis() {
    inquirer.prompt([{
        type: "input",
        message: "Please input your favorite band here: ",
        name: "band"
    }]).then(function (res) {
        var band = res.band;
        var queryURL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
        axios.get(queryURL).then(function (response) {
            var firstResult = response.data[0];
            var concertDate = moment(firstResult.datetime).format("MM/DD/YYYY hh:00 A");
            console.log(
                "Artist: " + firstResult.lineup + "\n" +
                "Venue: " + firstResult.venue.name + "\n" +
                "Location: " + firstResult.venue.city + ", " + firstResult.venue.region + "\n" +
                "Date: " + concertDate + "\n" +
                "Tickets: " + firstResult.url
            );

        }).catch((error) => {
            if (error) {
                console.log("Sorry, nothing found");
            }
        });
    });
}
/* Song Section */
function spotifyThis() {
    inquirer.prompt([{
        type: "input",
        message: "Please input your favorite song here: ",
        name: "song"
    }]).then(function (res) {
        if (res.song === "") {
            spotifyThisSong("Ace of Base");
        } else {
            spotifyThisSong(res.song);
        }
    });
}

function spotifyThisSong(song) {
    spotify.search({
        type: "track",
        query: song
    }, function (error, data) {
        if (error) {
            console.log(error + "\n");
        } else {
            console.log("\nArtist: " + data.tracks.items[0].album.artists[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Preview URL: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }
    });
}

/* Movie Section */
function movieThis() {
    inquirer.prompt([{
        type: "input",
        message: "Please input your favorite movie here: ",
        name: "movie"
    }]).then(function (response) {
        var movie = response.movie;
        if (!movie) {
            movie = "Mr. Nobody";
        }
        axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movie).then(function (response) {
            if (response.data.Title === undefined) {
                console.log("Sorry, your movie was not found.")
            } else {
                console.log("Title: " + response.data.Title)
                console.log("Release Year: " + response.data.Year)
                console.log("Rating: " + response.data.imdbRating)
                console.log("Country: " + response.data.Country)
                console.log("Language: " + response.data.Language)
                console.log("Plot: " + response.data.Plot)
                console.log("Actors: " + response.data.Actors)
            }
        });
    });
}

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        var dataArr = data.split(",");
    });
};
