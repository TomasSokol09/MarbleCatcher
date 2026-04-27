const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let playerX = 150;
let playerY = 140;
let count = 0;
let yellowMarbleActive = true;
let missed = 0;
let running = true;
let yellowInterval = null;
let animationId = null;
let streaking = 0;
const gameOverSound = new Audio("gameOver.mp3");
const boomSound = new Audio("boomSound.mp3");
const streakSound = new Audio("streakSound.mp3");
const yoshiSound = new Audio("yoshiSound.mp3");
const catchSound = new Audio("catchSound.mp3");

ctx.fillStyle = 'beige';
ctx.fillRect(150, 120, 10, 4); //hlava//
ctx.fillStyle = 'beige';
ctx.fillRect(145, 128, 20, 4); //ruce//
ctx.fillStyle = 'red';
ctx.fillRect(150, 124, 10, 10); //telo//
ctx.fillStyle = 'red';
ctx.fillRect(145, 124, 20, 4); //rukavy//
ctx.fillStyle = 'gray';
ctx.fillRect(150, 134, 10, 6); //kalhoty//
ctx.fillStyle = 'brown';
ctx.fillRect(150, 120, 10, 1); //vlasy//
ctx.fillStyle = 'green'
ctx.fillRect(0, 140, 300, 10); //zem//

function createPlayer(playerX, playerY) {
//smazani predchozi pozice postavy//
    ctx.clearRect(0, 0, canvas.width, canvas.height);
//Tvorba postavy//
    ctx.fillStyle = 'beige';
    ctx.fillRect(playerX, playerY - 20, 10, 4); //hlava//
    ctx.fillStyle = 'beige';
    ctx.fillRect(playerX - 5, playerY - 12, 20, 4); //ruce//
    ctx.fillStyle = 'red';
    ctx.fillRect(playerX, playerY - 16, 10, 10); //telo//
    ctx.fillStyle = 'red';
    ctx.fillRect(playerX - 5, playerY - 16, 20, 4); //rukavy//
    ctx.fillStyle = 'gray';
    ctx.fillRect(playerX, playerY - 6, 10, 6); //kalhoty//
    ctx.fillStyle = 'brown';
    ctx.fillRect(playerX, playerY - 20, 10, 1); //vlasy//
}

function createGround () {
    ctx.fillStyle = 'green'
    ctx.fillRect(0, 140, 300, 10); //zem//
}

let redMarble = {
    x: Math.floor(Math.random() * (canvas.width - 10)),
    y: 3
}

let bomb = {
    x: Math.floor(Math.random() * (canvas.width - 10)),
    y: 3
}

let yellowMarble = {
    x: Math.floor(Math.random() * (canvas.width - 10)),
    y: -10000
}

function drawRedMarble() {
    ctx.fillStyle = "red";
    ctx.fillRect(redMarble.x, redMarble.y, 6, 3);
}

function drawBomb() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(bomb.x, bomb.y, 6, 3);
}

function drawYellowMarble() {
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(yellowMarble.x, yellowMarble.y, 6, 3);
}

let keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
    });
document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
    });

function update() {
    if (!running) return;

    if (keys["a"] || keys["ArrowLeft"]){
        playerX -= 3;
    }
    if (keys["d"] || keys["ArrowRight"]){
        playerX += 3;
    }

    playerX = Math.max(5, Math.min(canvas.width - 15, playerX));

    redMarble.y++;
    bomb.y += 0.5;
    if (yellowMarbleActive) yellowMarble.y += 1.2;

    newRedMarble();
    redMarbleCounter();
    newBomb();
    newYellowMarble();
    yellowMarbleCounter();
    createPlayer(playerX, playerY);
    drawRedMarble();
    drawBomb();
    if (yellowMarbleActive) drawYellowMarble();
    createGround();
    hearts();
    flames();
    console.log(streaking);
    boom();
    gameOver();

    animationId = requestAnimationFrame(update);
}

function redMarbleCaught() {
    return (
        Math.abs(redMarble.x - playerX) <= 15 &&
        redMarble.y >= 125 &&
        redMarble.y <= 140
    );
}

