let currentLevel = 1;
let gameLost = false;
let availableBalls = 200;
let ballsToPut;
let blocksAvailable = 100;
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events;
let gameWon = false;
let engine;
let world;
let lemmings = [];
let blocks = [];
let goalBody, goalLipLeft, goalLipRight;
let startPoint;
let score = 0;
let level = 1;
let retroFont; // Declare a variable for the custom font

let popcornImg; // Declare a variable to hold the popcorn image
let butterImg; // Declare a variable to hold the butter image
let panImg; // Declare a variable to hold the pan image
let cupImg; // Declare a variable to hold the cup image
let bgImg; // Declare a variable for the background image

function preload() {
    popcornImg = loadImage('popcorn.png'); // Load the popcorn image
	    butterImg = loadImage('butter.png'); // Load the butter image
	  panImg = loadImage('pan.png'); // Load the pan image
	 cupImg = loadImage('cup2.png'); // Load the cup image
	 bgImg = loadImage('back7.png'); // Adjust the path as necessary
	retroFont = loadFont('font.ttf'); // Load the custom font
}

function isMobileDevice() {
    return windowWidth <= 800;
}

function setup() {
  let canvas = createCanvas(1400, 800);
    initializeLevel(currentLevel);
  textFont(retroFont); // Set the font for text
	
    if (isMobileDevice) {
        goalWidth = width * 0.08;
        goalHeight = height * 0.15;
        goalLipThickness = goalWidth * 0.3;
    }
    else {
        goalWidth = width * 0.05;
        goalHeight = height * 0.1;
        goalLipThickness = goalWidth * 0.25;
    }

    engine = Engine.create();
    world = engine.world;

  let topWall = Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true });
  let bottomWall = Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true });
  let leftWall = Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true });
  let rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true });
  World.add(world, [topWall, bottomWall, leftWall, rightWall]);

  startTime = millis();
startPoint = { x: random(20, width - 20), y: 120 };  // Moves it down below the top bar

  goalPosX = random(20 + goalWidth / 2, width - 20 - goalWidth / 2);

  // The main "cup" body
  goalBody = Bodies.rectangle(goalPosX, height - 10, goalWidth, goalHeight - goalLipThickness, { 
    isStatic: true,
    label: 'goal'
  });

  // Left lip of the cup
  goalLipLeft = Bodies.rectangle(goalPosX - goalWidth/2, height - 10 - (goalHeight - goalLipThickness) / 2, goalLipThickness, goalHeight - goalLipThickness, { 
    isStatic: true,
    label: 'block'
  });

  // Right lip of the cup
  goalLipRight = Bodies.rectangle(goalPosX + goalWidth/2, height - 10 - (goalHeight - goalLipThickness) / 2, goalLipThickness, goalHeight - goalLipThickness, { 
    isStatic: true,
    label: 'block'
  });

  World.add(world, [goalBody, goalLipLeft, goalLipRight]);

Events.on(engine, 'collisionStart', (function(event) {
  let pairs = event.pairs;
  for (let i = 0; i < pairs.length; i++) {
    if ((pairs[i].bodyA === bottomWall && pairs[i].bodyB.label !== 'block') || 
        (pairs[i].bodyB === bottomWall && pairs[i].bodyA.label !== 'block')) {
      availableBalls--
    }
    if (pairs[i].bodyA.label === 'goal' && pairs[i].bodyB.label !== 'block') {
      score++;
      World.remove(world, pairs[i].bodyB);
    } else if (pairs[i].bodyB.label === 'goal' && pairs[i].bodyA.label !== 'block') {
      score++;
      World.remove(world, pairs[i].bodyA);
    }
  }
}).bind(this));
  imageMode(CORNER);

}

function areLemmingsStill() {
    for (let lemming of lemmings) {
        if (lemming.speed > 0.5) { 
            return false; // A lemming is still moving
        }
    }
    return true; // No lemmings are moving
}


function draw() {
  clear();
	displayBackground();
  handleGameStates();
  updatePhysics();
  displayTopBar();
  generateLemmings();
  displayLemmings();
  displayStartPoint();
  displayGoal();
  displayBlocks();
}

function displayBackground() {
  image(bgImg, 700, 400, 1400, 800); // Draw the full background image
}

function handleGameStates() {
  if (availableBalls === 0 && areLemmingsStill()) {
    gameWon = false;
    gameLost = true;
    noLoop();
  }
  
  if (ballsToPut == score) {
    gameWon = true;
    noLoop(); // Stop the draw loop
  }
  
  if (gameWon) {
    displayWinMessage();
  } else if (gameLost) {
    displayLoseMessage();
  }
}

function updatePhysics() {
  Engine.update(engine);
}

function displayTopBar() {
  fill(255, 255, 0); // Set text color to neon yellow for an 80s vibe
  textSize(30); // Set text size for better readability
  

  // Display game information with a shadow for a neon effect
  textShadow();
  text("Level: " + currentLevel, 10, 35);
  text("Target Popcorns: " + ballsToPut, 10, 70);
  text("Popcorns Left: " + availableBalls, 10, 105);
  text("Popcorns In: " + score, 10, 140);
  text("Butter Blocks Left: " + blocksAvailable, 10, 175);
}

