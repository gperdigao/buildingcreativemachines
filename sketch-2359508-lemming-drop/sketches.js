// Importação das classes do Matter.js
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events;

// Variáveis do jogo
let currentLevel = 1;
let gameLost = false;
let gameWon = false;

let availableBalls = 200;
let totalBalls = 200;
let ballsToPut;
let blocksAvailable = 100;

let engine;
let world;
let lemmings = [];
let blocks = [];
let goalBody;
let startPoint;
let score = 0;
let level = 1;

let topWall, bottomWall, leftWall, rightWall;

// Variáveis de estilo
let bgColor;
let lemmingColor;
let blockColor;
let goalColor;
let dashboardColor;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Paleta de cores
    bgColor = color(20, 20, 40);         // Fundo escuro
    lemmingColor = color(255, 85, 85);   // Lemmings vermelhos brilhantes
    blockColor = color(85, 255, 85);     // Blocos verdes brilhantes
    goalColor = color(85, 85, 255);      // Objetivo azul brilhante
    dashboardColor = color(255, 255, 255, 50); // Fundo semi-transparente para o dashboard

    textFont('monospace'); // Usa fonte monospace padrão

    initializeLevel(currentLevel);

    engine = Engine.create();
    world = engine.world;

    // Criar paredes
    createWalls();

    startTime = millis();

    // Criar objetivo e obter goalPosX
    let goalPosX = createGoal();

    // Gerar startPoint.x não alinhado com goalPosX
    startPoint = { x: generateNonAlignedX(goalPosX), y: 150 };

    // Eventos de colisão
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
    let goalRadius = 50; // Raio para o objetivo em forma de funil
    let goalPosX = random(60, width - 60);

    // Criar um objetivo em forma de funil usando vértices personalizados
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
    
    return goalPosX;
}

function generateNonAlignedX(goalX, minDistance = 100) {
    let newX;
    do {
        newX = random(60, width - 60);
    } while (abs(newX - goalX) < minDistance);
    return newX;
}

function handleCollisions(event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
        let bodyA = pairs[i].bodyA;
        let bodyB = pairs[i].bodyB;

        // Verifica se um lemming colide com a parede inferior (errou o objetivo)
        if ((bodyA === bottomWall && bodyB.label === 'lemming') ||
            (bodyB === bottomWall && bodyA.label === 'lemming')) {
            // Remove o lemming do mundo e do array de lemmings
            let lemmingBody = bodyA.label === 'lemming' ? bodyA : bodyB;
            removeLemming(lemmingBody);
        }

        // Verifica se um lemming entra no objetivo
        if ((bodyA.label === 'goal' && bodyB.label === 'lemming') ||
            (bodyB.label === 'goal' && bodyA.label === 'lemming')) {
            score++;
            // Remove lemming do mundo e do array de lemmings
            let lemmingBody = bodyA.label === 'lemming' ? bodyA : bodyB;
            removeLemming(lemmingBody);
        }
    }
}

function removeLemming(lemmingBody) {
    World.remove(world, lemmingBody);
    // Remove do array de lemmings
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

    // Condições de término do jogo
    if (availableBalls === 0 && areLemmingsStill() && !gameWon && !gameLost) {
        gameLost = true;
        noLoop();
    }

    if (ballsToPut == score && !gameWon && !gameLost) {
        gameWon = true;
        noLoop();
    }

    // Exibir mensagens de fim de jogo
    if (gameWon) {
        displayMessage('LEVEL COMPLETE!\nPress any key to continue');
        return;
    }

    if (gameLost) {
        displayMessage('GAME OVER\nPress any key to restart');
        return;
    }

    // Exibir dashboard
    displayDashboard();

    // Spawn de lemmings
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

    // Renderizar lemmings
    renderLemmings();

    // Exibir ponto de entrada
    fill(255, 200, 0);
    noStroke();
    ellipse(startPoint.x, startPoint.y, 30, 30);

    // Exibir objetivo
    renderGoal();

    // Exibir blocos
    renderBlocks();
}

function displayMessage(msg) {
    textSize(20);
    fill(255);
    textAlign(CENTER, CENTER);
    text(msg, width / 2, height / 2);
}

function displayDashboard() {
    // Fundo do dashboard
    fill(dashboardColor);
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width, 50);

    // Texto do dashboard
    fill(255);
    textSize(isMobileDevice() ? 12 : 14); // Reduzir tamanho da fonte para mobile
    textAlign(LEFT, CENTER);
    let dashboardText;

    if (isMobileDevice()) {
        // Texto abreviado para mobile
        dashboardText = `LV:${currentLevel} G:${ballsToPut} S:${score} B:${max(0, availableBalls)} BK:${blocksAvailable}`;
    } else {
        // Texto completo para desktop
        dashboardText = `LEVEL: ${currentLevel}    GOAL: ${ballsToPut}    SCORED: ${score}    BALLS LEFT: ${max(0, availableBalls)}    BLOCKS: ${blocksAvailable}`;
    }

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
        rect(0, 0, 60, 10); // Aumenta a largura dos blocos para melhor jogabilidade
        pop();
    }
}

function placeBlock() {
    if (blocksAvailable > 0) {
        let block = Bodies.rectangle(mouseX, mouseY, 60, 10, { // Aumenta a largura dos blocos
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
    return false; // Prevenir comportamento padrão
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

    // Remover lemmings do mundo
    for (let lemming of lemmings) {
        World.remove(world, lemming);
    }
    lemmings = [];

    // Remover blocos do mundo
    for (let block of blocks) {
        World.remove(world, block);
    }
    blocks = [];

    // Remover objetivo anterior
    World.remove(world, goalBody);
    
    // Criar novo objetivo e obter goalPosX
    let goalPosX = createGoal();

    // Gerar startPoint.x não alinhado com goalPosX
    startPoint.x = generateNonAlignedX(goalPosX);

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

    // Remover lemmings do mundo
    for (let lemming of lemmings) {
        World.remove(world, lemming);
    }
    lemmings = [];

    // Remover blocos do mundo
    for (let block of blocks) {
        World.remove(world, block);
    }
    blocks = [];

    // Remover objetivo anterior
    World.remove(world, goalBody);
    
    // Criar novo objetivo e obter goalPosX
    let goalPosX = createGoal();

    // Gerar startPoint.x não alinhado com goalPosX
    startPoint.x = generateNonAlignedX(goalPosX);

    loop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Recriar paredes e ajustar posições
    World.remove(world, [topWall, bottomWall, leftWall, rightWall]);
    createWalls();
}

// Função de detecção de dispositivo
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}
