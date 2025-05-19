// Variables
let currentLevel = 1;
let gameLost = false;
let gameWon = false;

let availableBalls = 200;
let totalBalls = 200;
let ballsToPut;
let blocksAvailable = 100;

let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events;

let engine;
let world;
let lemmings = [];
let blocks = [];
let goalBody, goalLipLeft, goalLipRight;
let startPoint;
let score = 0;
let level = 1;

let goalWidth, goalHeight, goalLipThickness;
let topWall, bottomWall, leftWall, rightWall;

function isMobileDevice() {
    return windowWidth <= 800;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    initializeLevel(currentLevel);

    // Adjust goal dimensions based on device
    if (isMobileDevice()) {
        goalWidth = width * 0.08;
        goalHeight = height * 0.15;
        goalLipThickness = goalWidth * 0.3;
    } else {
        goalWidth = width * 0.05;
        goalHeight = height * 0.1;
        goalLipThickness = goalWidth * 0.25;
    }

    engine = Engine.create();
    world = engine.world;

    // Create walls
    topWall = Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true });
    bottomWall = Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true });
    leftWall = Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true });
    rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true });
    World.add(world, [topWall, bottomWall, leftWall, rightWall]);

    startTime = millis();
    startPoint = { x: random(20, width - 20), y: 120 };

    // Create goal
    let goalPosX = random(20 + goalWidth / 2, width - 20 - goalWidth / 2);

    goalBody = Bodies.rectangle(goalPosX, height - 10, goalWidth, goalHeight - goalLipThickness, {
        isStatic: true,
        label: 'goal'
    });

    goalLipLeft = Bodies.rectangle(goalPosX - goalWidth / 2, height - 10 - (goalHeight - goalLipThickness) / 2, goalLipThickness, goalHeight - goalLipThickness, {
        isStatic: true,
        label: 'block'
    });

    goalLipRight = Bodies.rectangle(goalPosX + goalWidth / 2, height - 10 - (goalHeight - goalLipThickness) / 2, goalLipThickness, goalHeight - goalLipThickness, {
        isStatic: true,
        label: 'block'
    });

    World.add(world, [goalBody, goalLipLeft, goalLipRight]);

    // Collision event handling
    Events.on(engine, 'collisionStart', function(event) {
        let pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
            let bodyA = pairs[i].bodyA;
            let bodyB = pairs[i].bodyB;

            // Check if lemming hits the bottom wall (missed goal)
            if ((bodyA === bottomWall && bodyB.label === 'lemming') ||
                (bodyB === bottomWall && bodyA.label === 'lemming')) {
                // Remove the lemming from the world and from the lemmings array
                let lemmingBody = bodyA.label === 'lemming' ? bodyA : bodyB;
                removeLemming(lemmingBody);
            }

            // Check if lemming enters the goal
            if ((bodyA.label === 'goal' && bodyB.label === 'lemming') ||
                (bodyB.label === 'goal' && bodyA.label === 'lemming')) {
                score++;
                // Remove lemming from world and lemmings array
                let lemmingBody = bodyA.label === 'lemming' ? bodyA : bodyB;
                removeLemming(lemmingBody);
            }
        }
    });
}

function removeLemming(lemmingBody) {
    World.remove(world, lemmingBody);
    // Remove from lemmings array
    for (let i = 0; i < lemmings.length; i++) {
        if (lemmings[i] === lemmingBody) {
            lemmings.splice(i, 1);
            break;
        }
    }
}

function areLemmingsStill() {
    for (let lemming of lemmings) {
        if (lemming.speed > 0.5) { // Adjusted speed threshold
            return false; // A lemming is still moving
        }
    }
    return true; // No lemmings are moving
}

