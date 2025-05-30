let trashImg;
let leftWingImg;
let rightWingImg;
let wingAngle = 0;
let angleSpeed = 0.05;
let floatY = 0;

function preload() {
  trashImg = loadImage("쓰레기통.png");
  leftWingImg = loadImage("왼날개.png");
  rightWingImg = loadImage("오날개.png");
}

function setup() {
  createCanvas(600, 400);
  imageMode(CENTER);
  clear();
}

function draw() {
  clear();
  animateWings();
  WingedTrash(width / 2, height / 2 + floatY); // 중앙에 쓰레기통 띄우기
}

// ✅ 날개달린 쓰레기통 함수
function WingedTrash(x, y) {
  push();
  translate(x, y);
  drawWings();
  image(trashImg, 0, 0, 100, 100);
  pop();
}

// 날개 그리기 함수
function drawWings() {
  // 오른쪽 날개
  push();
  translate(40, -10); // 위치 조정
  rotate(-wingAngle);
  image(rightWingImg, 0, 0, 60, 60);
  pop();

  // 왼쪽 날개
  push();
  translate(-40, -10); // 위치 조정
  rotate(wingAngle);
  image(leftWingImg, 0, 0, 60, 60);
  pop();
}

// 날개 각도 및 떠오르는 위치 애니메이션
function animateWings() {
  wingAngle = sin(frameCount * angleSpeed) * 0.3; // 각도 줄임
  floatY = sin(frameCount * 0.1) * 10;
}
