function setup() {
  createCanvas(400, 400);
  // Se preferir, altere para angleMode(RADIANS) e use radianos.
  angleMode(DEGREES);
}

function draw() {
  background(220);

  // Calcula a cor das bolas: vermelho ou amarelo, alternando a cada segundo
  let tempoSegundos = floor(frameCount / 60);
  let corBolas = (tempoSegundos % 2 === 0) ? color(255, 0, 0) : color(255, 255, 0);

  // Desenha as 6 bolas ao fundo
  push();
  translate(width / 2, height / 2);
  rotate(frameCount * 0.5); // Rotaciona para a direita (sentido horário)
  fill(corBolas);
  noStroke();
  
  // Distribui 6 bolas em círculo
  for (let i = 0; i < 6; i++) {
    push();
    rotate(i * 360 / 6);
    ellipse(100, 0, 30, 30);
    pop();
  }
  pop();

  // Desenha a estrela de 5 pontas na frente
  push();
  translate(width / 2, height / 2);
  rotate(-frameCount); // Gira para a esquerda (sentido anti-horário)
  fill(0, 255, 0);
  noStroke();

  beginShape();
  // Para criar a estrela de 5 pontas, percorremos 10 pontos alternando raio maior e menor
  for (let i = 0; i < 10; i++) {
    let ang = i * 36; // 360° / 10 = 36°
    // Raio maior nos pontos pares (pontas), menor nos pontos ímpares
    let raio = (i % 2 === 0) ? 50 : 20;
    let x = raio * cos(ang);
    let y = raio * sin(ang);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}
