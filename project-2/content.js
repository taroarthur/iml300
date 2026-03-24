const TOTAL_OPTIONS = 4;

const STORAGE_KEYS = {
  questionIndex: "currentQuestionIndex",
  correctCount: "correctCount",
  previousWasCorrect: "previousWasCorrect"
};

document.addEventListener("DOMContentLoaded", initGame);

async function initGame() {
  const response = await fetch("questions.json");
  const data = await response.json();
  const questions = data.questions;

  let currentQuestionIndex = Number(localStorage.getItem(STORAGE_KEYS.questionIndex));
  if (!Number.isFinite(currentQuestionIndex)) currentQuestionIndex = 0;

  let correctCount = Number(localStorage.getItem(STORAGE_KEYS.correctCount));
  if (!Number.isFinite(correctCount)) correctCount = 0;

  const previousRaw = localStorage.getItem(STORAGE_KEYS.previousWasCorrect);
  const previousWasCorrect = previousRaw === null ? null : previousRaw === "true";

  if (currentQuestionIndex >= questions.length) {
    finishGame(correctCount, questions.length);
    return;
  }

  const questionData = questions[currentQuestionIndex];
  renderQuestion(questionData, previousWasCorrect, questions.length);
}

function renderQuestion(questionData, previousWasCorrect, totalQuestions) {
  const questionEl = document.getElementById("question");
  const optionEls = document.querySelectorAll(".option");

  questionEl.textContent = questionData.question;

  const numCorrectToShow = getCorrectCountForThisQuestion(questionData, previousWasCorrect);
  const numIncorrectToShow = TOTAL_OPTIONS - numCorrectToShow;

  const selectedCorrect = sample(questionData.correctAnswers, numCorrectToShow)
    .map(text => ({ text, isCorrect: true }));

  const selectedIncorrect = sample(questionData.incorrectAnswers, numIncorrectToShow)
    .map(text => ({ text, isCorrect: false }));

  const finalOptions = shuffle([...selectedCorrect, ...selectedIncorrect]);

  optionEls.forEach((el, index) => {
    const option = finalOptions[index];

    el.textContent = option.text;
    el.dataset.correct = option.isCorrect ? "true" : "false";
    el.href = "#";

    el.onclick = (e) => {
      e.preventDefault();
      handleAnswer(option.isCorrect, totalQuestions);
    };
  });
}

function getCorrectCountForThisQuestion(questionData, previousWasCorrect) {
  const logic = questionData.populationLogic;

  if (logic.mode === "fixed") {
    return logic.correctOptionsToShow;
  }

  if (previousWasCorrect === null) {
    return logic.ifPreviousCorrect;
  }

  return previousWasCorrect
    ? logic.ifPreviousCorrect
    : logic.ifPreviousIncorrect;
}

function handleAnswer(isCorrect, totalQuestions) {
  let currentQuestionIndex = Number(localStorage.getItem(STORAGE_KEYS.questionIndex));
  if (!Number.isFinite(currentQuestionIndex)) currentQuestionIndex = 0;

  let correctCount = Number(localStorage.getItem(STORAGE_KEYS.correctCount));
  if (!Number.isFinite(correctCount)) correctCount = 0;

  if (isCorrect) {
    correctCount += 1;
  }

  currentQuestionIndex += 1;

  localStorage.setItem(STORAGE_KEYS.questionIndex, String(currentQuestionIndex));
  localStorage.setItem(STORAGE_KEYS.correctCount, String(correctCount));
  localStorage.setItem(STORAGE_KEYS.previousWasCorrect, String(isCorrect));

  if (currentQuestionIndex >= totalQuestions) {
    finishGame(correctCount, totalQuestions);
  } else {
    window.location.href = "question.html";
  }
}

function finishGame(correctCount, totalQuestions) {
  localStorage.removeItem(STORAGE_KEYS.questionIndex);
  localStorage.removeItem(STORAGE_KEYS.previousWasCorrect);

  if (correctCount === totalQuestions) {
    localStorage.removeItem(STORAGE_KEYS.correctCount);
    localStorage.removeItem("end_key");
    window.location.href = "success.html";
  } else {
    localStorage.removeItem(STORAGE_KEYS.correctCount);
    localStorage.removeItem("end_key");
    window.location.href = "failure.html";
  }
}

function sample(arr, count) {
  return shuffle([...arr]).slice(0, count);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}