// Variáveis para controlar a boca do rinoceronte
let mouthOpen = false;
let mouthTimer = 0;
const MOUTH_DURATION = 500; // Duração em milissegundos que a boca permanece aberta

// Variáveis para controlar o movimento do rinoceronte
let rhinoX;
let rhinoY;
let rhinoSpeed = 2; // Velocidade de movimento
let direction = 1; // 1 para direita, -1 para esquerda

function setup() {
  createCanvas(800, 400);
  // Inicializar a posição do rinoceronte no centro vertical e um pouco à esquerda horizontalmente
  rhinoX = width / 2 - 100;
  rhinoY = height / 2;
  
  // Definir o modo de desenho no centro para facilitar o posicionamento
  rectMode(CENTER);
  ellipseMode(CENTER);
}

function draw() {
  background(200, 220, 255); // Cor de fundo agradável

  // Atualizar a posição do rinoceronte
  rhinoX += rhinoSpeed * direction;

  // Verificar limites para inverter a direção
  if (rhinoX > width - 100 || rhinoX < 100) {
    direction *= -1;
  }

  // Desenhar o rinoceronte na posição atual
  drawRhino(rhinoX, rhinoY, 200);

  // Verificar se o tempo para fechar a boca passou
  if (mouthOpen) {
    if (millis() - mouthTimer > MOUTH_DURATION) {
      mouthOpen = false;
    }
  }
}

// Função para desenhar o rinoceronte
function drawRhino(x, y, size) {
  push();
  translate(x, y);
  scale(size / 200); // Escalar o desenho baseado no tamanho

  // Corpo
  fill(150, 150, 150);
  ellipse(0, 20, 100, 60);

  // Cabeça
  ellipse(-50, 0, 80, 60);

  // Olhos
  fill(0);
  ellipse(-60, -10, 10, 10);

  // Chifre
  fill(100, 80, 50);
  triangle(-80, -10, -100, -30, -80, -30);

  // Orelhas
  ellipse(-40, -20, 20, 30);

  // Focinho
  fill(150, 150, 150);
  ellipse(-80, 10, 30, 20);

  // Boca
  if (mouthOpen) {
    // Boca aberta
    arc(-80, 20, 20, 10, 0, PI, CHORD);
  } else {
    // Boca fechada
    line(-90, 20, -70, 20);
  }

  // Pernas (simples animação de caminhada)
  // As pernas podem oscilar para dar a impressão de movimento
  let legSwing = sin(frameCount * 0.2) * 10;

  fill(150, 150, 150);
  // Frente esquerda
  rect(-30, 50 + legSwing, 10, 40);
  // Frente direita
  rect(30, 50 - legSwing, 10, 40);

  pop();
}

// Função para detectar cliques ou toques
function mousePressed() {
  if (isMouseOverRhino(mouseX, mouseY)) {
    mouthOpen = true;
    mouthTimer = millis();
  }
}

function touchStarted() {
  if (isMouseOverRhino(touchX, touchY)) {
    mouthOpen = true;
    mouthTimer = millis();
  }
  // Evitar comportamento padrão em dispositivos móveis
  return false;
}

// Função para verificar se o mouse está sobre o rinoceronte
function isMouseOverRhino(mx, my) {
  // Calcular a distância do mouse para a posição atual do rinoceronte
  let dx = abs(mx - rhinoX);
  let dy = abs(my - rhinoY);

  // Definir a área aproximada do rinoceronte (ajustada para o movimento)
  if (dx < 100 && dy < 100) {
    return true;
  }
  return false;
}
