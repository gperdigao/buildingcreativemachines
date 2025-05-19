// Global Variables
let ball;
let leftPaddle;
let rightPaddle;
let leftScore = 0;
let rightScore = 0;
let gameState = "menu";
let lastHitTime = 0;
let originalWidth = 480;
let originalHeight = 360;
let bgImage;

const HIT_COOLDOWN = 500;
const BALL_SPEED_INCREMENT = 0.1;
const MAX_BALL_SPEED = 7;
const MIN_CURVE_ANGLE = -15;
const MAX_CURVE_ANGLE = 15;

function preload() {
    bgImage = loadImage('pong_background.png');
}

function setup() {
    createCanvas(originalWidth, originalHeight);

    // Initialize ball and paddles
    initializeBall();
    initializePaddles();

    if (localStorage.getItem('leftScore')) {
        leftScore = parseInt(localStorage.getItem('leftScore'));
    }
    if (localStorage.getItem('rightScore')) {
        rightScore = parseInt(localStorage.getItem('rightScore'));
    }
}

function draw() {
    if (gameState === "menu") {
        displayInitialScreen();
    } else if (gameState === "play") {
        displayGameArena();
    }
}


function displayGameArena() {
    background(220);
    image(bgImage, 0, 0, width, height);

    // Ball and paddle movement logic
    moveBall();
    movePaddles();
    checkCollisions();

    // Drawing ball and paddles
    ellipse(ball.x, ball.y, ball.size);
    rect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    rect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    textSize(32);
    textAlign(CENTER, CENTER);
    text(leftScore, width / 4, 50);
    text(rightScore, 3 * width / 4, 50);
}

function displayInitialScreen() {
    background(0);

    textSize(20);
    // Comment out the next line if the font isn't available
    // textFont('Press Start 2P'); 
    textAlign(CENTER, CENTER);
    fill(255);
    text('Pixel Pong', width / 2, height / 6);

    // Game title and description
    // ...

    let playButton = createButton('< < < Play Now > > >');
    applyButtonStyles(playButton);
    playButton.position(width / 2 - 100, 3 * height / 4);
    playButton.mousePressed(startGame);

    let resetButton = createButton('Reset Scoreboard');
    applyButtonStyles(resetButton);
    resetButton.position(width / 2 - 100, 3 * height / 4 + 50);
    resetButton.mousePressed(resetScores);
}

function applyButtonStyles(button) {
    button.style('background-color', '#FFFFFF');
    button.style('color', '#000000');
    button.style('border', 'none');
    button.style('padding', '10px 40px');
    button.style('cursor', 'pointer');
    button.style('font-size', '18px');
    button.style('font-family', 'Press Start 2P');
}

function initializePaddles() {
    leftPaddle = {
        x: 10,
        y: height / 2 - 20,
        width: 10,
        height: 40,
        speed: 4
    };

    rightPaddle = {
        x: width - 20,
        y: height / 2 - 20,
        width: 10,
        height: 40,
        speed: 4
    };
}

function moveBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
}

function movePaddles() {
    if (keyIsDown(UP_ARROW)) {
        leftPaddle.y -= leftPaddle.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        leftPaddle.y += leftPaddle.speed;
    }
    // Add movement for rightPaddle if needed
}

function startGame() {
    removeElements(); // Remove buttons from initial screen
    gameState = "play";
    initializeBall();

    leftPaddle = {
        x: 10,
        y: height / 2 - 20,
        width: 10,
        height: 40,
        speed: 4
    };

    rightPaddle = {
        x: width - 20,
        y: height / 2 - 20,
        width: 10,
        height: 40,
        speed: 4
    };
}

function initializeBall() {
    ball = {
        x: width / 2,
        y: height / 2,
        size: 10,
        speedX: random([3, -3]),
        speedY: random([2, -2])
    };
}

function resetScores() {
    leftScore = 0;
    rightScore = 0;
    localStorage.removeItem('leftScore');
    localStorage.removeItem('rightScore');
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Call the display function again to reposition the elements
    if (gameState === "menu") {
        displayInitialScreen();
    }
}


function keyPressed() {
    if (keyCode === UP_ARROW) {
        rightPaddle.y -= rightPaddle.speed;
    } else if (keyCode === DOWN_ARROW) {
        rightPaddle.y += rightPaddle.speed;
    }

    let keyLower = key.toLowerCase();
    if (keyLower === 'w') {
        leftPaddle.y -= leftPaddle.speed;
    } else if (keyLower === 's') {
        leftPaddle.y += leftPaddle.speed;
    }
}


function displayMenu() {
    background(220);

    // Game description
    createElement('h2', 'Pixel Pong');
    createElement('p', 'A retro-style game where you test your reflexes against a friend or a bot!');

    // Game rules and commands
    createElement('h3', 'Rules:');
    createElement('p', "Make sure the ball doesn't pass your paddle. Every miss scores a point for the opponent!");
    createElement('h3', 'Commands:');
    createElement('p', "Player 1: 'W' for up and 'S' for down. Player 2: Arrow keys.");

    // Options
    let radio = createRadio();
    radio.option('Play against a friend');
    radio.option('Play against a bot');
    radio.position(10, 250);
    radio.style('width', '300px');

    let button = createButton('Play');
    button.position(320, 250);
    button.mousePressed(() => {
        let val = radio.value();
        if (val === 'Play against a friend') {
            playMode = 'friend';
        } else if (val === 'Play against a bot') {
            playMode = 'bot';
        }
        startGame();
    });
}

