// 장면 1, 장면 2 전역변수
let video, facemesh, predictions = [];
let mouthOpen = false, mouthOpenStart = 0;
let THRESHOLD = 15;      // 입 벌어진 정도 기준값(실험하면서 조절)
let smokeCount = 0, scene = 0;
let cigaretteSmoke; // 담배 연기
let isSmoking = false;
//let cigaretteX1,cigaretteY1;


let imgCiga1, imgCiga2, imgCiga3, imgCigaTrash, cigaImg;
let defaultTownImg, clickAllImg, clickMountainImg, clickSwarImg;
let modeMountain = false, modeSwar = false;

// === 산/하수구 클릭 영역 (수정하세요!) ===
let mountainArea = { x: 0, y: 80, w: 700, h: 200 };  // 산 영역 좌표
let sewerArea    = { x: 850, y: 610, w: 200, h: 100 };  // 하수구 영역 좌표

// 장면 3 전역변수
let treeImg;
let tree2Img;
let treePosX, treePosY, treeScale;

let handpose;
let video2;
let predictions2 = [];
let cigarette;
let cigaretteX, cigaretteY;
let hasDroppedOnce = false;  // ✅ 한 번만 떨어뜨리기
const cigaretteSize = 150;

// 장면 4 전역변수
let isVideoSetup = false;
let startTime = 0;
let smokeParticles = [];

// 장면 6 전역변수
let yoff = 0;              // 물결 노이즈 시간축
let flow = 0;              // 강 흐름 방향 오프셋
const step = 20;           // 강둑 점 간격
const baseHeight = 100;    // 강 높이(반쪽)
const heightVariance = 30; // 높이 변동폭
const rocks = [];          // 바위 데이터 저장
let issetupScene6 = false;
let fishImg;
let fishSystem;

// 장면 7 전역변수
let trashImg;
let leftWingImg;
let rightWingImg;
let wingAngle = 0;
let angleSpeed = 0.05;
let floatY = 0;

function preload() {
  imgCiga1  = loadImage('ciga1.png');
  imgCiga2  = loadImage('ciga2.png');
  imgCiga3  = loadImage('ciga3.png');
  imgCigaTrash = loadImage('cigaTrash.png');
  defaultTownImg   = loadImage('defaultTown.png');
  clickAllImg      = loadImage('ClickAll.png');
  clickMountainImg = loadImage('clickMountain.png');
  clickSwarImg     = loadImage('clickSwar.png');
  treeImg = loadImage("tree.png");
  tree2Img = loadImage("tree2.png");
  sqImg = loadImage("sq.png");
  maImg = loadImage("ma.png");
  //LfireImg = loadImage("Lfire.png");
  BfireImg = loadImage("Bfire.png");
  cigarette = loadImage('cigaTrash.png');
  fishImg = loadImage("fishing.png");
  trashImg = loadImage("쓰레기통.png");
  leftWingImg = loadImage("왼날개.png");
  rightWingImg = loadImage("오날개.png");
}

function setup() {
  
  //fullscreen(true);
  createCanvas(windowWidth, windowHeight);
  
  cigaretteX = width / 2;
  cigaretteY = height / 2;
  
  //cigaretteSmoke = new CigaretteSmoke(cigaretteX1, cigaretteY1);
  

  // 웹캠 세팅
  setupFaceVideo();
  
  // 초기 시가 이미지
  cigaImg = imgCiga3;

  //imageMode(CENTER);

  treePosX = width * 0.5;
  treePosY = height * 0.6;
  treeScale = 0.3;

  
}

function setupFaceVideo()
{
  video = createCapture(VIDEO);
  video.size(400, 300);
  video.hide();

  // FaceMesh 모델 로드
  facemesh = ml5.facemesh(video, () => console.log('Facemesh loaded'));
  facemesh.on('predict', results => predictions = results);
}

