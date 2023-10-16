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
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById(
	"question-container"
);
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById(
	"answer-buttons"
);

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

// Save Name to Local Storage
function createDataObject(e) {
	e.preventDefault();
	user.name = name.value;
	localStorage.user = JSON.stringify(user);
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
		button.innerText = category.name;
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
			console.log(questionsArray);
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
	showCategories(categoriesData);
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