function draw() {
    background(0);

    Engine.update(engine);

    // Game over conditions
    if (availableBalls === 0 && areLemmingsStill() && !gameWon && !gameLost) {
        gameLost = true;
        noLoop();
    }

    if (ballsToPut == score && !gameWon && !gameLost) {
        gameWon = true;
        noLoop();
    }

    // Display game over messages
    if (gameWon) {
        textSize(32);
        fill(255);
        textAlign(CENTER, CENTER);
        text('You won level ' + level + ', press any key to level up', width / 2, height / 2);
        noLoop();
        return;
    }

    if (gameLost) {
        textSize(32);
        fill(255);
        textAlign(CENTER, CENTER);
        text('Game over, press any key to restart', width / 2, height / 2);
        noLoop();
        return;
    }

    // Display game information
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Current level: " + currentLevel, 10, 10);
    text("Goal: Get " + ballsToPut + " ball(s)", 10, 35);
    text("Remaining balls: " + max(0, availableBalls), 10, 60);
    text("Balls scored: " + score, 10, 85);
    text("Blocks still available: " + blocksAvailable, 10, 110);

    // Spawn lemmings
    if (frameCount % 30 == 0 && availableBalls > 0) {
        let lemming = Bodies.circle(startPoint.x, startPoint.y, 7.5, {
            friction: 0.001,
            restitution: 0.5,
            label: 'lemming'
        });
        World.add(world, lemming);
        lemmings.push(lemming);
        availableBalls--;
    }

    // Render lemmings
    let lemmingSize = isMobileDevice() ? width * 0.03 : 15;
    fill(0, 255, 255);
    noStroke();
    for (let lemming of lemmings) {
        ellipse(lemming.position.x, lemming.position.y, lemmingSize);
    }

    // Display entry point
    fill(255, 255, 0);
    ellipse(startPoint.x, startPoint.y, 40, 40);

    // Display goal
    rectMode(CENTER);
    fill(0, 255, 255);
    rect(goalBody.position.x, goalBody.position.y, goalWidth, goalHeight - goalLipThickness);

    // Display goal lips
    fill(255, 255, 0);
    rect(goalLipLeft.position.x, goalLipLeft.position.y, goalLipThickness, goalHeight - goalLipThickness);
    rect(goalLipRight.position.x, goalLipRight.position.y, goalLipThickness, goalHeight - goalLipThickness);

    // Display blocks
    fill(255, 255, 0);
    for (let block of blocks) {
        push();
        translate(block.position.x, block.position.y);
        rotate(block.angle);
        rect(0, 0, 40, 10);
        pop();
    }
}

function placeBlock() {
    if (blocksAvailable > 0) {
        let block = Bodies.rectangle(mouseX, mouseY, 40, 10, {
            isStatic: true,
            angle: 0,
            label: 'block'
        });
        World.add(world, block);
        blocks.push(block);
        blocksAvailable--;
    }
}

function mousePressed() {
    if (gameWon) {
        levelUp();
    } else if (gameLost) {
        restartGame();
    } else {
        placeBlock();
    }
}

function touchStarted() {
    if (gameWon) {
        levelUp();
    } else if (gameLost) {
        restartGame();
    } else {
        placeBlock();
    }
    return false; // Prevent default behavior
}

function keyPressed() {
    if (gameWon) {
        levelUp();
    } else if (gameLost) {
        restartGame();
    }
}

function initializeLevel(level) {
    ballsToPut = level;  // Increase balls required with each level
    blocksAvailable = max(100 - level + 1, 1);  // Decrease blocks available with each level, minimum 1
}

function levelUp() {
    level++;
    currentLevel = level;
    score = 0;
    availableBalls = 200;
    gameWon = false;

    initializeLevel(level);

    // Remove lemmings from world
    for (let lemming of lemmings) {
        World.remove(world, lemming);
    }
    lemmings = [];

    // Remove blocks from world
    for (let block of blocks) {
        World.remove(world, block);
    }
    blocks = [];

    // Randomize startPoint and goal position
    startPoint.x = random(20, width - 20);

    let goalPosX = random(20 + goalWidth / 2, width - 20 - goalWidth / 2);
    Matter.Body.setPosition(goalBody, { x: goalPosX, y: goalBody.position.y });
    Matter.Body.setPosition(goalLipLeft, { x: goalPosX - goalWidth / 2, y: goalLipLeft.position.y });
    Matter.Body.setPosition(goalLipRight, { x: goalPosX + goalWidth / 2, y: goalLipRight.position.y });

    loop();
}

function restartGame() {
    gameLost = false;
    gameWon = false;
    level = 1;
    currentLevel = level;
    score = 0;
    availableBalls = 200;

    initializeLevel(level);

    // Remove lemmings from world
    for (let lemming of lemmings) {
        World.remove(world, lemming);
    }
    lemmings = [];

    // Remove blocks from world
    for (let block of blocks) {
        World.remove(world, block);
    }
    blocks = [];

    // Randomize startPoint and goal position
    startPoint.x = random(20, width - 20);

    let goalPosX = random(20 + goalWidth / 2, width - 20 - goalWidth / 2);
    Matter.Body.setPosition(goalBody, { x: goalPosX, y: goalBody.position.y });
    Matter.Body.setPosition(goalLipLeft, { x: goalPosX - goalWidth / 2, y: goalLipLeft.position.y });
    Matter.Body.setPosition(goalLipRight, { x: goalPosX + goalWidth / 2, y: goalLipRight.position.y });

    loop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Also, re-create the walls and adjust positions
    World.remove(world, [topWall, bottomWall, leftWall, rightWall]);

    topWall = Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true });
    bottomWall = Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true });
    leftWall = Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true });
    rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true });
    World.add(world, [topWall, bottomWall, leftWall, rightWall]);
}
