const TIMER_DURATION_MS = 5 * 60 * 1000;
const TIMER_START_KEY = "timerStart";

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  textFont("Share Tech Mono");

  if (!sessionStorage.getItem(TIMER_START_KEY)) {
    sessionStorage.setItem(TIMER_START_KEY, String(Date.now()));
  }
}

function draw() {
  background(43, 79, 113);

  const timerStart = Number(sessionStorage.getItem(TIMER_START_KEY));
  const elapsed = Date.now() - timerStart;
  const remaining = TIMER_DURATION_MS - elapsed;

  if (!Number.isFinite(timerStart) || remaining <= 0) {
    sessionStorage.removeItem(TIMER_START_KEY);
    window.location.href = "time-up.html";
    return;
  }

  const totalSeconds = Math.ceil(remaining / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  const timeString = `${mins}:${String(secs).padStart(2, "0")}`;

  fill(196);
  text(timeString, width / 2, 100);

  const timerElement = document.getElementById("timer");
  if (timerElement) timerElement.textContent = timeString;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
