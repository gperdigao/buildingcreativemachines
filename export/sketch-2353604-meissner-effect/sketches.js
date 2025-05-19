let numLines = 30;
let angle = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  smooth();
}

function draw() {
  background(0);
  orbitControl(); // Permite controlar a câmera com o mouse
  rotateY(angle);
  angle += 0.005;

  // Desenha o supercondutor
  noStroke();
  fill(50, 50, 200);
  push();
  translate(0, 50, 0);
  box(200, 20, 200);
  pop();

  // Desenha as linhas de campo magnético
  stroke(200, 50, 50);
  noFill();
  for (let i = -numLines; i <= numLines; i++) {
    beginShape();
    for (let y = -300; y <= 50; y += 5) {
      let x = i * 6;
      let z = campoMagnetico(x, y);
      vertex(x, y, z);
    }
    endShape();
  }
}

// Função que simula a repulsão do campo magnético pelo supercondutor
function campoMagnetico(x, y) {
  let scY = 50; // Posição Y do topo do supercondutor
  let distancia = dist(x, y, 0, scY);
  let intensidade = 0;
  
  if (y > scY) {
    // Abaixo do supercondutor, o campo magnético é zero
    intensidade = 0;
  } else {
    // Acima do supercondutor, o campo é repelido
    intensidade = 10000 / (distancia + 1);
  }
  
  // Calcula o desvio em Z para representar a repulsão
  let z = sin((x + frameCount) * 0.01) * intensidade * 0.01;
  return z;
}
