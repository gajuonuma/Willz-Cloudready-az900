
"use strict";

// Main navigation
const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-button");
const dashboardRecommendation = document.querySelector("#next-recommendation");

function showView(viewId) {
    for (const view of views) {
        view.hidden = view.id !== viewId;
    }

    for (const button of navButtons) {
        const isActive = button.dataset.view === viewId;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-current", isActive ? "page" : "false");
    }
}

for (const button of navButtons) {
    button.addEventListener("click", function () {
        showView(button.dataset.view);
    });
}

for (const button of document.querySelectorAll("[data-go]")) {
    button.addEventListener("click", function () {
        showView(button.dataset.go);
    });
}

// Quiz elements
const quizTopic = document.querySelector("#quiz-topic");
const quizLength = document.querySelector("#quiz-length");
const startQuizButton = document.querySelector("#start-quiz");
const quizStatus = document.querySelector("#quiz-status");
const quizArea = document.querySelector("#quiz-area");
const questionProgress = document.querySelector("#question-progress");
const questionText = document.querySelector("#question-text");
const answerOptions = document.querySelector("#answer-options");
const answerFeedback = document.querySelector("#answer-feedback");
const nextQuestionButton = document.querySelector("#next-question");
const quizResults = document.querySelector("#quiz-results");
const quizScore = document.querySelector("#quiz-score");
const quizReview = document.querySelector("#quiz-review");
const retryQuizButton = document.querySelector("#retry-quiz");

// Quiz session state
let sessionQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answerHistory = [];
let questionAnswered = false;

const topicNames = {
    cloud: "Cloud concepts",
    architecture: "Azure architecture and services",
    governance: "Azure management and governance"
};

function shuffle(items) {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function startQuiz() {
    const selectedTopic = quizTopic.value;
    const requestedLength = Number(quizLength.value);

    const availableQuestions = QUESTIONS.filter(function (question) {
        return selectedTopic === "all" || question.topic === selectedTopic;
    });

    if (availableQuestions.length === 0) {
        quizStatus.textContent = "No questions are available for this topic yet.";
        return;
    }

    sessionQuestions = shuffle(availableQuestions).slice(
        0,
        Math.min(requestedLength, availableQuestions.length)
    );

    currentQuestionIndex = 0;
    score = 0;
    answerHistory = [];
    questionAnswered = false;

    quizArea.hidden = false;
    quizResults.hidden = true;

    if (sessionQuestions.length < requestedLength) {
        quizStatus.textContent =
            `This session has ${sessionQuestions.length} questions because that is all the questions currently available for this selection.`;
    } else {
        quizStatus.textContent = "Quiz started. Choose the best answer for each question.";
    }

    renderQuestion();
}

function renderQuestion() {
    const question = sessionQuestions[currentQuestionIndex];

    questionAnswered = false;
    questionProgress.textContent =
        `Question ${currentQuestionIndex + 1} of ${sessionQuestions.length} · ${topicNames[question.topic]}`;

    questionText.textContent = question.question;
    answerOptions.replaceChildren();
    answerFeedback.replaceChildren();
    nextQuestionButton.hidden = true;

    question.options.forEach(function (option, optionIndex) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-option";
        button.textContent = option;

        button.addEventListener("click", function () {
            selectAnswer(optionIndex);
        });

        answerOptions.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    if (questionAnswered) {
        return;
    }

    questionAnswered = true;

    const question = sessionQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctIndex;

    if (isCorrect) {
        score++;
    }

    answerHistory.push({
        question: question,
        selectedIndex: selectedIndex,
        isCorrect: isCorrect
    });

    const optionButtons = answerOptions.querySelectorAll("button");

    optionButtons.forEach(function (button, index) {
        button.disabled = true;

        if (index === question.correctIndex) {
            button.classList.add("correct");
        } else if (index === selectedIndex) {
            button.classList.add("incorrect");
        }
    });

    const feedbackHeading = document.createElement("p");
    feedbackHeading.textContent = isCorrect
        ? "Correct!"
        : "Not quite. The correct answer is: " + question.options[question.correctIndex];

    const explanation = document.createElement("p");
    explanation.textContent = question.explanation;

    answerFeedback.append(feedbackHeading, explanation);

    nextQuestionButton.textContent =
        currentQuestionIndex === sessionQuestions.length - 1
            ? "View results"
            : "Next question";

    nextQuestionButton.hidden = false;
}

function goToNextQuestion() {
    if (!questionAnswered) {
        return;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < sessionQuestions.length) {
        renderQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    quizArea.hidden = true;
    quizResults.hidden = false;

    const percentage = Math.round((score / sessionQuestions.length) * 100);

    quizScore.textContent =
        `You scored ${score} out of ${sessionQuestions.length} (${percentage}%).`;

    quizReview.replaceChildren();

    const reviewHeading = document.createElement("h4");
    reviewHeading.textContent = "Answer review";
    quizReview.appendChild(reviewHeading);

    answerHistory.forEach(function (entry, index) {
        const reviewItem = document.createElement("section");
        reviewItem.className = "review-item";

        const heading = document.createElement("h4");
        heading.textContent = `${index + 1}. ${entry.question.question}`;

        const yourAnswer = document.createElement("p");
        yourAnswer.textContent =
            `Your answer: ${entry.question.options[entry.selectedIndex]}`;

        const result = document.createElement("p");
        result.textContent = entry.isCorrect
            ? "Result: Correct"
            : `Correct answer: ${entry.question.options[entry.question.correctIndex]}`;

        const explanation = document.createElement("p");
        explanation.textContent = entry.question.explanation;

        reviewItem.append(heading, yourAnswer, result, explanation);
        quizReview.appendChild(reviewItem);
    });

    quizStatus.textContent = "Quiz complete.";

    dashboardRecommendation.textContent =
        `You last scored ${percentage}% on a practice quiz. ` +
        "Review the questions and explanations, then practise again to reinforce your understanding.";
}

startQuizButton.addEventListener("click", startQuiz);
nextQuestionButton.addEventListener("click", goToNextQuestion);
retryQuizButton.addEventListener("click", startQuiz);

// Show the dashboard when the page first loads.
dashboardRecommendation.textContent =
    "Your learning dashboard is ready. Start a practice quiz to test your knowledge.";

showView("dashboard");
