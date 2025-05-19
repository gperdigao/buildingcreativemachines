function setup() {
  // Cria a tela ajustada ao tamanho da janela
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  // Fundo azul-escuro
  background(0, 0, 139); 

  // Translada para o centro do canvas
  translate(width / 2, height / 2);

  // Rotação para a esquerda (ângulo negativo)
  rotate(-frameCount);

  // Desenha a estrela de 5 pontas
  fill(255, 255, 0);  // Cor amarela
  noStroke();

  beginShape();
  for (let i = 0; i < 10; i++) {
    // Para criar 5 pontas, usamos 10 vértices (ponta externa e interna)
    let angle = map(i, 0, 10, 0, 360);
    let radius = i % 2 === 0 ? 80 : 35; 
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}

// Ajusta o tamanho do canvas se a janela for redimensionada
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
