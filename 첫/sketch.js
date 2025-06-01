function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0); // 검정 배경
  textAlign(CENTER, CENTER);
  
  fill(255); // 흰색 글자
  textSize(48);
  text("담배 꽁초를 아무데나 버리지 말자", width / 2, height / 2 - 30);

  textSize(24);
  text("김나영, 문수현, 서예린", width / 2, height / 2 + 30);
}

function draw() {
  // 정적 화면이라 draw는 비워둠
}
