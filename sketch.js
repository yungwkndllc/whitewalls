function genTokenData(projectNum) {
  let data = {};
  let hash = "0x";

  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }

  data.hash = hash;
  data.tokenId = (
    projectNum * 1000000 +
    Math.floor(Math.random() * 1000)
  ).toString();

  return data;
}

// Get hash from query string
let urlParams = new URLSearchParams(window.location.search);
let hash = urlParams.get("hash");

let tokenData = genTokenData(123);

// If hash is provided in query string, use that
if (hash) {
  tokenData.hash = hash;
}

//// TO BE REMOVED ////

let R = new Random(tokenData);

let chosenPalette = murakamiPalette;

let style = 1;
let flowers = [];

let bgColor;

let totalSize;
let borderSize;
let scaleFactor;

function setup() {
  totalSize = min(windowWidth, windowHeight);
  scaleFactor = totalSize / 1000;
  borderSize = totalSize * 0.125; // 12.5% of the totalSize
  createCanvas(totalSize, totalSize);
  background(255);
  // noLoop(); // Stops draw from continuously looping
  rect(0, 0, width, height);
  chosenPalette = R.random_choice(allPalettes);

  style = R.random_choice([1, 2, 3]);

  if (style === 2) {
    for (let i = 0; i < 1000; i++) {
      let x = R.random_num(0, width);
      let y = R.random_num(0, height);
      flower = new DrawCuteLittleFlower(x, y, 5, 0.1);
      flowers.push(flower);
    }
  }
  if (style === 3) {
    for (let i = 0; i < 500; i++) {
      let x = R.random_num(0, width);
      let y = R.random_num(0, height);
      flower = new DrawCubicFlower(x, y, R.random_num(50, 100));
      flowers.push(flower);
    }
  }

  bgColor = R.random_choice(chosenPalette);
}

function draw() {
  background(bgColor);

  if (style === 1) {
    for (let i = 0; i < 1000; i++) {
      let x = R.random_num(0, width);
      let y = R.random_num(0, height);
      let size = R.random_num(30, 100);
      drawMurakamiFlower(x, y, size);
    }
  } else if (style === 2) {
    for (let flower of flowers) {
      flower.draw();
      flower.update();
    }
  } else if (style === 3) {
    for (let flower of flowers) {
      flower.drawFlower();
    }
  }
  fill("white");
  rect(borderSize, borderSize, width - 2 * borderSize, height - 2 * borderSize);
  if (style === 1 || style === 3) {
    noLoop();
  }
}
