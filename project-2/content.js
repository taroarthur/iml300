const DEFAULT_TOTAL_OPTIONS = 4;

const STORAGE_KEYS = {
  correctCount: "correctCount",
  previousWasCorrect: "previousWasCorrect",
  timerStart: "timerStart"
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
  const optionEls = [...document.querySelectorAll(".option")];
  const optionsContainer = document.getElementById("options");

  questionEl.textContent = questionData.question;
  questionEl.classList.toggle("typewriter", questionData.type === "text");

  if (optionsContainer) {
    optionsContainer.dataset.questionType = questionData.type;
  }

  const totalOptions = getTotalOptionsForQuestion(questionData);
  const numCorrectToShow = Math.min(
    getCorrectCountForThisQuestion(questionData, previousWasCorrect),
    questionData.correctAnswers.length
  );
  const numIncorrectToShow = Math.min(
    totalOptions - numCorrectToShow,
    questionData.incorrectAnswers.length
  );

  const selectedCorrect = sample(questionData.correctAnswers, numCorrectToShow)
    .map(value => ({ value, isCorrect: true }));

  const selectedIncorrect = sample(questionData.incorrectAnswers, numIncorrectToShow)
    .map(value => ({ value, isCorrect: false }));

  const finalOptions = shuffle([...selectedCorrect, ...selectedIncorrect]);

  optionEls.forEach((el, index) => {
    const option = finalOptions[index];

    if (!option) {
      el.hidden = true;
      el.onclick = null;
      el.removeAttribute("data-correct");
      el.removeAttribute("href");
      el.replaceChildren();
      return;
    }

    el.hidden = false;
    el.classList.toggle("image-option", questionData.type === "image-select");
    el.dataset.correct = option.isCorrect ? "true" : "false";
    el.href = "#";
    renderOptionContent(el, option.value, questionData.type);

    el.onclick = (e) => {
      e.preventDefault();
      handleAnswer(option.isCorrect, totalQuestions, currentQuestionIndex);
    };
  });
}

function getTotalOptionsForQuestion(questionData) {
  if (questionData.type === "image-select") {
    return questionData.correctAnswers.length + questionData.incorrectAnswers.length;
  }

  return DEFAULT_TOTAL_OPTIONS;
}

function renderOptionContent(optionEl, value, questionType) {
  optionEl.replaceChildren();

  if (questionType === "image-select") {
    const image = document.createElement("img");
    image.src = value;
    image.alt = "Question option image";
    image.className = "option-image";
    optionEl.appendChild(image);
    return;
  }

  optionEl.textContent = value;
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
    sessionStorage.removeItem(STORAGE_KEYS.timerStart);
    window.location.href = "success.html";
  } else {
    localStorage.removeItem(STORAGE_KEYS.correctCount);
    sessionStorage.removeItem(STORAGE_KEYS.timerStart);
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
