let yoff = 0;              // 물결 노이즈 시간축
let flow = 0;              // 강 흐름 방향 오프셋
const step = 20;           // 강둑 점 간격
const baseHeight = 100;    // 강 높이(반쪽)
const heightVariance = 30; // 높이 변동폭
const rocks = [];          // 바위 데이터 저장

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // 바위 위치, 크기, 명암도(진한 회색 톤) 한 번만 생성
  const centerY = height / 2;
  for (let i = 0; i < 30; i++) {
    let rx = random(width);
    let ry1 = centerY - baseHeight + random(-10, 10);
    let rw1 = random(40, 80), rh1 = random(30, 50);
    let ry2 = centerY + baseHeight + random(-10, 10);
    let rw2 = random(40, 80), rh2 = random(30, 50);
    // 진한 회색 톤: r=g=b = shade (값을 낮춰 어둡게 설정)
    let shade1 = random(30, 80);  // 상단 바위
    let shade2 = random(30, 80);  // 하단 바위
    rocks.push({ rx, ry1, rw1, rh1, shade1, ry2, rw2, rh2, shade2 });
  }
}

function draw() {
  // 1) 땅 배경
  background(34, 100, 34);
  const centerY = height / 2;

  // 2) 상단 바위 먼저 그리기 (물이 가리기 전)
  for (let r of rocks) {
    fill(r.shade1);
    ellipse(r.rx, r.ry1, r.rw1, r.rh1);
  }

  // 3) 물 본체 (노이즈 + 흐름 오프셋)
  fill(0, 160, 200, 150);
  beginShape();
    let xoff = flow;
    for (let x = 0; x <= width; x += step) {
      let halfH = baseHeight + map(noise(xoff, yoff), 0, 1, -heightVariance, heightVariance);
      vertex(x, centerY - halfH);
      xoff += 0.02;
    }
    xoff = flow;
    for (let x = width; x >= 0; x -= step) {
      let halfH = baseHeight + map(noise(xoff, yoff), 0, 1, -heightVariance, heightVariance);
      vertex(x, centerY + halfH);
      xoff += 0.02;
    }
  endShape(CLOSE);

  // 4) 하단 바위 그리기 (물이 가린 후에도 위에 그림)
  for (let r of rocks) {
    fill(r.shade2);
    ellipse(r.rx, r.ry2, r.rw2, r.rh2);
  }

  // 5) 애니메이션 오프셋 업데이트
  yoff += 0.01;  // 노이즈 속도
  flow += 0.003; // 흐름 속도
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
