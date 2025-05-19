let FA, I, P, NAF, GSA;
let TR, FR;

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  createP("<ul style='color: white;'>")
    .position(10, 10)
    .style('font-size', '16px');

  createP("<li>Frequência de ataques de ansiedade (0-10):</li>")
    .position(10, 40)
    .style('color', 'white');
  FA = createSlider(0, 10, 5);
  FA.position(320, 55);
  
  createP("<li>Idade:</li>")
    .position(10, 70)
    .style('color', 'white');
  I = createSlider(0, 100, 30);
  I.position(320, 85);
  
  createP("<li>Peso (kg):</li>")
    .position(10, 100)
    .style('color', 'white');
  P = createSlider(30, 150, 70);
  P.position(320, 115);
  
  createP("<li>Nível de atividade física (0-10):</li>")
    .position(10, 130)
    .style('color', 'white');
  NAF = createSlider(0, 10, 5);
  NAF.position(320, 145);
  
  createP("<li>Grau de severidade dos sintomas de ansiedade (0-10):</li>")
    .position(10, 160)
    .style('color', 'white');
  GSA = createSlider(0, 10, 6);
  GSA.position(320, 175);

  createP("</ul>").position(10, 190).style('color', 'white');
}

function draw() {
  background(0);
  
  let faValue = FA.value();
  let iValue = I.value();
  let pValue = P.value();
  let nafValue = NAF.value();
  let gsaValue = GSA.value();
  
  [TR, FR] = recomendarRespiracao(faValue, iValue, pValue, nafValue, gsaValue);
  
  let t = millis() / 1000;
  let breathCycle = 60 / FR;
  let phase = (t % breathCycle) / breathCycle;
  
  let size;
  if (TR === "Respiração 4-7-8") {
    size = tamanhoRespiracao478(phase);
  } else {
    size = tamanhoRespiracaoDiafragmatica(phase);
  }

  drawParticles(size);
  
  fill(255);
  textSize(16);
  text(`Tipo de Respiração: ${TR}`, 10, height - 50);
  text(`Frequência de Respiração: ${FR.toFixed(2)} respirações por minuto`, 10, height - 30);
}

function recomendarRespiracao(FA, I, P, NAF, GSA) {
  let TR;
  if (GSA >= 7) {
    TR = "Respiração 4-7-8";
  } else {
    TR = "Respiração diafragmática";
  }
  
  let FR = max(6, min(10, 10 - (FA / 2) - (GSA / 2) - (I / 100) - (P / 200)));
  return [TR, FR];
}

function tamanhoRespiracao478(phase) {
  if (phase < 4/19) {
    return sin(map(phase, 0, 4/19, 0, PI / 2));
  } else if (phase < 11/19) {
    return 1;
  } else {
    return sin(map(phase, 11/19, 1, PI / 2, 0));
  }
}

function tamanhoRespiracaoDiafragmatica(phase) {
  return sin(PI * phase);
}

function drawParticles(size) {
  let numParticles = 100;
  for (let i = 0; i < numParticles; i++) {
    let angle = TWO_PI * i / numParticles;
    let x = width / 2 + cos(angle) * 200 * size;
    let y = height / 2 + sin(angle) * 200 * size;
    fill(255, 100);
    ellipse(x, y, 10, 10);
  }
}