// 📦 웹캠과 모델 설정
function setupVideoAndModel() {
  video2 = createCapture(VIDEO);
  video2.size(width, height);
  video2.hide();

  handpose = ml5.handpose(video2, () => {
    console.log("Handpose model loaded!");
  });

  handpose.on("predict", results => {
    predictions2 = results;
  });

  
}

function draw() {
  //clear();
  if (scene === 0)
  {
    drawScene0();
  }
  else if (scene === 1) {
    drawScene1();
  } 
  else if(scene === 2){
    drawScene2();
  } 
  else if(scene === 3)
  {
    drawScene3();
  }
  else if(scene === 4)
  {
    if(!isVideoSetup)
    {
        setupVideoAndModel();
        isVideoSetup = true;
    }
    else
    {
        drawScene4();
    }
  }
  else if(scene === 5)
  {
    drawScene5();
  }
  else if(scene === 6)
  {
    drawScene6();
  }
  else if(scene === 7)
  {
    drawScene7();
  }
  else if(scene === 8)
  {
    drawScene8();
  }
  else if(scene === 9)
  {
    drawScene9();
  }
  
}

function drawScene0()
{
  background(0); // 검정 배경
  textAlign(CENTER, CENTER);
  
  fill(255); // 흰색 글자
  textSize(48);
  text("담배 꽁초를 아무데나 버리지 말자", width / 2, height / 2 - 30);

  textSize(24);
  text("김나영, 문수현, 서예린", width / 2, height / 2 + 30);

  setTimeout(() => scene = 1, 3000);
}


function drawScene1() {
  background(255);
  // 가운데에 시가 이미지
  imageMode(CENTER);
  image(cigaImg,
        width/2,height/2,cigaImg.width/2,
        cigaImg.height/2);
  // 왼쪽 위에 웹캠 영상
  imageMode(CORNER);
  image(video, 0, 0);
  
  handleMouthOpen();
  /* 
  if(smokeCount >= 1)
  {
    isSmoking = true;
  }
  if(isSmoking)
  {
    cigaretteSmoke.generate();
    cigaretteSmoke.update();
    cigaretteSmoke.display();
  }*/
  push();
  textAlign(CENTER,CENTER);
  textSize(48);
  fill(0);
  text("담배가 담배꽁초가 될 때까지 입을 벌려주세요",width/2,height/2+200);
  pop();
}

function handleMouthOpen() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    // 입술 위아래 포인트 (13,14) 사용
    const topLip    = keypoints[13];
    const bottomLip = keypoints[14];
    const d = dist(topLip[0], topLip[1], bottomLip[0], bottomLip[1]);

    if (d > THRESHOLD) {
      // 입 벌림 시작 시각 기록
      if (!mouthOpen) {
        mouthOpen = true;
        mouthOpenStart = millis();
      } 
      else {
        // 2초 유지되면 흡연 카운트 올리기
        if (millis() - mouthOpenStart > 2000) {
          mouthOpen = false;
          incrementSmoke();
        }
      }
    } else {
      mouthOpen = false;
    }
  }
}

