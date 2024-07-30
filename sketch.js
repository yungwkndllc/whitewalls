//// TO BE REMOVED ////

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

let X_WIDTH = 400;
let Y_HEIGHT = 600;

const THANK_YOUS = [
  "gracias ",
  "thank you ",
  "merci ",
  "danke ",
  "obrigado ",
  "arigato ",
  "shukran ",
  "dhanyavaad ",
  "spasibo ",
  "grazie ",
  "takk ",
  "köszönöm ",
  "toda ",
  "tak ",
  "kamsahamnida ",
  "xie xie ",
];

let flaps = [];

let SIZE = 80;
let v = [];
let cols = 600,
  rows = 10;

let t_D = (180 * 15) / cols;
let r_D = 1 / rows;

let opening = 3,
  vDensity = 8,
  pAlign = 3.9,
  curve1 = 2,
  curve2 = 1.3;
let opening_, vDensity_, pAlign_, curve1_, curve2_;

let fonts = [];
function preload() {
  // fonts.push(loadFont("data/BritneyOnchainVF.ttf"));
  fonts.push(loadFont("data/Savior1.ttf"));
  fonts.push(loadFont("data/SpecialElite-Regular.ttf"));
}

let offscreenGraphics;

let q = 2,
  p = 8,
  a = 100;
let degree;

let capturedImage;
let textureBg;

let hatch_brushes = ["marker"];
let stroke_brushes = ["charcoal"];

let bgImg;

let twinTraits = {};
// Get the "twin" mint
const twinHash = urlParams.get("twin");
if (twinHash) {
  // Calculate the twin's traits
  let twinData = tokenData;
  twinData.hash = twinHash;

  // Make an R for the twin data
  let R_twin = new Random(twinData);

  // Go through as if it is setup for twin..
  twinTraits = {
    bgPalette: [],
    boxBg: "",
  };

  twinTraits.bgPalette = R_twin.random_choice(allPalettes);
  if (R_twin.random_bool(90)) {
    twinTraits.boxBg = R_twin.random_choice(twinTraits.bgPalette);
  } else {
    twinTraits.boxBg = "transparent";
  }
  twinTraits.offScreenStroke = R_twin.random_choice(["black", "white"]);
  twinTraits.language = R_twin.random_choice(THANK_YOUS);
  twinTraits.font = R_twin.random_choice(fonts);
  twinTraits.fontSize = R_twin.random_int(30, 80);
}

let traits = {
  bgPalette: twinHash ? twinTraits.bgPalette : [],
  boxBg: "",
};

function setup() {
  frameRate(10);
  createCanvas(X_WIDTH, Y_HEIGHT, WEBGL);
  offscreenGraphics = createGraphics(
    windowWidth * 0.5,
    (windowWidth * 0.5 * 1) / 1,
    WEBGL
  );

  // TRAITS //
  if (!twinHash) {
    traits.bgPalette = R.random_choice(allPalettes);
  }
  if (R.random_bool(90)) {
    traits.boxBg = R.random_choice(traits.bgPalette);
    offscreenGraphics.background(traits.boxBg);
  } else {
    traits.boxBg = "transparent";
  }
  traits.offScreenStroke = R.random_choice(["black", "white"]);
  traits.language = R.random_choice(THANK_YOUS);
  traits.font = R.random_choice(fonts);
  traits.fontSize = R.random_int(30, 80);

  // TRAITS //

  bgImage = createImage(X_WIDTH, Y_HEIGHT);

  offscreenGraphics.angleMode(DEGREES);

  offscreenGraphics.translate(
    -offscreenGraphics.width / 2,
    -offscreenGraphics.height / 2
  );

  offscreenGraphics.stroke(traits.offScreenStroke);
  offscreenGraphics.noFill();

  // offscreenGraphics.translate(width / 8, height / 8);

  // Draw a border
  // offscreenGraphics.rect(0, 0, (width / 8) * 6, (height / 8) * 6);

  offscreenGraphics.fill(traits.offScreenStroke);
  offscreenGraphics.textFont(traits.font);

  const rows = Math.floor(offscreenGraphics.width / traits.fontSize);
  const rowSize = offscreenGraphics.width / rows;
  const colSize = offscreenGraphics.height / rows;

  // Divide the border rect into a grid and draw a circle in the center of each cell
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      // Draw a rect in the center of the cell
      offscreenGraphics.noFill();
      // rect(0, 0, rowSize, colSize);
      offscreenGraphics.textSize(traits.fontSize);
      let letter = traits.language[(i * 5 + j) % traits.language.length];
      offscreenGraphics.fill(traits.offScreenStroke);
      offscreenGraphics.textAlign(LEFT, TOP);
      offscreenGraphics.text(letter, rowSize / 6, 0);

      offscreenGraphics.translate(rowSize, 0);
    }
    offscreenGraphics.translate(-rowSize * rows, colSize);
  }

  offscreenGraphics.textSize(10);

  brush.seed(tokenData.hash);

  // Draw the background 10 times...
  for (let i = 0; i < 20; i++) {
    brush.noField();

    brush.fill(R.random_choice(traits.bgPalette), R.random_int(60, 100));
    brush.bleed(R.random_num(0.1, 0.4));
    brush.fillTexture(0.55, 0.8);
    brush.set(
      R.random_choice(stroke_brushes),
      R.random_choice(traits.bgPalette)
    );
    brush.setHatch(
      R.random_choice(hatch_brushes),
      R.random_choice(traits.bgPalette)
    );
    brush.hatch(R.random_int(10, 60), R.random_int(0, 180), {
      rand: 0,
      continuous: false,
      gradient: false,
    });
    brush.rect(0, 0, width * 2, height * 2);
  }

  capturedImage = get();

  console.log("Traits:", traits);
}

