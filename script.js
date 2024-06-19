const startCard = document.getElementById("startCard");
const startQuizBtn = document.getElementById("startQuiz");
const quizContainer = document.getElementById("quizContainer");
const endCard = document.getElementById("endCard");
const questionEl = document.getElementById("question");
const answerBtns = document.querySelectorAll(".answer");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("finalScore");
const playAgainBtn = document.getElementById("playAgain");

let currentQuestionData;
let score = 0;
let timer;
let timeLeft = 60;

startQuizBtn.addEventListener("click", startQuiz);
playAgainBtn.addEventListener("click", resetQuiz);

answerBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    checkAnswer(btn.innerText);
  });
});

function startQuiz() {
  startCard.style.display = "none";
  quizContainer.style.display = "block";
  score = 0;
  scoreEl.innerText = score;
  timeLeft = 60;
  timerEl.innerText = timeLeft;
  loadQuestion();
  timer = setInterval(updateTimer, 1000);
}

function loadQuestion() {
  fetch("https://opentdb.com/api.php?amount=1&type=multiple")
    .then((response) => response.json())
    .then((data) => {
      const questionData = data.results[0];
      currentQuestionData = {
        question: questionData.question,
        answers: shuffleAnswers([
          questionData.correct_answer,
          ...questionData.incorrect_answers,
        ]),
        correct: questionData.correct_answer,
      };
      displayQuestion();
    })
    .catch((error) => {
      console.error("Error fetching quiz data:", error);
      alert("Failed to load quiz data. Please try again later.");
    });
}

function displayQuestion() {
  questionEl.innerHTML = currentQuestionData.question;
  answerBtns.forEach((btn, index) => {
    btn.innerText = currentQuestionData.answers[index];
  });
}

function checkAnswer(answer) {
  if (answer === currentQuestionData.correct) {
    score += 10; // Increase score by 10 for correct answer
    scoreEl.innerText = score;
  }
  loadQuestion();
}

function updateTimer() {
  timeLeft--;
  timerEl.innerText = timeLeft;
  if (timeLeft <= 0) {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timer);
  quizContainer.style.display = "none";
  endCard.style.display = "block";
  finalScoreEl.innerText = score;
}

function resetQuiz() {
  endCard.style.display = "none";
  startCard.style.display = "block";
}

function shuffleAnswers(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