function incrementSmoke() {
  smokeCount++;
  if(smokeCount === 1) {
    cigaImg = imgCiga2;
    /*cigaretteX1 = width/2 + cigaImg.width/2;
    cigaretteY1 = height/2 + cigaImg.height/2;*/
  }
  else if (smokeCount === 2) 
  {
    cigaImg = imgCiga1;
  }
    
  else if (smokeCount === 3) {
    cigaImg = imgCigaTrash;
    // 5초 뒤 장면 2로 전환
    setTimeout(() => scene = 2, 3000);
  }
  
}
/*
class CigaretteSmoke {
  constructor(baseX, baseY) {
    this.baseX = baseX;    // 연기 생성 기준 X 좌표 (담배 끝)
    this.baseY = baseY;    // 연기 생성 기준 Y 좌표 (담배 끝)
    this.particles = [];   // 내부적으로 관리할 연기 입자 배열
  }

  // a) 매 프레임 “한두 개” 입자를 생성할지 호출
  //    보통 draw()나 drawScene1() 안에서,
  //    담배를 피우는 동안만 generate()를 호출하세요.
  generate() {
    // 새 입자 하나 만들기
    // noiseOffset과 size를 각각 랜덤하게 부여해서 자연스러운 움직임
    const p = {
      x: this.baseX + random(-5, 5),   // 담배 끝 주변에서 살짝 좌우 퍼짐
      y: this.baseY,                   // 담배 끝 위치
      age: 0,
      lifetime: 120,                   // 총 120프레임(약 2초) 동안 존재
      alpha: 200,                      // 초기 투명도
      fadeSpeed: 200 / 120,            // alpha가 매 프레임 얼마나 줄어들지
      size: random(10, 18),            // 입자 크기 (원형 반지름)
      noiseOffset: random(1000)        // 노이즈 움직임을 위한 오프셋
    };
    this.particles.push(p);
  }

  // b) 모든 입자를 갱신(update)하고, 수명이 다 된 건 제거
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // 1) 나이(age) 증가
      p.age++;

      // 2) 위로 천천히 올라가되, noise를 섞어 약간 좌우로 흔들리도록
      p.y -= 0.7;
      p.x += map(noise(p.noiseOffset + p.age * 0.02), 0, 1, -1, +1);

      // 3) alpha를 점진적으로 줄여서 페이드 아웃
      p.alpha -= p.fadeSpeed;
      if (p.alpha < 0) p.alpha = 0;

      // 4) 수명(lifetime) 초과 시 배열에서 제거
      if (p.age >= p.lifetime) {
        this.particles.splice(i, 1);
      }
    }
  }

  // c) 모든 입자를 화면에 그려줌
  display() {
    noStroke();
    for (const p of this.particles) {
      fill(180, p.alpha);          // 연한 회색 + 현재 투명도
      ellipse(p.x, p.y, p.size);   // 원형(ellipse)으로 표현
    }
  }
}*/

function drawScene2() {
  

  // 1) 둘 다 true → clickAll
  if (modeMountain && modeSwar) {
    image(clickAllImg, 0, 0, width, height);

  // 2) swar만 true → clickSwar / over 산 → clickAll
  } else if (modeSwar && !modeMountain) {
    if (isOver(mountainArea)) {
        image(clickAllImg, 0, 0, width, height);

    }
    else                      
    {
        image(clickSwarImg, 0, 0, width, height);
    }

  // 3) mountain만 true → clickMountain / over 하수구 → clickAll
  } else if (!modeSwar && modeMountain) {
    if (isOver(sewerArea)) 
        image(clickAllImg, 0, 0, width, height);
    else                   
        image(clickMountainImg, 0, 0, width, height);

  // 0) 둘 다 false → default / over 산 → clickMountain / over 하수구 → clickSwar
  } else {
    if(isOver(mountainArea)) 
    {
        image(clickMountainImg, 0, 0, width, height);
        
    }
    else if (isOver(sewerArea))
    {
        image(clickSwarImg,0, 0, width, height);
    }    
    else
    {
        image(defaultTownImg,   0, 0, width, height);
    }
  }
  push();
  fill(0);
  textSize(30);
  //text(`mouse: ${mouseX}, ${mouseY}`, 10, 20);

  text("담배 꽁초를 버릴 장소를 선택해주세요",width/2,height/2);
  pop();
}

function isOver(area) {
  return mouseX > area.x &&
         mouseX < area.x + area.w &&
         mouseY > area.y &&
         mouseY < area.y + area.h;
}

