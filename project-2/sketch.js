const TIMER_DURATION_MS = 5 * 60 * 1000;
const TIMER_START_KEY = "timerStart";
const WARNING_THRESHOLD_MS = 60 * 1000;
const QUESTION_BG_PATTERN = /question-(\d+)\.html$/;

document.addEventListener("DOMContentLoaded", initTimer);

function initTimer() {
  if (!sessionStorage.getItem(TIMER_START_KEY)) {
    sessionStorage.setItem(TIMER_START_KEY, String(Date.now()));
  }

  applyQuestionBackgroundKey();
  updateTimer();
  window.setInterval(updateTimer, 250);
}

function applyQuestionBackgroundKey() {
  const pathMatch = window.location.pathname.match(QUESTION_BG_PATTERN);

  if (pathMatch) {
    document.body.dataset.bg = `question-${pathMatch[1]}`;
  }
}

function updateTimer() {
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
  const isWarningState = remaining <= WARNING_THRESHOLD_MS;
  const timeString = `${mins}:${String(secs).padStart(2, "0")}`;

  const timerElement = document.getElementById("timer");

  if (timerElement) {
    timerElement.textContent = timeString;
    timerElement.style.color = isWarningState ? "#ff4d4d" : "#C4C4C4";
  }
}
