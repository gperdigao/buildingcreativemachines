let currentLevel = 1;
let gameLost = false;

let availableBalls = 200;
let totalBalls = 200;
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

function isMobileDevice() {
    return windowWidth <= 800;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    initializeLevel(currentLevel);

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


}

function areLemmingsStill() {
    for (let lemming of lemmings) {
        if (lemming.speed > 0.3) { 
            return false; // A lemming is still moving
        }
    }
    return true; // No lemmings are moving
}


function draw() {
  background(220);

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
  textSize(32);
  text('You won level ' + level + ', press any key to level up', width / 2 - 200, height / 2);
  noLoop(); // Stop the draw loop.
} 

	if (gameLost) {
    textSize(32);
    text('Game over, press any key to restart', width / 2 - 250, height / 2);
    noLoop();
}

    Engine.update(engine);
	
// Top bar display
//fill(235, 235, 235);  // Light gray background
//rect(0, 0, windowWidth, 50);  // Top bar area

fill(0);  // Black text color
textSize(20);  // Increase the text size for better readability

// Adjusting the y-coordinate to 35 centers the text vertically within the rectangle.
text("Level: " + currentLevel, 10, 35);
text("Target Balls: " + ballsToPut, 250, 35);
text("Balls Left: " + availableBalls, 650, 35);
text("Balls In: " + score, 850, 35);
text("Blocks Left: " + blocksAvailable, 1150, 35);


  


if (frameCount % 30 == 0 && availableBalls > 0) {
   let lemming = Bodies.circle(startPoint.x, startPoint.y, 7.5, {
     friction: 0.001 
   });
   World.add(world, lemming);
   lemmings.push(lemming);
   availableBalls--;
}

    let lemmingSize;
    if (isMobileDevice()) {
        lemmingSize = width * 0.03;   // 3% of screen width for mobile
    } else {
        lemmingSize = 15;             // fixed size for desktop
    }

    // Display lemmings with adjusted size
    fill(0, 255, 0);
    for (let i = lemmings.length - 1; i >= 0; i--) {
        let lemming = lemmings[i];
        ellipse(lemming.position.x, lemming.position.y, lemmingSize);
    }
	
if (score < 100) {
  timeToReach100 = (millis() - startTime) / 1000; // Keep updating until 100 balls
}
	
  // Display entry point
  fill(100, 100, 255);
  ellipse(startPoint.x, startPoint.y, 40, 40);

  // Display tunnel (goal)
  fill(255, 50, 50);
  rectMode(CENTER);
  rect(goalBody.position.x, goalBody.position.y, goalWidth, goalHeight - goalLipThickness);
  
  // Display the lips of the cup
  fill(50, 50, 250);
  rect(goalLipLeft.position.x, goalLipLeft.position.y, goalLipThickness, goalHeight - goalLipThickness);
  rect(goalLipRight.position.x, goalLipRight.position.y, goalLipThickness, goalHeight - goalLipThickness);

  // Display blocks
  fill(50, 50, 250);
  for (let block of blocks) {
    rect(block.position.x, block.position.y, 40, 10);
  }

}
	
function mousePressed() {
    placeBlock();
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
    startPoint.x = random(20, width - 20);
    
    // Move the cup to a new position
    let goalPosX = random(20 + goalWidth / 2, width - 20 - goalWidth / 2);
    Matter.Body.setPosition(goalBody, { x: goalPosX, y: goalBody.position.y });
    Matter.Body.setPosition(goalLipLeft, { x: goalPosX - goalWidth/2, y: goalLipLeft.position.y });
    Matter.Body.setPosition(goalLipRight, { x: goalPosX + goalWidth/2, y: goalLipRight.position.y });

    loop();  // Restart the draw loop.
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    if (gameWon) {
        levelUp();
    } else {
        placeBlock();
    }
}

function restartGame() {
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
