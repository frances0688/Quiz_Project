const homeNav = document.getElementById("homeNav");
const home = document.getElementById("home");
const categoriesNav =
	document.getElementById("categoriesNav");
const categories = document.getElementById("categories");
const play = document.getElementById("play");
const resultsNav = document.getElementById("resultsNav");
const results = document.getElementById("results");
const nameInput = document.getElementById("nameInput");
const homeBtn = document.getElementById("homeBtn");
const nameText = document.getElementById("nameText");
const progressBar = document.querySelector(".progress-bar");
const progressBarDiv =
	document.getElementById("progressBar");
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById(
	"question-container"
);
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById(
	"answer-buttons"
);
const scoreText = document.getElementById("scoreText");
const restartBtn = document.getElementById("restart-btn");

// Categories
let chosenCategory;

function selectCategory(value) {
	chosenCategory = value;
	goPlay();
	getQuestions(chosenCategory);
}

// Get Questions & Answers
let questions = [];

function shuffle(array) {
	return array.sort(() => Math.random() - 0.5);
}

function getQuestions(chosenCategory) {
	questions = [];
	axios
		.get(
			`https://opentdb.com/api.php?amount=10&category=${chosenCategory}&type=multiple`
		)
		.then((res) => {
			questionsArray = res.data.results;
			questionsArray.forEach((question) => {
				const incorrectAnswers = question.incorrect_answers;
				question = {
					question: question.question,
					answers: [
						{
							text: question.correct_answer,
							correct: true,
						},
					],
				};
				incorrectAnswers.forEach((answer) => {
					question.answers.push({
						text: answer,
						correct: false,
					});
				});
				question.answers = shuffle(question.answers);
				questions.push(question);
			});
		})
		.catch((err) => console.error(err));
}

/*
	SPA
		*/

//Hide Views
function hideView() {
	home.classList.add("d-none");
	categories.classList.add("d-none");
	play.classList.add("d-none");
	results.classList.add("d-none");
}

// Navigation Functions
function goHome() {
	hideView();
	home.classList.remove("d-none");
}

function goCategories() {
	hideView();
	chosenCategory = "";
	nameText.innerHTML = `Hi ${nameInput.value}!`;
	categories.classList.remove("d-none");
}

function goPlay() {
	hideView();
	play.classList.remove("d-none");
	startButton.classList.remove("d-none");
	progressBarDiv.classList.add("d-none");
	questionContainerElement.classList.add("d-none");
	answerButtonsElement.classList.add("d-none");
}

function goResults() {
	hideView();
	results.classList.remove("d-none");
	scoreText.innerHTML = `${score}/10`;
}

// Start Game
let currentQuestionIndex;
let score = 0;
let progress = -10;

function startGame() {
	startButton.classList.add("d-none");
	currentQuestionIndex = 0;
	progressBar.setAttribute("style", `width: ${progress}%`);
	questionContainerElement.classList.remove("d-none");
	answerButtonsElement.classList.remove("d-none");
	progressBarDiv.classList.remove("d-none");
	setNextQuestion();
}

// Show Question
function showQuestion(question) {
	questionElement.innerHTML = question.question;
	question.answers.forEach((answer) => {
		const button = document.createElement("button");
		button.innerHTML = answer.text;
		button.classList.add("btn", "btn-secondary", "w-100");
		if (answer.correct) {
			button.dataset.correct = true;
		}
		button.addEventListener("click", selectAnswer);
		answerButtonsElement.appendChild(button);
	});
}

// Set Next Question
function setNextQuestion() {
	resetState();
	showQuestion(questions[currentQuestionIndex]);
	progressBar.setAttribute(
		"style",
		`width: ${(progress += 10)}%`
	);
}

// Set status class
function setStatusClass(element) {
	if (element.dataset.correct) {
		element.classList.add("btn-success");
	} else {
		element.classList.add("btn-light");
	}
}

// Select answer
function selectAnswer(e) {
	e.target.dataset.correct ? (score += 1) : null;
	console.log(score);
	Array.from(answerButtonsElement.children).forEach(
		(button) => {
			setStatusClass(button);
			button.classList.add("disabled");
		}
	);
	if (questions.length > currentQuestionIndex + 1) {
		nextButton.classList.remove("d-none");
	} else {
		progressBar.setAttribute(
			"style",
			`width: ${(progress += 10)}%`
		);
		setTimeout(goResults, 2000);
	}
}

// Reset
function resetState() {
	nextButton.classList.add("d-none");
	answerButtonsElement.innerHTML = "";
}

//Restart Game
function restart() {
	score = 0;
	progress = -10;
	progressBar.removeAttribute("style");
	goCategories();
}

// Event Listeners
homeNav.addEventListener("click", goHome);

categoriesNav.addEventListener("click", goCategories);

resultsNav.addEventListener("click", goResults);

homeBtn.addEventListener("click", goCategories);

startButton.addEventListener("click", startGame);

nextButton.addEventListener("click", () => {
	currentQuestionIndex++;
	setNextQuestion();
});

restartBtn.addEventListener("click", restart);
