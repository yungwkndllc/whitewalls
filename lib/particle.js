class Particle {
  constructor(_loc, _dir, _speed, _xBounds, _yBounds, _color) {
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.original = {
      x: _loc.x,
      y: _loc.y,
    };
    this.xBounds = _xBounds;
    this.yBounds = _yBounds;
    this.color = _color;
  }
  setIsUpperHalf(isUpperHalf) {
    this.isUpperHalf = isUpperHalf;
  }
  run() {
    this.update();
    this.checkEdges();
  }
  checkEdges() {
    if (
      this.loc.x < 0 ||
      this.loc.x > width ||
      this.loc.y < 0 ||
      this.loc.y > height
    ) {
      this.loc.x = R.random_dec(this.xBounds[0], this.xBounds[1]);
      this.loc.y = R.random_dec(this.yBounds[0], this.yBounds[1]);
    }
    if (
      this.loc.x > this.original.x + 10 ||
      this.loc.x < this.original.x - 10
    ) {
      this.loc.x = R.random_dec(this.xBounds[0], this.xBounds[1]);
      this.loc.y = R.random_dec(this.yBounds[0], this.yBounds[1]);
    }
  }
  update() {
    let color = R.random_choice(this.color);
    stroke(color);
    strokeWeight(mainStrokeWeight);

    let x1 = this.loc.x;
    let y1 = this.loc.y;

    for (let j = 0; j < 10; j++) {
      let angle =
        noise(this.loc.x / noiseScale, this.loc.y / noiseScale) *
        TWO_PI *
        noiseStrength;
      this.dir.x = cos(angle);
      this.dir.y = sin(angle);
      var vel = this.dir.copy();
      vel.mult(this.speed);
      this.loc.add(vel);
    }
    let x2 = this.loc.x;
    let y2 = this.loc.y;
    for (let j = 0; j < 10; j++) {
      let angle =
        noise(this.loc.x / noiseScale, this.loc.y / noiseScale) *
        TWO_PI *
        noiseStrength;
      this.dir.x = cos(angle);
      this.dir.y = sin(angle);
      var vel = this.dir.copy();
      vel.mult(this.speed);
      this.loc.add(vel);
    }
    let x3 = this.loc.x;
    let y3 = this.loc.y;
    for (let j = 0; j < 10; j++) {
      let angle =
        noise(this.loc.x / noiseScale, this.loc.y / noiseScale) *
        TWO_PI *
        noiseStrength;
      this.dir.x = cos(angle);
      this.dir.y = sin(angle);
      var vel = this.dir.copy();
      vel.mult(this.speed);
      this.loc.add(vel);
    }
    let x4 = this.loc.x;
    let y4 = this.loc.y;

    // Imagine diagonal line from bottom left to top right
    if (this.isUpperHalf !== undefined && this.isUpperHalf) {
      if (y1 > x1) {
        return;
      }
    } else if (this.isUpperHalf !== undefined && !this.isUpperHalf) {
      if (y1 < x1) {
        return;
      }
    }

    quad(x1, y1, x2, y2, x3, y3, x4, y4);
  }
}