function mousePressed() { 
  /* 풀스크린 나중에 설정
  if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
    let fs = fullscreen();
    fullscreen(!fs);
  }*/

  if (scene !== 2) return;

  // 0) 둘 다 false 상태에서
  if (!modeMountain && !modeSwar) {
    if (isOver(mountainArea)) 
        {
            clickMountain();
            setTimeout(() => scene = 3, 5000);
        }
    else if (isOver(sewerArea)) 
        {
            clickSwar();
            setTimeout(() => scene = 6, 5000);
        }

  // 2) swar만 true 상태에서
  } else if (modeSwar && !modeMountain) {
    if (isOver(mountainArea)) 
        {
            clickMountain();
            setTimeout(() => scene = 3, 5000);
        }

  // 3) mountain만 true 상태에서
  } else if (!modeSwar && modeMountain) {
    if (isOver(sewerArea)) 
    {
        clickSwar();
        setTimeout(() => scene = 6, 5000);
    }
  }

}

//장면 3 시작
function drawScene3() {
  push();
  imageMode(CENTER);
  drawSkyWithGradient();
  drawSunlight();
  drawSun();

  // 이미지 나무만 출력 (나무 그림 제거됨)
  let imgW = treeImg.width * treeScale;
  let imgH = treeImg.height * treeScale;
  
  image(treeImg, treePosX, treePosY, imgW, imgH+ 150);
  image(treeImg, treePosX + 400, treePosY, imgW+60, imgH+150);
  image(treeImg, treePosX + 400, treePosY, imgW+60, imgH+150);
  image(treeImg, treePosX- 600 , treePosY, imgW+60, imgH+150);
  image(treeImg, treePosX- 150 , treePosY, imgW+60, imgH+150);

  image(tree2Img, treePosX - 300, treePosY, imgW, imgH+150);
  image(tree2Img, treePosX + 250, treePosY, imgW, imgH+150);
  image(tree2Img, treePosX -187, treePosY, imgW, imgH+150);
  image(tree2Img, treePosX +600, treePosY, imgW, imgH+150);
  image(tree2Img, treePosX -70, treePosY+50, imgW, imgH+50);
  image(tree2Img, treePosX +90, treePosY, imgW, imgH+50);

  image(maImg, treePosX - 400, treePosY, imgW, imgH+200);
  image(maImg, treePosX +200, treePosY, imgW, imgH+130);

  drawShrubs();
  drawFlowers();

  pop();
  setTimeout(() => scene = 4, 3000);
}

function drawSkyWithGradient() {
  for (let x = 0; x < width; x++) {
    let inter = map(x, 0, width, 0, 1);
    let c = lerpColor(color(135, 206, 235), color(255, 255, 200), inter);
    stroke(c);
    line(x, 0, x, height * 0.67);
  }
  noStroke();
  fill(34, 139, 34);
  rect(0, height * 0.67, width, height * 0.33);
}

function drawSunlight() {
  noStroke();
  for (let i = width * 0.3; i > 0; i -= width * 0.01) {
    fill(255, 255, 0, 20);
    ellipse(width * 0.8, height * 0.15, i);
  }
}

function drawSun() {
  fill(255, 255, 150);
  ellipse(width * 0.8, height * 0.15, width * 0.1,width * 0.1);
}

function drawClover(xFactor, yFactor) {
  let x = width * xFactor;
  let y = height * yFactor;

  fill(0, 150, 0);
  ellipse(x - 5, y - 5, 10, 10);
  ellipse(x + 5, y - 5, 10, 10);
  ellipse(x, y + 5, 10, 10);
  rect(x - 1, y + 5, 2, 10);
}

function drawDandelion(xFactor, yFactor) {
  let x = width * xFactor;
  let y = height * yFactor;

  fill(255, 215, 0);
  ellipse(x, y, 15, 15);
  fill(0, 128, 0);
  rect(x - 1, y, 2, 15);
}

function drawShrubs() {
  drawClover(0.15, 0.75);
  drawClover(0.16, 0.76);
  drawClover(0.17, 0.77);
  drawClover(0.6, 0.78);
}

function drawFlowers() {
  drawDandelion(0.25, 0.78);
  drawDandelion(0.26, 0.79);
  drawDandelion(0.27, 0.80);
  drawDandelion(0.53, 0.80);
  drawDandelion(0.7, 0.83);
}



