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
let queryStyle = urlParams.get("style");

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
let particles = [];

let bgColor;

let totalSize;
let borderSize;
let scaleFactor;

let traits = {};

function setup() {
  p5grain.setup();
  totalSize = min(windowWidth, windowHeight);
  scaleFactor = totalSize / 1000;
  borderSize = totalSize * 0.125; // 12.5% of the totalSize
  createCanvas(totalSize, totalSize);
  background(255);
  // noLoop(); // Stops draw from continuously looping
  rect(0, 0, width, height);
  chosenPalette = R.random_choice(allPalettes);

  style = queryStyle ? parseInt(queryStyle) : R.random_choice([1, 2, 3, 4]);
  bgColor = R.random_choice(chosenPalette);

  if (style === 2) {
    let density = R.random_num(1000, 2000);
    for (let i = 0; i < density; i++) {
      let x = R.random_num(0, width);
      let y = R.random_num(0, height);
      flower = new DrawCuteLittleFlower(
        x,
        y,
        R.random_num(3, 6),
        R.random_num(0.01, 0.2),
        bgColor
      );
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
  if (style === 4) {
    for (let i = 0; i < 10000; i++) {
      // Random Starting point
      let loc = createVector(R.random_num(0, width), R.random_num(0, height));
      // Direction of point (how it moves)
      let dir = createVector(0, 0);
      // Speed at which it moves
      let speed = 3;

      particles[i] = new Particle(
        loc,
        dir,
        speed,
        [0, width],
        [0, height],
        chosenPalette
      );
    }
  }

  traits.bleedOver = R.random_bool(0.1);
  traits.style =
    style === 1
      ? "Murakami"
      : style === 2
      ? "Cute"
      : style === 3
      ? "Cubic"
      : "Jagged";

  traits.grain = style === 2 ? false : R.random_bool(0.5);

  console.log("traits", traits);
}

let mainStrokeWeight = 10;
let noiseScale = 1000;
let noiseStrength = 10000;
function draw() {
  background(bgColor);
  let flowerLocs = [];
  let flowerSizes = [];
  if (style === 1) {
    for (let i = 0; i < 1000; i++) {
      let x = R.random_num(0, width);
      let y = R.random_num(0, height);
      flowerLocs.push([x, y]);
      let size = R.random_num(30, 100);
      flowerSizes.push(size);
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
  } else if (style === 4) {
    for (let i = 0; i < particles.length; i++) {
      particles[i].run();
    }
  }
  if (traits.grain && !traits.bleedOver) {
    p5grain.applyMonochromaticGrain(42);
  }

  fill("white");
  noStroke();
  rect(borderSize, borderSize, width - 2 * borderSize, height - 2 * borderSize);

  stroke("black");

  if (traits.bleedOver) {
    if (style === 1) {
      for (let i = 0; i < 1000; i++) {
        let [x, y] = flowerLocs[i];
        let size = flowerSizes[i];

        // If x,y is within 10 of the border rect, re-draw
        if (
          x < borderSize + 10 ||
          x > width - borderSize + 10 ||
          y < borderSize + 10 ||
          y > height - borderSize + 10
        ) {
          if (size < 70) {
            drawMurakamiFlower(x, y, size);
          }
        }
      }
    }

    if (style === 2) {
      for (let i = 0; i < flowers.length; i++) {
        let flower = flowers[i];

        // If x,y is within 10 of the border rect, re-draw
        if (
          flower.x < borderSize + 10 ||
          flower.x > width - borderSize + 10 ||
          flower.y < borderSize + 10 ||
          flower.y > height - borderSize + 10
        ) {
          flower.draw();
          flower.update();
        }
      }
    }

    if (style === 3) {
      for (let i = 0; i < flowers.length; i++) {
        let flower = flowers[i];

        // If x,y is within 10 of the border rect, re-draw
        if (
          flower.x < borderSize + 10 ||
          flower.x > width - borderSize + 10 ||
          flower.y < borderSize + 10 ||
          flower.y > height - borderSize + 10
        ) {
          if (flower.size < 70) {
            flower.drawFlower();
          }
        }
      }
    }

    if (style === 4) {
      for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];

        // If x,y is within 10 of the border rect, re-draw
        if (
          particle.loc.x < borderSize + 10 ||
          particle.loc.x > width - borderSize + 10 ||
          particle.loc.y < borderSize + 10 ||
          particle.loc.y > height - borderSize + 10
        ) {
          particles[i].run();
        }
      }
    }
  }

  if (style === 1 || style === 3 || style === 4) {
    noLoop();
  }
}
