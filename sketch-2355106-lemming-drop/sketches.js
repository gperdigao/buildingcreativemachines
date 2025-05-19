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
let goalBody;
let startPoint;
let score = 0;
let level = 1;

let topWall, bottomWall, leftWall, rightWall;

// Style Variables
let bgColor;
let lemmingColor;
let blockColor;
let goalColor;
let dashboardColor;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Color palette
    bgColor = color(20, 20, 40);         // Dark background
    lemmingColor = color(255, 85, 85);   // Bright red lemmings
    blockColor = color(85, 255, 85);     // Bright green blocks
    goalColor = color(85, 85, 255);      // Bright blue goal
    dashboardColor = color(255, 255, 255, 50); // Semi-transparent white for dashboard background

    textFont('monospace'); // Use default monospace font

    initializeLevel(currentLevel);

    engine = Engine.create();
    world = engine.world;

    // Create walls
    createWalls();

    startTime = millis();
    startPoint = { x: random(60, width - 60), y: 150 };

    // Create goal with enhanced visuals
    createGoal();

    // Collision event handling
    Events.on(engine, 'collisionStart', function(event) {
        handleCollisions(event);
    });
}

function createWalls() {
    topWall = Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true });
    bottomWall = Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true });
    leftWall = Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true });
    rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true });
    World.add(world, [topWall, bottomWall, leftWall, rightWall]);
}

function createGoal() {
    let goalRadius = 50; // Radius for the funnel-shaped goal
    let goalPosX = random(60, width - 60);

    // Create a funnel-shaped goal using a custom vertex shape
    let funnelVertices = [
        { x: -goalRadius, y: 0 },
        { x: -goalRadius / 2, y: -100 },
        { x: goalRadius / 2, y: -100 },
        { x: goalRadius, y: 0 }
    ];

    goalBody = Bodies.fromVertices(goalPosX, height - 10, funnelVertices, {
        isStatic: true,
        label: 'goal'
    }, true);

    World.add(world, goalBody);
}

function handleCollisions(event) {
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
        if (lemming.speed > 0.5) {
            return false;
        }
    }
    return true;
}

function draw() {
    background(bgColor);

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
        displayMessage('LEVEL COMPLETE!\nPress any key to continue');
        return;
    }

    if (gameLost) {
        displayMessage('GAME OVER\nPress any key to restart');
        return;
    }

    // Display dashboard
    displayDashboard();

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
    renderLemmings();

    // Display entry point
    fill(255, 200, 0);
    noStroke();
    ellipse(startPoint.x, startPoint.y, 30, 30);

    // Display goal
    renderGoal();

    // Display blocks
    renderBlocks();
}

function displayMessage(msg) {
    textSize(20);
    fill(255);
    textAlign(CENTER, CENTER);
    text(msg, width / 2, height / 2);
}

function displayDashboard() {
    // Dashboard background
    fill(dashboardColor);
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width, 50);

    // Dashboard text
    fill(255);
    textSize(14);
    textAlign(LEFT, CENTER);
    let dashboardText = `LEVEL: ${currentLevel}    GOAL: ${ballsToPut}    SCORED: ${score}    BALLS LEFT: ${max(0, availableBalls)}    BLOCKS: ${blocksAvailable}`;
    text(dashboardText, 10, 25);
}

function renderLemmings() {
    let lemmingSize = isMobileDevice() ? width * 0.03 : 15;
    fill(lemmingColor);
    noStroke();
    for (let lemming of lemmings) {
        ellipse(lemming.position.x, lemming.position.y, lemmingSize);
    }
}

function renderGoal() {
    fill(goalColor);
    noStroke();
    beginShape();
    for (let v of goalBody.vertices) {
        vertex(v.x, v.y);
    }
    endShape(CLOSE);
}

function renderBlocks() {
    fill(blockColor);
    noStroke();
    for (let block of blocks) {
        push();
        translate(block.position.x, block.position.y);
        rotate(block.angle);
        rectMode(CENTER);
        rect(0, 0, 60, 10); // Increased block width for better gameplay
        pop();
    }
}

function placeBlock() {
    if (blocksAvailable > 0) {
        let block = Bodies.rectangle(mouseX, mouseY, 60, 10, { // Increased block width
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
    ballsToPut = level;
    blocksAvailable = max(100 - level + 1, 1);
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
    startPoint.x = random(60, width - 60);

    World.remove(world, goalBody);
    createGoal();

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
    startPoint.x = random(60, width - 60);

    World.remove(world, goalBody);
    createGoal();

    loop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Re-create walls and adjust positions
    World.remove(world, [topWall, bottomWall, leftWall, rightWall]);
    createWalls();
}

// Device detection function
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}
