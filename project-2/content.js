const TOTAL_OPTIONS = 4;

const STORAGE_KEYS = {
  correctCount: "correctCount",
  previousWasCorrect: "previousWasCorrect"
};

document.addEventListener("DOMContentLoaded", initGame);

async function initGame() {
  try {
    const response = await fetch("questions.json");

    if (!response.ok) {
      throw new Error(`Failed to load questions.json (${response.status})`);
    }

    const data = await response.json();
    const questions = Array.isArray(data.questions) ? data.questions : [];
    const currentQuestionIndex = getCurrentQuestionIndex();

    if (!Number.isFinite(currentQuestionIndex)) {
      console.error("Unable to determine the current question index from the page.");
      return;
    }

    let correctCount = Number(localStorage.getItem(STORAGE_KEYS.correctCount));
    if (!Number.isFinite(correctCount)) correctCount = 0;

    const previousRaw = localStorage.getItem(STORAGE_KEYS.previousWasCorrect);
    const previousWasCorrect = previousRaw === null ? null : previousRaw === "true";

    if (currentQuestionIndex >= questions.length) {
      finishGame(correctCount, questions.length);
      return;
    }

    const questionData = questions[currentQuestionIndex];

    if (!questionData) {
      console.error(`No question data found for index ${currentQuestionIndex}.`);
      return;
    }

    renderQuestion(questionData, previousWasCorrect, questions.length, currentQuestionIndex);
  } catch (error) {
    console.error("Unable to initialize question content.", error);
    return;
  }
}

function getCurrentQuestionIndex() {
  const dataIndex = Number(document.body.dataset.questionIndex);
  if (Number.isFinite(dataIndex)) {
    return dataIndex;
  }

  const pathMatch = window.location.pathname.match(/question-(\d+)\.html$/);
  if (pathMatch) {
    return Number(pathMatch[1]) - 1;
  }

  const mainEl = document.querySelector("main");
  if (!mainEl) {
    return NaN;
  }

  const classMatch = [...mainEl.classList]
    .map(className => className.match(/^question-(\d+)$/))
    .find(Boolean);

  return classMatch ? Number(classMatch[1]) - 1 : NaN;
}

function renderQuestion(questionData, previousWasCorrect, totalQuestions, currentQuestionIndex) {
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
      handleAnswer(option.isCorrect, totalQuestions, currentQuestionIndex);
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

function handleAnswer(isCorrect, totalQuestions, currentQuestionIndex) {
  let correctCount = Number(localStorage.getItem(STORAGE_KEYS.correctCount));
  if (!Number.isFinite(correctCount)) correctCount = 0;

  if (isCorrect) {
    correctCount += 1;
  }

  localStorage.setItem(STORAGE_KEYS.correctCount, String(correctCount));
  localStorage.setItem(STORAGE_KEYS.previousWasCorrect, String(isCorrect));

  // If this was the last question, finish.
  if (currentQuestionIndex + 1 >= totalQuestions) {
    finishGame(correctCount, totalQuestions);
  } else {
    const nextPageNumber = currentQuestionIndex + 2;
    window.location.href = `question-${nextPageNumber}.html`;
  }
}

function finishGame(correctCount, totalQuestions) {
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
