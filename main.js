const homeNav = document.getElementById("homeNav");
const home = document.getElementById("home");
const categoriesNav =
	document.getElementById("categoriesNav");
const categories = document.getElementById("categories");
const playNav = document.getElementById("playNav");
const play = document.getElementById("play");
const resultsNav = document.getElementById("resultsNav");
const results = document.getElementById("results");
const name = document.getElementById("name");
const homeBtn = document.getElementById("homeBtn");
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
const user = {
	name: "",
	results: [
		{
			category: "",
			score: 0,
			date: Date(),
		},
	],
};

// Save User to Local Storage
function createDataObject(e) {
	e.preventDefault();
	user.name = name.value;
	localStorage.user = JSON.stringify(user);
	goCategories();
}

homeBtn.addEventListener("click", createDataObject);

// Categories
const categoriesData = [];
let chosenCategory;

axios
	.get("https://opentdb.com/api_category.php")
	.then((res) => {
		const categoriesArray = res.data.trivia_categories;
		categoriesArray.forEach((category) => {
			categoriesData.push(category);
		});
	})
	.catch((err) => console.error(err));

function selectCategory(e) {
	chosenCategory = e.target.value;
	goPlay();
	getQuestions(chosenCategory);
}

function showCategories(categoriesData) {
	categoriesData.forEach((category) => {
		const button = document.createElement("button");
		button.innerHTML = category.name;
		button.setAttribute("value", category.id);
		categories.appendChild(button);
		button.addEventListener("click", selectCategory);
	});
}

// Get Questions & Answers
const questions = [];

function shuffle(array) {
	return array.sort(() => Math.random() - 0.5);
}

function getQuestions(chosenCategory) {
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
	categories.classList.remove("d-none");
	showCategories(categoriesData);
}

function goPlay() {
	hideView();
	play.classList.remove("d-none");
}

function goResults() {
	hideView();
	results.classList.remove("d-none");
	scoreText.innerHTML = `${score}/10`;
}

// Start Game
let currentQuestionIndex;
let currentSession;
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
		button.classList.add("btn", "btn-secondary");
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
		}
	);
	if (questions.length > currentQuestionIndex + 1) {
		nextButton.classList.remove("d-none");
	} else {
		setTimeout(goResults, 3000);
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
	categories.innerHTML = "";
	resetState();
	results.classList.add("d-none");
	goCategories();
}

// Event Listeners
homeNav.addEventListener("click", goHome);

categoriesNav.addEventListener("click", goCategories);

playNav.addEventListener("click", goPlay);

resultsNav.addEventListener("click", goResults);

startButton.addEventListener("click", startGame);

nextButton.addEventListener("click", () => {
	currentQuestionIndex++;
	setNextQuestion();
});

restartBtn.addEventListener("click", restart);
