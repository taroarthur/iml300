// p5.js — mirrored webcam + central random face-region pixel sampler

let cam;
let hexStr = "#000000";
let swatchCol;
let displayW = 640;
let displayH = 480;
let displayX = 0;
let displayY = 0;
let scale_ = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);

  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();

  calculateDisplay();

  textFont("monospace");
  textSize(18);
  swatchCol = color(0);
}

function calculateDisplay() {
  // Calculate scale to fit camera aspect ratio in window
  const camAspect = 640 / 480;
  const windowAspect = width / height;
  
  if (windowAspect > camAspect) {
    // Window is wider, fit to height
    scale_ = height / 480;
  } else {
    // Window is taller, fit to width
    scale_ = width / 640;
  }
  
  displayW = 640 * scale_;
  displayH = 480 * scale_;
  displayX = (width - displayW) / 2;
  displayY = (height - displayH) / 2;
}

function draw() {
  background(0);

  // --- MIRRORED WEBCAM ---
  push();
  translate(displayX + displayW, displayY);
  scale(-1, 1);          // horizontal mirror
  image(cam, 0, 0, displayW, displayH);
  pop();

  cam.loadPixels();
  if (!cam.pixels || cam.pixels.length < 4) return;

  // --- CENTRAL SAMPLING REGION ---
  const regionW = cam.width * 0.35;
  const regionH = cam.height * 0.45;

  const x0 = (cam.width - regionW) / 2;
  const y0 = (cam.height - regionH) / 2;

  // Random pixel inside central region (camera space)
  const x = floor(random(x0, x0 + regionW));
  const y = floor(random(y0, y0 + regionH));

  const idx = 4 * (y * cam.width + x);
  const r = cam.pixels[idx + 0];
  const g = cam.pixels[idx + 1];
  const b = cam.pixels[idx + 2];

  hexStr = rgbToHex(r, g, b);
  swatchCol = color(r, g, b);

  // --- DRAW SAMPLING GUIDES (MIRRORED TO MATCH DISPLAY) ---
  const mirroredX0 = width - (x0 + regionW);
  const mirroredX = width - x;

  drawSamplingGuides(mirroredX0, y0, regionW, regionH, mirroredX, y);

  // Overlay UI
  drawOverlay();
}

function drawSamplingGuides(x0, y0, regionW, regionH, x, y) {
  // Convert from camera space to display space
  const guideX0 = displayX + x0 * scale_;
  const guideY0 = displayY + y0 * scale_;
  const guideW = regionW * scale_;
  const guideH = regionH * scale_;
  const guideX = displayX + x * scale_;
  const guideY = displayY + y * scale_;

  noFill();
  stroke(255, 180);
  strokeWeight(2);
  rect(guideX0, guideY0, guideW, guideH);

  stroke(255);
  rect(guideX - 4, guideY - 4, 8, 8);
}

function drawOverlay() {
  const pad = 14;
  const sw = 54;
  const boxW = 260;
  const boxH = 92;

  noStroke();
  fill(0, 160);
  rect(pad, pad, boxW, boxH, 10);

  fill(swatchCol);
  rect(pad + 12, pad + 18, sw, sw, 8);

  fill(255);
  textAlign(LEFT, CENTER);
  text(hexStr, pad + 12 + sw + 14, pad + 42);

  textSize(12);
  fill(255, 200);
  text("sampling central region (mirrored)", pad + 12 + sw + 14, pad + boxH - 20);
  textSize(18);
}

function rgbToHex(r, g, b) {
  return "#" + to2(r) + to2(g) + to2(b);
}

function to2(v) {
  return hex(v, 2).toUpperCase();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateDisplay();
}