function clickMountain() {
  modeMountain = true;
  // 이후 다른 장면 전환 로직은 여기서 추가
}

function clickSwar() {
  modeSwar = true;
  // 이후 다른 장면 전환 로직은 여기서 추가
}

function drawScene4()
{
    background(220);
    drawVideo();
    handleHandDetection();
    displayCigarette();

    if(hasDroppedOnce)
    {
        if(modeMountain && modeSwar)
        {
            setTimeout(() => scene = 8, 3000);
        }
        else if(modeMountain && !modeSwar)
        {
            setTimeout(() => {scene = 5;startTime = millis()}, 3000);
        }
        else if(!modeMountain && modeSwar)
        { 
            setTimeout(() => scene = 2, 3000);
        }
    }
    push();
    fill(255);
    textAlign(CENTER);
    textSize(30);
    text("손을 활짝 피면 담배꽁초를 버리게 됩니다.",width/2,height/2);
    pop();
}

function handleHandDetection() {
  if (predictions2.length > 0 && !hasDroppedOnce) {
    const hand = predictions2[0];
    const fingers = hand.annotations;

    if (areAllFingersExtended(fingers)) {
      // ✅ 손가락이 모두 펴졌고 아직 떨어진 적 없을 때
      cigaretteY = height - cigaretteSize / 2;
      hasDroppedOnce = true;
      //startTime = millis();
      /*
      if(modeMountain && modeSwar)
      {
        setTimeout(() => scene = 8, 3000);
      }
      else if(modeMountain && !modeSwar)
      {
        setTimeout(() => {scene = 5;startTime = millis()}, 3000);
      }
      else if(!modeMountain && modeSwar)
      { 
        setTimeout(() => scene = 2, 3000);
      }*/
    }
  }
}

// 📦 손가락이 모두 펴졌는지 판별
function areAllFingersExtended(fingers) {
  const fingerNames = ['indexFinger', 'middleFinger', 'ringFinger', 'pinky'];
  for (const name of fingerNames) {
    const tip = fingers[name][3];
    const base = fingers[name][0];
    if (tip[1] > base[1]) return false;
  }
  return true;
}

// 📦 담배 이미지 출력
function displayCigarette() {
  push();
  imageMode(CORNER);
  image(cigarette, cigaretteX - cigaretteSize / 2, cigaretteY - cigaretteSize / 2, cigaretteSize, cigaretteSize);
  pop();
}

// 📦 비디오 출력
function drawVideo() {
  push();
  imageMode(CORNER);
  image(video2, 0, 0, width, height);
  pop();
}

