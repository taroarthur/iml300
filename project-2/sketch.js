let duration = 5 * 60 * 1000;
const END_KEY = "end_key";

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  textFont("Share Tech Mono");

  const isStartPage = document.body.classList.contains("start-timer");

  let endTime = Number(localStorage.getItem(END_KEY));


  if (isStartPage) {
    endTime = Date.now() + duration;
    localStorage.setItem(END_KEY, String(endTime));
    return;
  }


  if (!Number.isFinite(endTime)) {
    endTime = Date.now() + duration;
    localStorage.setItem(END_KEY, String(endTime));
  }
}

function draw() {
  background(43, 79, 113);

  const endTime = Number(localStorage.getItem(END_KEY));
  const remaining = endTime - Date.now();

  if (!Number.isFinite(endTime) || remaining <= 0) {
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