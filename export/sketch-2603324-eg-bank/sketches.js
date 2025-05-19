// Código para OpenProcessing: estrela laranja com 4 pontas, 20 bolinhas azuis girando e luzes de Natal piscando

let starAngle = 0;  // Ângulo da estrela (gira para a esquerda)
let ballAngle = 0;  // Ângulo das bolinhas (giram para a direita)
let lights = [];    // Array para armazenar as luzes de Natal

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  
  // Cria luzes de Natal em posições aleatórias
  // Vamos criar 30 luzes com tamanhos variados
  for (let i = 0; i < 30; i++) {
    lights.push({
      x: random(width),
      y: random(height),
      size: random(5, 10)
    });
  }
}

function draw() {
  background(0);  // Fundo preto para destacar os efeitos
  
  // Desenha as luzes de Natal piscantes (atrás dos elementos principais)
  let natalColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"];
  noStroke();
  for (let light of lights) {
    // A cada frame, a cor é escolhida aleatoriamente para efeito de piscar
    fill(natalColors[floor(random(natalColors.length))]);
    ellipse(light.x, light.y, light.size, light.size);
  }
  
  // Desenha as 20 bolinhas azuis girando em círculo ao redor do centro
  push();
  translate(width / 2, height / 2);
  for (let i = 0; i < 20; i++) {
    let angle = ballAngle + i * (360 / 20);
    let r = 100;  // Raio do círculo onde as bolinhas circulam
    let x = r * cos(angle);
    let y = r * sin(angle);
    fill("#0000FF");
    ellipse(x, y, 20, 20);  // Bolinhas com diâmetro 20
  }
  pop();
  
  // Desenha a estrela laranja com 4 pontas (na verdade, um polígono estrela com 8 vértices alternados)
  push();
  translate(width / 2, height / 2);
  rotate(starAngle);  // Rotaciona a estrela para a esquerda
  fill("#FFA500");    // Cor laranja
  noStroke();
  beginShape();
  let outerRadius = 50;
  let innerRadius = 25;
  // Cria uma estrela com 4 pontas (8 vértices, alternando entre extremos e reentradas)
  for (let i = 0; i < 8; i++) {
    let angle = i * 45;
    let r = (i % 2 === 0) ? outerRadius : innerRadius;
    vertex(r * cos(angle), r * sin(angle));
  }
  endShape(CLOSE);
  pop();
  
  // Atualiza os ângulos para a animação:
  // A estrela gira para a esquerda (reduz o ângulo)
  starAngle -= 1;
  // As bolinhas giram para a direita (aumenta o ângulo)
  ballAngle += 2;
}