function drawScene5() {
  push();
  imageMode(CENTER);
  background(255);
  drawSkyWithGradient();
  drawSunlight();
  drawSun();

  let imgW = treeImg.width * treeScale;
  let imgH = treeImg.height * treeScale;

  image(BfireImg, treePosX - 300, treePosY - 180, imgW, imgH + 200);

  image(treeImg, treePosX, treePosY, imgW, imgH + 150);
  image(treeImg, treePosX + 400, treePosY, imgW + 60, imgH + 150);
  image(treeImg, treePosX - 600, treePosY, imgW + 60, imgH + 150);
  image(treeImg, treePosX - 150, treePosY, imgW + 60, imgH + 150);

  image(tree2Img, treePosX - 300, treePosY, imgW, imgH + 150);
  image(tree2Img, treePosX + 250, treePosY, imgW, imgH + 150);
  image(tree2Img, treePosX - 187, treePosY, imgW, imgH + 150);
  image(tree2Img, treePosX + 600, treePosY, imgW, imgH + 150);
  image(tree2Img, treePosX - 70, treePosY + 50, imgW, imgH + 50);
  image(tree2Img, treePosX + 90, treePosY, imgW, imgH + 50);

  image(maImg, treePosX - 400, treePosY, imgW, imgH + 200);
  image(maImg, treePosX + 200, treePosY, imgW, imgH + 130);

  image(BfireImg, treePosX + 200, treePosY + 70, imgW + 50, imgH + 300);
  image(BfireImg, 0, treePosY + 70, imgW + 500, imgH + 300);
  image(BfireImg, 700, treePosY + 70, imgW + 500, imgH + 300);

  image(BfireImg, 1500, treePosY + 70, imgW + 500, imgH + 300);
  // 🌫 연기 생성 위치 (위치만 조정됨, X 좌표 그대로)
  smokeParticles.push(new SmokeParticle(treePosX + 320, treePosY - 160 ));  
  smokeParticles.push(new SmokeParticle(treePosX + 330, treePosY - 160 ));
  smokeParticles.push(new SmokeParticle(treePosX - 400, treePosY - 270));  
  smokeParticles.push(new SmokeParticle(treePosX+30 , treePosY + 130));  

  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    let p = smokeParticles[i];
    p.update();
    p.display();
    if (p.isFinished()) {
      smokeParticles.splice(i, 1);
    }
  }

   // 🎬 3초 후 부드럽게 회색으로 덮기 (fade 효과)
  if (millis() - startTime > 6000) {
    let fadeAlpha = map(millis() - startTime, 6000, 7000, 0, 255);
    fadeAlpha = constrain(fadeAlpha, 0, 150);
    noStroke();
    fill(169, 169, 169, fadeAlpha); // #A9A9A9 회색 + 알파값
    rect(0, 0, width, height);      // 전체 화면 덮기
    setTimeout(() => scene = 2, 3000);
  }
  pop();
}


class SmokeParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 180;
    this.age = 0;
    this.lifetime = 180;
    this.path = [];

    this.baseX = x;
    this.baseY = y;
    this.noiseOffset = random(1000);
    this.size = random(20, 40);
  }

  update() {
    this.age++;
    this.y -= 0.7;
    this.x = this.baseX + map(noise(this.noiseOffset + this.age * 0.01), 0, 1, -20, 20);
    this.path.push({ x: this.x, y: this.y });
    if (this.path.length > 20) {
      this.path.shift();
    }
    this.alpha = map(this.age, 0, this.lifetime, 180, 0);
  }

  display() {
    noFill();
    stroke(150, this.alpha);
    strokeWeight(20); // 연기 크기 2배
    beginShape();
    for (let p of this.path) {
      curveVertex(p.x, p.y);
    }
    endShape();
  }

  isFinished() {
    return this.age > this.lifetime;
  }
}

function setupScene6()
{
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

  fishSystem = createFishAnimation(fishImg, 5); // 원하는 수만큼 생성  
}

function drawScene6()
{
  if (!issetupScene6)
  {
    setupScene6();
    issetupScene6 = true;
  }
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

  fishSystem.update();
  fishSystem.display();

  
  
  setTimeout(() => {scene = 4;hasDroppedOnce = false;cigaretteY = height/2}, 6000);
}

