function drawMurakamiFlower(x, y, size) {
  translate(x, y);
  let petals = 12;
  let petalSize = size / 2;
  let colors = chosenPalette;

  const transparencyValue = getRandomHex();

  // Draw petals
  for (let i = 0; i < petals; i++) {
    let angle = (TWO_PI / petals) * i;
    let petalX = (cos(angle) * size) / 2;
    let petalY = (sin(angle) * size) / 2;
    fill(colors[i % colors.length] + transparencyValue);
    noStroke();
    ellipse(petalX, petalY, petalSize, petalSize);
  }

  // Draw center circle
  fill("#FFDC00" + transparencyValue);
  noStroke();
  ellipse(0, 0, size / 1.5, size / 1.5);

  // Draw face
  fill("#000000" + transparencyValue);
  ellipse(-size / 10, -size / 10, size / 15, size / 15); // Left eye
  ellipse(size / 10, -size / 10, size / 15, size / 15); // Right eye

  noFill();
  stroke("#000000" + transparencyValue);
  strokeWeight(size / 30);
  arc(0, size / 20, size / 6, size / 6, 0, PI); // Smile

  translate(-x, -y);
}

function DrawCuteLittleFlower(x, y, maxSize, growthRate, bgColor) {
  this.x = x;
  this.y = y;
  this.maxSize = maxSize;
  this.currSize = 0.05;
  this.growthRate = growthRate;
  this.rotationVal = 0;
  this.transparencyValue = getRandomHex();
  this.divider = 3;
  this.flowerWidth = 3;
  this.flowerHeight = 9;
  this.bgColor = bgColor;
  // Any color in chosenPalette except if it's same as bgColor
  this.flowerColor = R.random_choice(
    chosenPalette.filter((c) => c !== bgColor)
  );
  this.flowerCenterColor = R.random_choice(
    chosenPalette.filter((c) => c !== bgColor)
  );

  this.draw = function () {
    push();
    translate(this.x, this.y);
    ellipseMode(CENTER);
    noStroke();
    fill(this.flowerColor + this.transparencyValue);
    rotate(radians(this.rotationVal));

    push();
    ellipse(
      0,
      0,
      this.flowerWidth * this.currSize,
      this.flowerHeight * this.currSize
    );
    rotate(radians(360 / 3));
    ellipse(
      0,
      0,
      this.flowerWidth * this.currSize,
      this.flowerHeight * this.currSize
    );
    rotate(radians(360 / 3));
    ellipse(
      0,
      0,
      this.flowerWidth * this.currSize,
      this.flowerHeight * this.currSize
    );

    fill(this.flowerCenterColor + this.transparencyValue);
    ellipse(
      0,
      0,
      this.flowerWidth * this.currSize,
      this.flowerWidth * this.currSize
    );
    pop();

    pop();
  };

  this.update = function () {
    if (this.currSize >= this.maxSize) {
      this.currSize = this.maxSize;
      this.rotationVal += 0.4 + R.random_num(0, 1);
    } else {
      this.currSize += this.growthRate;
      this.rotationVal = this.currSize;
    }
  };
}

function DrawCubicFlower(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;

  this.drawFlower = () => {
    push();
    translate(this.x, this.y);
    let numPetals = int(R.random_int(5, 8));
    let angle = TWO_PI / numPetals;
    let petalColor = color(R.random_choice(chosenPalette) + getRandomHex());
    for (let i = 0; i < numPetals; i++) {
      let petalAngle = angle * i;
      drawPetal(petalAngle, this.size, petalColor);
    }
    pop();
  };

  function drawPetal(angle, size, petalColor) {
    push();
    rotate(angle);
    beginShape();
    for (let t = 0; t <= 1; t += 0.1) {
      let x = size * 0.6 * cos(TWO_PI * t) * (1 - t);
      let y = size * sin(TWO_PI * t);
      vertex(x, y);
    }
    endShape(CLOSE);

    // Apply gradient
    for (let t = 0; t <= 1; t += 0.05) {
      fill(lerpColor(petalColor, color(255, 255, 255, 0), t));
      beginShape();
      for (let u = 0; u <= 1; u += 0.1) {
        let x = size * 0.6 * cos(TWO_PI * u) * (1 - u) * (1 - t);
        let y = size * sin(TWO_PI * u) * (1 - t);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    pop();
  }
}
