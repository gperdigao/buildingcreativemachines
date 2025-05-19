// Declarações de variáveis globais
let angle = 0;          // Ângulo de rotação da estrela
let sparkleCount = 150; // Quantidade de bolinhas cintilantes
let sparkles = [];      // Array para armazenar as bolinhas cintilantes

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Inicializa as bolinhas cintilantes em posições aleatórias
  for (let i = 0; i < sparkleCount; i++) {
    sparkles.push({
      x: random(width),
      y: random(height),
      size: random(3, 10)
    });
  }
}

function draw() {
  background(0, 255, 0); // Fundo verde (R=0, G=255, B=0)

  // Desenha as bolinhas piscantes
  noStroke();
  for (let i = 0; i < sparkles.length; i++) {
    let s = sparkles[i];
    // Varia a opacidade para criar um “brilho” aleatório
    fill(255, 255, 255, random(50, 255));
    circle(s.x, s.y, s.size);
  }

  // Translada e rotaciona o canvas para desenhar a estrela no centro
  push();
  translate(width / 2, height / 2);
  rotate(angle);
  // Aumenta o ângulo para girar para a direita
  angle += 0.01;
  
  // Desenha a estrela azul de 16 pontas
  fill(0, 0, 255); // Azul
  stroke(0, 0, 128); // Traço azul-escuro para dar mais contraste
  strokeWeight(2);
  beginShape();
  let points = 16;
  let outerRadius = min(width, height) * 0.2; // Ajusta ao tamanho da tela
  let innerRadius = outerRadius * 0.4;
  for (let i = 0; i < points; i++) {
    let angleStep = TWO_PI / points;
    // Ponta externa
    let x1 = cos(i * angleStep) * outerRadius;
    let y1 = sin(i * angleStep) * outerRadius;
    vertex(x1, y1);
    // Ponta interna
    let x2 = cos(i * angleStep + angleStep / 2) * innerRadius;
    let y2 = sin(i * angleStep + angleStep / 2) * innerRadius;
    vertex(x2, y2);
  }
  endShape(CLOSE);
  pop();
}

// Função para redimensionar a tela ao mudar de tamanho
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