function draw() {
  if (frameCount > 1) {
    // noLoop();
  }
  image(capturedImage, -width / 2, -height / 2);
  // orbitControl();

  translate(0, 0, 200);
  rotateX(frameCount * 0.03);
  rotateY(frameCount * 0.03);
  rotateZ(frameCount * 0.03);

  // rotateX(-PI / 4);
  texture(offscreenGraphics);

  box(100);

  texture(capturedImage);

  translate(0, -5, 0);
  box(10, 115, 115);
  box(106, 10, 106);
  box(115, 115, 10);

  translate(0, -50, 0);
  box(110, 10, 110);
  translate(0, 10, 0);

  scale(0.15);

  noStroke();

  for (let r = 0; r <= rows; r++) {
    v.push([]);
    for (let theta = 0; theta <= cols; theta++) {
      let phi = (180 / opening) * Math.exp((-theta * t_D) / (vDensity * 180));
      let petalCut =
        1 -
        (1 / 2) *
          pow(
            (5 / 4) * pow(1 - ((pAlign * theta * t_D) % 360) / 180, 2) - 1 / 4,
            2
          );
      let hangDown =
        curve1 * pow(r * r_D, 2) * pow(curve2 * r * r_D - 1, 2) * sin(phi);

      let pX =
        260 *
        petalCut *
        (r * r_D * sin(phi) + hangDown * cos(phi)) *
        sin(theta * t_D);
      let pY = -260 * petalCut * (r * r_D * cos(phi) - hangDown * sin(phi));
      let pZ =
        260 *
        petalCut *
        (r * r_D * sin(phi) + hangDown * cos(phi)) *
        cos(theta * t_D);

      let pos = createVector(pX, pY, pZ);
      v[r].push(pos);
    }
  }
  colorMode(HSB);
  resetShader();
  for (let r = 0; r < v.length; r++) {
    fill(0, 0, -20 + r * r_D * 120, frameCount / 200);
    for (let theta = 0; theta < v[r].length; theta++) {
      if (r < v.length - 1 && theta < v[r].length - 1) {
        beginShape();
        vertex(v[r][theta].x, v[r][theta].y, v[r][theta].z);
        vertex(v[r + 1][theta].x, v[r + 1][theta].y, v[r + 1][theta].z);
        vertex(
          v[r + 1][theta + 1].x,
          v[r + 1][theta + 1].y,
          v[r + 1][theta + 1].z
        );
        vertex(v[r][theta + 1].x, v[r][theta + 1].y, v[r][theta + 1].z);
        endShape(CLOSE);
      }
    }
  }

  v = [];
  colorMode(RGB);
}