function textShadow() {
  fill(0);
  for (let i = 0; i < 5; i++) {
    text("Level: " + currentLevel, 10 - i, 35 - i);
    text("Target Popcorns: " + ballsToPut, 10 - i, 70 - i);
    text("Popcorns Left: " + availableBalls, 10 - i, 105 - i);
    text("Popcorns In: " + score, 10 - i, 140 - i);
    text("Butter Blocks Left: " + blocksAvailable, 10 - i, 175 - i);
  }
  // Reset fill color for the main text
  fill(255, 255, 0);
}

function generateLemmings() {
  if (frameCount % 30 == 0 && availableBalls > 0) {
    let lemming = Bodies.circle(startPoint.x, startPoint.y, 7.5, { friction: 0.001 });
    World.add(world, lemming);
    lemmings.push(lemming);
    availableBalls--;
  }
}

function displayLemmings() {
  let lemmingSize = isMobileDevice() ? width * 0.03 : 15;
  for (let lemming of lemmings) {
    image(popcornImg, lemming.position.x - lemmingSize / 2, lemming.position.y - lemmingSize / 2, lemmingSize, lemmingSize); 
  }
}

function displayStartPoint() {
  image(panImg, startPoint.x - 20, startPoint.y - 20, 120, 120);
}

function displayGoal() {
  imageMode(CENTER);
  image(cupImg, goalBody.position.x, goalBody.position.y, goalWidth, goalHeight);
}

function displayBlocks() {
  for (let block of blocks) {
    image(butterImg, block.position.x - 20, block.position.y - 5, 40, 10);
  }
}

function displayWinMessage() {
  textSize(32);
  text('You won level ' + level + ', press any key to level up', width / 2 - 200, height / 2);
}

function displayLoseMessage() {
  textSize(32);
  text('Game over, press any key to restart', width / 2 - 250, height / 2);
}

	
function mousePressed() {
    if (gameWon) {
        levelUp();
    } else if (!gameLost) { // Added condition to avoid placing blocks when the game is lost
        placeBlock();
    }
}

function touchStarted() {
  placeBlock();
  return false; // To prevent any default action for this touch event
}

function placeBlock() {
    if (blocksAvailable > 0) {
        let block = Bodies.rectangle(mouseX, mouseY, 40, 10, { isStatic: true });
        World.add(world, block);
        blocks.push(block);
        blocksAvailable--;
    }
}

function initializeLevel(level) {
    clear();
		ballsToPut = level;  // +1 ball for each level
    blocksAvailable = 101 - level;  // Blocks decrease by 1 each level
}


function levelUp() {
    level++;  // Increase the level by 1
    currentLevel = level; // Update the current level. This is used in displaying the level text.

    score = 0;
    availableBalls = 200;
    gameWon = false;

    // Update ballsToPut and blocksAvailable based on the new level
    initializeLevel(level);
    
    // Remove all the lemmings from the world and empty the lemmings array
    for (let lemming of lemmings) {
        World.remove(world, lemming);
    }
    lemmings = [];
    
    // Remove all blocks from the world and empty the blocks array
    for (let block of blocks) {
        World.remove(world, block);
    }
    blocks = [];
    
    // Move the door that releases the balls to a new position
   startPoint = { x: random(20, 1400 - 20), y: 120 }; // Adjusted for new canvas size
    
    // Move the cup to a new position
    let goalPosX = random(20 + goalWidth / 2, width - 20 - goalWidth / 2);
    Matter.Body.setPosition(goalBody, { x: goalPosX, y: goalBody.position.y });
    Matter.Body.setPosition(goalLipLeft, { x: goalPosX - goalWidth/2, y: goalLipLeft.position.y });
    Matter.Body.setPosition(goalLipRight, { x: goalPosX + goalWidth/2, y: goalLipRight.position.y });

    loop();  // Restart the draw loop.
}



function windowResized() {
    resizeCanvas(1400, 800);
}

function restartGame() {
    clear();
		gameLost = false;
    gameWon = false;
    level = 1;
    score = 0;
    availableBalls = 200;
    blocksAvailable = 100;
    initializeLevel(level);

    for (let lemming of lemmings) {
        World.remove(world, lemming);
    }
    lemmings = [];

    for (let block of blocks) {
        World.remove(world, block);
    }
    blocks = [];

    startPoint.x = random(20, width - 20);
    let goalPosX = random(20 + goalWidth / 2, width - 20 - goalWidth / 2);
    Matter.Body.setPosition(goalBody, { x: goalPosX, y: goalBody.position.y });
    Matter.Body.setPosition(goalLipLeft, { x: goalPosX - goalWidth/2, y: goalLipLeft.position.y });
    Matter.Body.setPosition(goalLipRight, { x: goalPosX + goalWidth/2, y: goalLipRight.position.y });

    loop();
}

function keyPressed() {
    if (gameWon) {
        levelUp();
    }
    if (gameLost) {
        restartGame();
    }
}
