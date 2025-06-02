// 물고기와 담배꽁초가 있는 강 애니메이션
let fishImg, fishDieImg, cigaretteImg;
let fishSystem, cigarettes = [];
let yoff = 0, flow = 0;
const step = 20, baseHeight = 100, heightVariance = 30;
const rocks = [];

let spawnInterval = 240;
let lastSpawnFrame = 0;
let pollutionLevel = 0;
let startFrame;

function preload() {
  fishImg = loadImage("fishing복사본.png");
  fishDieImg = loadImage("fishdie복사본.png");
  cigaretteImg = loadImage("담배꽁초복사본.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  noStroke();
  setupRocks();
  fishSystem = createFishAnimation(5);
  cigarettes.push(createCigarette());
  startFrame = frameCount;
}

function draw() {
  background(34, 100, 34);
  const centerY = height / 2;

  drawRocks(true);

  // 물 색상: 5초 후부터 점점 탁해짐
  let t = frameCount - startFrame;
  let cleanColor = color(0, 160, 200, 150);
  let pollutedColor = color(80, 80 + pollutionLevel * 0.1, 90 + pollutionLevel * 0.1, 200);
  let lerpAmt = constrain((t - 60 * 5) / 300, 0, 1);
  let currentWaterColor = lerpColor(cleanColor, pollutedColor, lerpAmt);
  fill(currentWaterColor);

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

  if (pollutionLevel > 30 && lerpAmt > 0) {
    let hazeAlpha = map(pollutionLevel, 30, 800, 0, 120) * lerpAmt;
    fill(80, 80, 90, hazeAlpha);
    beginShape();
    let xoff2 = flow;
    for (let x = 0; x <= width; x += step) {
      let halfH = baseHeight + map(noise(xoff2, yoff), 0, 1, -heightVariance, heightVariance);
      vertex(x, centerY - halfH);
      xoff2 += 0.02;
    }
    xoff2 = flow;
    for (let x = width; x >= 0; x -= step) {
      let halfH = baseHeight + map(noise(xoff2, yoff), 0, 1, -heightVariance, heightVariance);
      vertex(x, centerY + halfH);
      xoff2 += 0.02;
    }
    endShape(CLOSE);
  }

  updateCigarettes();
  fishSystem.update();
  fishSystem.display();
  drawRocks(false);

  yoff += 0.01;
  flow += 0.003;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setupRocks() {
  const centerY = height / 2;
  for (let i = 0; i < 30; i++) {
    let rx = random(width);
    let ry1 = centerY - baseHeight + random(-10, 10);
    let rw1 = random(40, 80), rh1 = random(30, 50);
    let ry2 = centerY + baseHeight + random(-10, 10);
    let rw2 = random(40, 80), rh2 = random(30, 50);
    let shade1 = random(30, 80);
    let shade2 = random(30, 80);
    rocks.push({ rx, ry1, rw1, rh1, shade1, ry2, rw2, rh2, shade2 });
  }
}

function drawRocks(isUpper) {
  for (let r of rocks) {
    fill(isUpper ? r.shade1 : r.shade2);
    ellipse(r.rx, isUpper ? r.ry1 : r.ry2, isUpper ? r.rw1 : r.rw2, isUpper ? r.rh1 : r.rh2);
  }
}

function createFishAnimation(count) {
  const fishes = [];
  for (let i = 0; i < count; i++) {
    fishes.push(new Fish(
      random(-width, width),
      height / 2 + random(-30, 30),
      random(1.5, 3),
      random(80, 180),
      random(TWO_PI)
    ));
  }

  return {
    update() {
      for (let fish of fishes) {
        fish.checkCollision(cigarettes);
        fish.update();
      }
    },
    display() {
      for (let fish of fishes) fish.display();
    }
  };
}

class Fish {
  constructor(x, baseY, speed, size, phase) {
    this.x = x;
    this.baseY = baseY;
    this.y = baseY;
    this.speed = speed;
    this.size = size;
    this.phase = phase;
    this.dead = false;
  }

  update() {
    let effectiveSpeed = this.dead ? this.speed * 0.3 : this.speed;
    this.x += effectiveSpeed;
    this.y = this.baseY + sin(frameCount * 0.05 + this.phase) * 10;
    if (this.x > width + this.size / 2) {
      this.x = -this.size / 2;
      this.dead = false;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    image(this.dead ? fishDieImg : fishImg, 0, 0, this.size, this.size * 0.66);
    pop();
  }

  checkCollision(cigs) {
    if (this.dead) return;
    for (let c of cigs) {
      let d = dist(this.x, this.y, c.x, c.y);
      if (d < this.size * 0.4) {
        this.dead = true;
        break;
      }
    }
  }
}

function createCigarette() {
  return {
    x: -100,
    y: height / 2 + random(-50, 50),
    speed: random(1, 2),
    angle: random(-0.1, 0.1),
    angleSpeed: random(-0.005, 0.005),
    waveOffset: random(0.02, 0.05)
  };
}

function updateCigarettes() {
  if (frameCount - lastSpawnFrame > spawnInterval) {
    cigarettes.push(createCigarette());
    lastSpawnFrame = frameCount;
  }

  for (let c of cigarettes) {
    c.x += c.speed;
    c.y += sin(frameCount * c.waveOffset) * 0.4;
    c.angle += c.angleSpeed;

    push();
    translate(c.x, c.y);
    rotate(c.angle);
    image(cigaretteImg, 0, 0, 100, 50);
    pop();

    pollutionLevel += 0.03;
  }
}
