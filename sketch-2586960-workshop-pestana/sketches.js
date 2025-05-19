function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  noStroke();
}

function draw() {
  background(0);
  
  // Efeitos piscando (simples "pontos" coloridos aleatórios pelo fundo)
  for (let i = 0; i < 20; i++) {
    fill(random(255), random(255), random(255));
    circle(random(width), random(height), random(5, 15));
  }
  
  // Desenha a estrela verde no centro
  push();
  translate(width / 2, height / 2);
  fill(0, 255, 0);
  
  // Parte superior do hexagrama (triângulo)
  beginShape();
  vertex(0, -50);
  vertex(43.3, 25);
  vertex(-43.3, 25);
  endShape(CLOSE);
  
  // Parte inferior do hexagrama (triângulo invertido)
  beginShape();
  vertex(0, 50);
  vertex(43.3, -25);
  vertex(-43.3, -25);
  endShape(CLOSE);
  
  // Duas bolinhas rosas girando em volta da estrela
  let raio = 80;
  let angulo = frameCount * 2;

  // Primeira bolinha
  let x1 = raio * cos(angulo);
  let y1 = raio * sin(angulo);
  fill(255, 192, 203);
  circle(x1, y1, 15);
  
  // Segunda bolinha (oposta à primeira, 180 graus)
  let x2 = raio * cos(angulo + 180);
  let y2 = raio * sin(angulo + 180);
  circle(x2, y2, 15);
  
  pop();
}
