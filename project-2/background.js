function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("position", "fixed");
  canvas.style("z-index", "0");
  canvas.style("pointer-events", "none");
}

function draw() {
  drawGradient();
}

function drawGradient() {
  clear();

  let bg = document.body.dataset.bg || "default";

  if (bg === "question-1") {
    vertical(
      color(10, 10 + 0.05 * mouseX, 10),
      color(43 + 0.05 * mouseY, 79, 113 + 0.05 * mouseX)
    );
  } else if (bg === "question-2") {
    vertical(
      color(20, mouseY + 0.03 * mouseX, 30),
      color(70, 40 + 0.05 * mouseY, 110)
    );
  } else if (bg === "question-3") {
    vertical(
      color(15, 25, 15 + 0.04 * mouseX),
      color(40, 90, 70 + 0.04 * mouseY)
    );
  } else if (bg === "question-4") {
    vertical(
      color(25, 10, 25 + 0.03 * mouseX),
      color(90, 70, 120 + 0.03 * mouseY)
    );
  } else if (bg === "question-5") {
    vertical(
      color(30, 20 + 0.03 * mouseX, 10),
      color(120, 80, 40 + 0.02 * mouseY)
    );
  } else if (bg === "question-6") {
    vertical(
      color(12, 12, 20 + 0.04 * mouseX),
      color(60, 70 + 0.03 * mouseY, 100)
    );
  } else if (bg === "question-7") {
    vertical(
      color(8, 8, 8 + 0.02 * mouseX),
      color(50, 60, 80 + 0.03 * mouseY)
    );
  } else if (bg === "question-8") {
    vertical(
      color(18, 18 + 0.03 * mouseX, 22),
      color(80, 100, 120 + 0.03 * mouseY)
    );
  } else if (bg === "question-9") {
    vertical(
      color(30, 30 + 0.04 * mouseX, 40),
      color(120, 130, 150 + 0.03 * mouseY)
    );
  } else if (bg === "question-10") {
    vertical(
      color(10, 20 + 0.03 * mouseX, 15),
      color(40, 90 + 0.04 * mouseY, 60)
    );
  } else {
    vertical(
      color(14 + mouseX, 14, 14),
      color(43, 79, 113)
    );
  }
}

function vertical(top, bottom) {
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let c = lerpColor(top, bottom, t);
    stroke(c);
    line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}