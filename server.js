#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

"use strict";

var http = require("http"),
    server,
    player,
    score = {
        outcome: null,
        wins: 0,
        losses: 0,
        ties: 0
    },
    moves = ["rock", "paper", "scissors", "spock", "lizard"],
    serverResponse;


function beginHTML(res) {
    res.write("<!doctype html>\n");
    res.write("<html>\n");
    res.write("<head>\n");
    res.write("<title>473 HW5 - RPSSL</title>\n");
    res.write("</head>\n");
    res.write("<body>\n");
    res.write("<main><center>\n");
    res.write("<h1>Rock, Paper, Scissors, Spock, Lizard</h1>\n");
}

function endHTML(res) {
    res.write("</center></main>\n");
    res.write("</body>\n");
    res.end("</html>");
}

function output(res, serverResponse) {
    beginHTML(res);
    res.write("<p>Results</p>\n");
    res.write("<p>Your choice: " + player + "</p>\n");
    res.write("<p>Opponent's choice: " + serverResponse + "</p>\n");
    res.write("<br><p>Outcome: " + score.outcome + "</p>\n");
    res.write("<p>Wins: " + score.wins + "</p>\n");
    res.write("<p>Losses: " + score.losses + "</p>\n");
    res.write("<p>Ties: " + score.ties + "</p>\n");
    res.write("<form method='POST' action='../../'><input type='submit' value='Play again'></form>\n");
    endHTML(res);
}

function playPage(res) {
    beginHTML(res);
    res.write("<form method='POST' action='/play/rock'><input type='submit' value='Rock'></form>\n");
    res.write("<form method='POST' action='/play/paper'><input type='submit' value='Paper'></form>\n");
    res.write("<form method='POST' action='/play/scissors'><input type='submit' value='Scissors'></form>\n");
    res.write("<form method='POST' action='/play/spock'><input type='submit' value='Spock'></form>\n");  
    res.write("<form method='POST' action='/play/lizard'><input type='submit' value='Lizard'></form>\n");
    endHTML(res);
}

//http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function lose() { score.losses++; score.outcome = "lose"; }
function win() { score.wins++; score.outcome = "win"; }

function gameLogic(res, player) {
    serverResponse = moves[randomIntInc(0,4)];
    if (serverResponse === player) {
        score.ties++;
        score.outcome = "tie";
    } else { 
        switch(player) {
            case "rock":
                switch (serverResponse) {
                    case "paper" : case "spock" : lose(); break;
                    case "scissors" : case "lizard" : win(); break;
                }
            break;
            case "paper":
                switch (serverResponse) {
                    case "scissors" : case "lizard" : lose(); break;
                    case "rock" : case "spock" : win(); break;
                }
            break;
            case "scissors":
                switch (serverResponse) {
                    case "rock" : case "spock" : lose(); break;
                    case "paper" : case "lizard" : win(); break;
                }
            break;
            case "spock":
                switch (serverResponse) {
                    case "paper" : case "lizard" : lose(); break;
                    case "rock" : case "scissors" : win(); break;
                }
            break;
            case "lizard":
                switch (serverResponse) {
                    case "rock" : case "scissors" : lose(); break;
                    case "paper" : case "spock" : win(); break;
                }
            break;
        }
    }

    output(res, serverResponse);
}

function main(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});

    if (req.method === "POST" && req.url === "/play/rock") {
        player = "rock";
        gameLogic(res, player);
    } else if (req.method === "POST" && req.url === "/play/paper") {
        player = "paper";
        gameLogic(res, player);
    } else if (req.method === "POST" && req.url === "/play/scissors") {
        player = "scissors";
        gameLogic(res, player);
    } else if (req.method === "POST" && req.url === "/play/spock") {
        player = "spock";
        gameLogic(res, player);
    } else if (req.method === "POST" && req.url === "/play/lizard") {
        player = "lizard";
        gameLogic(res, player);
    } else {
        playPage(res);
    }
}

server = http.createServer(main);

server.listen(3000);

console.log("Server running on port 3000");