// -----------------------------
// 💡 재사용 가능한 함수 정의
// -----------------------------
function createFishAnimation(img, count) {
  const fishes = [];

  // 처음에 미리 2~3마리 생성
  const initialFishCount = 3;
  for (let i = 0; i < initialFishCount; i++) {
    fishes.push(new Fish(
      random(0, width), // 화면 안에서 등장하도록 설정
      height / 2 + random(-30, 30),
      random(4, 7),
      1,
      random(80, 180),
      random(TWO_PI),
      img
    ));
  }

  // 나머지 마리들은 시간 차를 두고 등장
  let nextSpawnTime = millis() + random(100, 500);

  return {
    update() {
      // 일정 시간마다 새로운 물고기 추가
      if (fishes.length < count && millis() > nextSpawnTime) {
        fishes.push(new Fish(
          random(-200, -50), // 새로운 물고기는 바깥에서 들어오게
          height / 2 + random(-30, 30),
          random(1, 2.5),
          1,
          random(80, 180),
          random(TWO_PI),
          img
        ));

        nextSpawnTime = millis() + random(100, 500);
      }

      // 기존 물고기들 update
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

  // ⭐️ 헤엄치는 회전 추가 ⭐️
    let swimAngle = sin(frameCount * 0.2 + this.phase) * 0.1;
    rotate(swimAngle);

    imageMode(CENTER);
    image(this.img, 0, 0, this.size, this.size * 0.66);
    pop();
  }

}

// 강물이 변하는 것 추가 예정
function drawScene7()
{
    scene = 8;
}

function drawScene8()
{
  drawScene2();
  animateWings();
  WingedTrash(width / 2-50, height / 2 + floatY); // 중앙에 쓰레기통 띄우기
  setTimeout(() => scene = 9, 8000);
}

function WingedTrash(x, y) {
  push();
  translate(x, y);
  imageMode(CENTER);
  drawWings();
  image(trashImg, 0, 0, 100, 100);
  pop();
}

// 날개 그리기 함수
function drawWings() {
  // 오른쪽 날개
  push();
  translate(50, -10); // 위치 조정
  rotate(-wingAngle);
  image(rightWingImg, 0, 0, 60, 60);
  pop();

  // 왼쪽 날개
  push();
  translate(-50, -10); // 위치 조정
  rotate(wingAngle);
  image(leftWingImg, 0, 0, 60, 60);
  pop();
}

// 날개 각도 및 떠오르는 위치 애니메이션
function animateWings() {
  wingAngle = sin(frameCount * angleSpeed) * 0.3; // 각도 줄임
  floatY = sin(frameCount * 0.1) * 10;
}

function drawScene9()
{
  background(220);

  textSize(24);         // 글씨 크기
  textLeading(36);      // 줄 간격
  textWrap(WORD);       // 단어 기준 줄바꿈

  let x = windowWidth / 4;
  let y = windowHeight / 6;
  let textBoxWidth = windowWidth / 2;

  // 각 문단 내용
  let paragraphs = [
    "김나영: 원하는 것을 AI가 다 구현해 줄 수 있을 것 같았는데 그렇지 않았음. 또한 기능들을 함수 단위로 나누고 합치는 것이 어려운 작업임을 느낌.",
    "문수현: 마우스와 키보드 이외의 새로운 인터렉션을 공부해 볼 수 있어서 유익했습니다.",
    "서예린: 한 학기동안 배운 것으로 하나의 작품을 만들어서 뿌듯하다",
    "AI를 이용해 제작한 콘텐츠: 모든 콘텐츠 / 마을 전체 화면, 산불, 수질 오염 등",
    "AI 사용 비율: 70% > AI를 사용해 기본적인 코드 틀을 잡은 뒤 위치, 색 등 디테일한 부분 직접 수정",
    "사용한 기능, 문법 사항: if문, for 문, loadImage, handPose, 배열, class 등"
  ];

  // 문단별 색상 (각각 다른 색)
  let colors = [
    color(255, 0, 0),      // 빨강
    color(0, 102, 204),    // 파랑
    color(0, 153, 0),      // 초록
    color(153, 51, 255),   // 보라
    color(255, 153, 0),    // 주황
    color(0)               // 검정
  ];

  // 문단 출력
  for (let i = 0; i < paragraphs.length; i++) {
    fill(colors[i]); // 문단별 색 설정
    text(paragraphs[i], x, y, textBoxWidth);

    // 현재 문단의 줄 수 추정
    let lines = ceil(textWidth(paragraphs[i]) / textBoxWidth);

    // 문단 간 간격 설정
    if (i === 0) {
      y += lines * 36 + 40; // 문단 띄기
    } else {
      y += lines * 36 + 20;
    }
  }

  //setTimeout(() => scene = 1, 5000);
}