function redMarbleCounter () {
    if (redMarbleCaught()){
        catchSound.play();
        count++;
        streaking++;
        streak();
        streakSE();
        redMarble.x = Math.floor(Math.random() * (canvas.width - 10));
        redMarble.y = 3;
    }
    document.getElementById("counter").textContent = "Marbles caught: " + count;
    document.getElementById("streak").textContent = streaking;
}

function newRedMarble () {
    if (redMarble.y > 143) {
        redMarble.x = Math.floor(Math.random() * (canvas.width - 10));
        redMarble.y = 3;
        missed++;
        streaking = 0;
        if (missed >= 3){
            gameOver();
        }
    }
}

newRedMarble();

function bombCaught() {
    return (
        Math.abs(bomb.x - playerX) <= 15 &&
        bomb.y >= 125 &&
        bomb.y <= 140
    );
}

function newBomb () {
    if (bomb.y > 143) {
        bomb.x = Math.floor(Math.random() * (canvas.width - 10));
        bomb.y = 3;
    }
}

newBomb();

function yellowMarbleCaught() {
    return (
        yellowMarbleActive &&
        Math.abs(yellowMarble.x - playerX) <= 15 &&
        yellowMarble.y >= 125 &&
        yellowMarble.y <= 140
    );
}

function yellowMarbleCounter () {
    if (yellowMarbleCaught()){
        catchSound.play();
        count += 3;
        streaking++;
        streak();
        streakSE();
        yellowMarbleActive = false;
        yellowMarble.y = -10000;
    }
    document.getElementById("counter").textContent = "Marbles caught: " + count;
    document.getElementById("streak").textContent = streaking;
}

function newYellowMarble() {
    if (yellowMarble.y >= 143){
        yellowMarbleActive = false;
        yellowMarble.y = -10000;
        streaking = 0;
    }
}

function hearts() {
    if (missed === 1){
        document.getElementById("3").style.display = "none";
    }
    if (missed === 2){
        document.getElementById("2").style.display = "none";
    }
    if (missed === 3){
        document.getElementById("1").style.display = "none";
    }
}

function boom() {
    if (bombCaught()){
        catchSound.play();
        running = false;
        yoshiSound.pause();
        yoshiSound.currentTime = 0;
        boomSound.play();
        document.getElementById("startBtn").disabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.fillText("Game over", 100, 50);
        ctx.fillText("Marbles caught: " + count, 80, 70);
        ctx.fillText("You exploded", 100, 90);
    }
}

function streak() {
    if (streaking >= 5) {
        count += 2;
    }
}

function streakSE() {
    if (streaking === 5){
        streakSound.play();
    }
}

function flames() {
    if (streaking >= 5) {
        document.getElementById("flames").style.display = "inline";
    } else {
        document.getElementById("flames").style.display = "none";
    }
}

function startGame() {
    playerX = 150;
    playerY = 140;
    count = 0;
    streaking = 0;
    yellowMarbleActive = false;
    missed = 0;
    redMarble.x = Math.floor(Math.random() * (canvas.width - 10));
    redMarble.y = 3;
    bomb.x = Math.floor(Math.random() * (canvas.width - 10));
    bomb.y = 3;
    yellowMarble.y = -10000;

    document.getElementById("1").style.display = "inline";
    document.getElementById("2").style.display = "inline";
    document.getElementById("3").style.display = "inline";
    document.getElementById("counter").textContent = ("Marbles caught 0")
    document.getElementById("startBtn").disabled = true;

    clearInterval(yellowInterval);
    yellowInterval = setInterval(() => {
        yellowMarble.x = Math.floor(Math.random() * (canvas.width - 10));
        yellowMarble.y = 3;
        yellowMarbleActive = true;
    }, 7000);

    cancelAnimationFrame(animationId);
    running = true;
    yoshiSound.play();
    update();
}

function gameOver() {
    if (missed >= 3){
        running = false;
        yoshiSound.pause();
        yoshiSound.currentTime = 0;
        gameOverSound.play();
        document.getElementById("startBtn").disabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.fillText("Game over", 100, 70);
        ctx.fillText("Marbles caught: " + count, 80, 90);
    }
}