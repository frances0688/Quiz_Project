const homeNav = document.getElementById("homeNav");
const home = document.getElementById("home");
const categoriesNav =
	document.getElementById("categoriesNav");
const categories = document.getElementById("categories");
const playNav = document.getElementById("playNav");
const play = document.getElementById("play");
const resultsNav = document.getElementById("resultsNav");
const results = document.getElementById("results");
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById(
	"question-container"
);
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById(
	"answer-buttons"
);

// Questions

const questions = [
	{
		question: "What is 2 + 2?",
		answers: [
			{
				text: "4",
				correct: true,
			},
			{
				text: "22",
				correct: false,
			},
		],
	},
	{
		question: "Is web development fun?",
		answers: [
			{
				text: "Kinda",
				correct: false,
			},
			{
				text: "YES!!!",
				correct: true,
			},
			{
				text: "Um no",
				correct: false,
			},
			{
				text: "IDK",
				correct: false,
			},
		],
	},
	{
		question: "What is 4 * 2?",
		answers: [
			{
				text: "6",
				correct: false,
			},
			{
				text: "8",
				correct: true,
			},
			{
				text: "Yes",
				correct: false,
			},
		],
	},
];

// Hide Views
function hideView() {
	home.classList.add("hide");
	categories.classList.add("hide");
	play.classList.add("hide");
	results.classList.add("hide");
}

// Navigation Functions
function goHome() {
	hideView();
	home.classList.remove("hide");
}

function goCategories() {
	hideView();
	categories.classList.remove("hide");
}

function goPlay() {
	hideView();
	play.classList.remove("hide");
}

function goResults() {
	hideView();
	results.classList.remove("hide");
}

// Start Game
let currentQuestionIndex;

function startGame() {
	startButton.classList.add("hide");
	currentQuestionIndex = 0;
	questionContainerElement.classList.remove("hide");
	setNextQuestion();
}

// Show Question
function showQuestion(question) {
	questionElement.innerText = question.question;
	question.answers.forEach((answer) => {
		const button = document.createElement("button");
		button.innerText = answer.text;
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
}

// Set status class
function setStatusClass(element) {
	if (element.dataset.correct) {
		element.classList.add("correct");
	} else {
		element.classList.add("wrong");
	}
}

// Select answer
function selectAnswer() {
	Array.from(answerButtonsElement.children).forEach(
		(button) => {
			setStatusClass(button);
		}
	);
	if (questions.length > currentQuestionIndex + 1) {
		nextButton.classList.remove("hide");
	} else {
		startButton.innerText = "Restart";
		startButton.classList.remove("hide");
	}
}

// Reset
function resetState() {
	nextButton.classList.add("hide");
	answerButtonsElement.innerHTML = "";
}

homeNav.addEventListener("click", goHome);

categoriesNav.addEventListener("click", goCategories);

playNav.addEventListener("click", goPlay);

resultsNav.addEventListener("click", goResults);

startButton.addEventListener("click", startGame);

nextButton.addEventListener("click", () => {
	currentQuestionIndex++;
	setNextQuestion();
});
