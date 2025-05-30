let fishImg;
let fishSystem;

function preload() {
  fishImg = loadImage("fishing.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fishSystem = createFishAnimation(fishImg, 5); // 원하는 수만큼 생성
}

function draw() {
  clear();
  fishSystem.update();
  fishSystem.display();
}

// -----------------------------
// 💡 재사용 가능한 함수 정의
// -----------------------------
function createFishAnimation(img, count) {
  const fishes = [];

  for (let i = 0; i < count; i++) {
    fishes.push(new Fish(
      random(-width, 0),                // 시작 x 좌표
      height / 2 + random(-30, 30),     // y 좌표 중앙 근처
      random(1.5, 3),                   // 속도
      1,                                // 방향 고정 (오른쪽)
      random(80, 180),                  // 크기
      random(TWO_PI),                   // 위아래 흔들림 위상
      img                               // 이미지 전달
    ));
  }

  return {
    update() {
      for (let fish of fishes) fish.update();
    },
    display() {
      for (let fish of fishes) fish.display();
    }
  };
}

// -----------------------------
// 🐟 물고기 클래스 정의
// -----------------------------
class Fish {
  constructor(x, baseY, speed, direction, size, phase, img) {
    this.x = x;
    this.baseY = baseY;
    this.y = baseY;
    this.speed = speed;
    this.direction = direction;
    this.size = size;
    this.phase = phase;
    this.img = img;
  }

  update() {
    this.x += this.speed * this.direction;
    this.y = this.baseY + sin(frameCount * 0.05 + this.phase) * 10;

    if (this.x > width + this.size / 2) {
      this.x = -this.size / 2;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    imageMode(CENTER);
    image(this.img, 0, 0, this.size, this.size * 0.66);
    pop();
  }
}
