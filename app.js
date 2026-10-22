
"use strict";

const STORAGE_KEY = "cloudready-az900-progress";
const PLANNER_KEY = "cloudready-az900-planner";

const TOPICS = {
    cloud: "Cloud concepts",
    architecture: "Azure architecture and services",
    governance: "Azure management and governance"
};

let quizQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswerIndex = null;
let answerHistory = [];
let flashcardIndex = 0;
let activeFlashcards = Array.isArray(FLASHCARDS) ? FLASHCARDS : [];

const $ = (selector) => document.querySelector(selector);

function normaliseTopic(value) {
    const topic = String(value || "").toLowerCase();

    if (topic.includes("cloud")) return "cloud";
    if (
        topic.includes("governance") ||
        topic.includes("management") ||
        topic.includes("cost") ||
        topic.includes("policy")
    ) return "governance";
    if (
        topic.includes("architecture") ||
        topic.includes("service") ||
        topic.includes("azure")
    ) return "architecture";

    return "cloud";
}

function getQuestionTopic(question) {
    return normaliseTopic(
        question.topic || question.domain || question.category || ""
    );
}

function getQuestionText(question) {
    return question.question ||
        question.text ||
        question.prompt ||
        question.title ||
        "Question text unavailable";
}

function getCorrectAnswerIndex(question) {
    const options = Array.isArray(question.options) ? question.options : [];

    const candidates = [
        question.correctIndex,
        question.answerIndex,
        question.correctAnswerIndex,
        question.correctOptionIndex,
        question.correctAnswer,
        question.answer,
        question.correct
    ];

    for (const candidate of candidates) {
        if (typeof candidate === "number" &&
            candidate >= 0 &&
            candidate < options.length) {
            return candidate;
        }

        if (typeof candidate === "string") {
            const trimmed = candidate.trim();
            const optionIndex = options.findIndex(
                option => String(option).trim() === trimmed
            );

            if (optionIndex !== -1) return optionIndex;

            // Also support answers such as "A", "B", "C", or "D".
            if (/^[A-D]$/i.test(trimmed)) {
                const letterIndex = trimmed.toUpperCase().charCodeAt(0) - 65;
                if (letterIndex < options.length) return letterIndex;
            }
        }
    }

    return -1;
}

function getExplanation(question) {
    return question.explanation ||
        question.rationale ||
        question.feedback ||
        "Review this concept in your study materials.";
}

function readStoredProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (saved && Array.isArray(saved.answers)) {
            return saved;
        }
    } catch (error) {
        console.warn("Could not read saved progress:", error);
    }

    return { answers: [] };
}

function saveProgress(progress) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
        console.error("Could not save progress:", error);
        $("#quiz-status").textContent =
            "Your browser could not save progress. Check its storage settings.";
    }
}

function showView(viewId) {
    document.querySelectorAll(".view").forEach(view => {
        view.hidden = view.id !== viewId;
    });

    document.querySelectorAll(".nav-button").forEach(button => {
        const active = button.dataset.view === viewId;
        button.classList.toggle("active", active);
        button.setAttribute("aria-current", active ? "page" : "false");
    });

    if (viewId === "dashboard") renderDashboard();
    if (viewId === "flashcards") renderFlashcard();
}

document.querySelectorAll(".nav-button").forEach(button => {
    button.addEventListener("click", () => showView(button.dataset.view));
});

document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => showView(button.dataset.go));
});

$(".brand").addEventListener("click", event => {
    event.preventDefault();
    showView("dashboard");
    window.location.hash = "dashboard";
});

function shuffle(items) {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function startQuiz() {
    if (!Array.isArray(QUESTIONS) || QUESTIONS.length === 0) {
        $("#quiz-status").textContent =
            "No questions were loaded. Check questions.js.";
        return;
    }

    const chosenTopic = $("#quiz-topic").value;
    const requestedLength = Number($("#quiz-length").value);

    const available = QUESTIONS.filter(question =>
        chosenTopic === "all" || getQuestionTopic(question) === chosenTopic
    );

    if (available.length === 0) {
        $("#quiz-status").textContent =
            "No questions were found for this topic. Check the topic labels in questions.js.";
        return;
    }

    const count = Math.min(
        Number.isFinite(requestedLength) ? requestedLength : 5,
        available.length
    );

    quizQuestions = shuffle(available).slice(0, count);
    currentQuestionIndex = 0;
    selectedAnswerIndex = null;
    answerHistory = [];

    $("#quiz-area").hidden = false;
    $("#quiz-results").hidden = true;
    $("#quiz-status").textContent =
        `Quiz started: ${quizQuestions.length} question(s).`;

    renderQuestion();
}

function renderQuestion() {
    const question = quizQuestions[currentQuestionIndex];

    if (!question) {
        showQuizResults();
        return;
    }

    selectedAnswerIndex = null;
    $("#question-progress").textContent =
        `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    $("#question-text").textContent = getQuestionText(question);
    $("#answer-options").replaceChildren();
    $("#answer-feedback").textContent = "";
    $("#next-question").hidden = true;

    const options = Array.isArray(question.options) ? question.options : [];

    if (options.length === 0) {
        $("#answer-feedback").textContent =
            "This question has no answer options. Check questions.js.";
        return;
    }

    options.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-option";
        button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

        button.addEventListener("click", () => selectAnswer(index));
        $("#answer-options").appendChild(button);
    });
}

function selectAnswer(index) {
    if (selectedAnswerIndex !== null) return;

    const question = quizQuestions[currentQuestionIndex];
    const correctIndex = getCorrectAnswerIndex(question);
    const correct = correctIndex !== -1 && index === correctIndex;
    selectedAnswerIndex = index;

    const buttons = [...$("#answer-options").querySelectorAll("button")];

    buttons.forEach((button, buttonIndex) => {
        button.disabled = true;

        if (buttonIndex === correctIndex) {
            button.classList.add("correct");
        } else if (buttonIndex === index && !correct) {
            button.classList.add("incorrect");
        }
    });

    $("#answer-feedback").textContent =
        `${correct ? "Correct." : "Not quite."} ` +
        (correctIndex === -1
            ? "The correct answer could not be identified from this question's data. "
            : `Correct answer: ${question.options[correctIndex]}. `) +
        getExplanation(question);

    answerHistory.push({
        topic: getQuestionTopic(question),
        question: getQuestionText(question),
        options: question.options,
        selectedIndex: index,
        correctIndex,
        correct,
        explanation: getExplanation(question)
    });

    const nextButton = $("#next-question");
    nextButton.textContent =
        currentQuestionIndex === quizQuestions.length - 1
            ? "View results"
            : "Next question";
    nextButton.hidden = false;
}

function goToNextQuestion() {
    if (selectedAnswerIndex === null) return;

    currentQuestionIndex += 1;

    if (currentQuestionIndex >= quizQuestions.length) {
        showQuizResults();
    } else {
        renderQuestion();
    }
}

function showQuizResults() {
    $("#quiz-area").hidden = true;
    $("#quiz-results").hidden = false;

    const correct = answerHistory.filter(answer => answer.correct).length;
    const total = answerHistory.length;
    const percentage = total ? Math.round((correct / total) * 100) : 0;

    $("#quiz-score").textContent =
        `You scored ${correct} out of ${total} (${percentage}%).`;

    const review = $("#quiz-review");
    review.replaceChildren();

    answerHistory.forEach((answer, index) => {
        const article = document.createElement("article");
        article.className = "review-item";

        const heading = document.createElement("h4");
        heading.textContent =
            `${index + 1}. ${answer.question} — ${answer.correct ? "Correct" : "Review"}`;

        const selected = document.createElement("p");
        selected.textContent = `Your answer: ${
            answer.options[answer.selectedIndex] ?? "Unknown"
        }`;

        const correctAnswer = document.createElement("p");
        correctAnswer.textContent = `Correct answer: ${
            answer.correctIndex >= 0
                ? answer.options[answer.correctIndex]
                : "Could not be identified from the question data"
        }`;

        const explanation = document.createElement("p");
        explanation.textContent = answer.explanation;

        article.append(heading, selected, correctAnswer, explanation);
        review.appendChild(article);
    });

    const progress = readStoredProgress();

    progress.answers.push(...answerHistory.map(answer => ({
        topic: answer.topic,
        correct: answer.correct,
        question: answer.question,
        date: new Date().toISOString()
    })));

    saveProgress(progress);
    renderDashboard();
    $("#quiz-status").textContent = "Quiz complete. Your progress has been saved.";
}

$("#start-quiz").addEventListener("click", startQuiz);
$("#next-question").addEventListener("click", goToNextQuestion);
$("#retry-quiz").addEventListener("click", startQuiz);

function renderDashboard() {
    const progress = readStoredProgress();
    const answers = progress.answers;
    const total = answers.length;
    const correct = answers.filter(answer => answer.correct).length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;

    $("#total-answered").textContent = total;
    $("#overall-accuracy").textContent = `${accuracy}%`;

    const topicStats = Object.keys(TOPICS).map(topic => {
        const topicAnswers = answers.filter(answer => answer.topic === topic);
        const topicCorrect = topicAnswers.filter(answer => answer.correct).length;
        const topicAccuracy = topicAnswers.length
            ? Math.round((topicCorrect / topicAnswers.length) * 100)
            : null;

        return {
            topic,
            name: TOPICS[topic],
            total: topicAnswers.length,
            accuracy: topicAccuracy
        };
    });

    const weakTopics = topicStats.filter(
        topic => topic.total > 0 && topic.accuracy < 70
    );

    $("#weak-topic-count").textContent = weakTopics.length;

    const container = $("#topic-progress");
    container.replaceChildren();

    topicStats.forEach(topic => {
        const row = document.createElement("div");
        row.className = "topic-progress-item";

        const label = document.createElement("p");
        label.textContent = `${topic.name}: ${
            topic.accuracy === null
                ? "Not attempted"
                : `${topic.accuracy}% (${topic.total} answered)`
        }`;

        row.appendChild(label);

        if (topic.accuracy !== null) {
            const track = document.createElement("div");
            track.className = "progress-track";

            const bar = document.createElement("div");
            bar.className = "progress-bar";
            bar.style.width = `${topic.accuracy}%`;
            bar.setAttribute("role", "progressbar");
            bar.setAttribute("aria-valuenow", topic.accuracy);
            bar.setAttribute("aria-valuemin", "0");
            bar.setAttribute("aria-valuemax", "100");
            bar.setAttribute("aria-label", `${topic.name} accuracy`);

            track.appendChild(bar);
            row.appendChild(track);
        }

        container.appendChild(row);
    });

    const recommendation = $("#next-recommendation");

    if (total === 0) {
        recommendation.textContent =
            "Take your first practice quiz. Your results will help identify which topics to revise.";
    } else if (weakTopics.length > 0) {
        recommendation.textContent =
            `Review ${weakTopics.map(topic => topic.name).join(", ")}. ` +
            "Aim for at least 70% accuracy in each topic before moving on.";
    } else {
        const leastPractised = [...topicStats].sort(
            (a, b) => a.total - b.total
        )[0];

        if (leastPractised.total === 0) {
            recommendation.textContent =
                `Your next step is to practise ${leastPractised.name}.`;
        } else {
            recommendation.textContent =
                "Your recorded topic accuracy is at least 70%. Keep practising and review explanations for any mistakes.";
        }
    }
}

$("#reset-progress").addEventListener("click", () => {
    const confirmed = window.confirm(
        "Reset all saved quiz progress? This cannot be undone."
    );

    if (!confirmed) return;

    try {
        localStorage.removeItem(STORAGE_KEY);
        renderDashboard();
        $("#quiz-status").textContent = "Saved quiz progress has been reset.";
    } catch (error) {
        console.error("Could not reset progress:", error);
    }
});

function renderFlashcard() {
    if (activeFlashcards.length === 0) {
        $("#flashcard-count").textContent = "Card 0 of 0";
        $("#flashcard-front").textContent =
            "No flashcards are available. Check flashcards.js.";
        $("#flashcard-back").hidden = true;
        $("#reveal-flashcard").disabled = true;
        $("#previous-flashcard").disabled = true;
        $("#next-flashcard").disabled = true;
        return;
    }

    flashcardIndex = (flashcardIndex + activeFlashcards.length) % activeFlashcards.length;

    const card = activeFlashcards[flashcardIndex];
    $("#flashcard-count").textContent =
        `Card ${flashcardIndex + 1} of ${activeFlashcards.length} · ${card.topic}`;
    $("#flashcard-front").textContent = card.front;
    $("#flashcard-back").textContent = card.back;
    $("#flashcard-back").hidden = true;
    $("#reveal-flashcard").textContent = "Reveal answer";
    $("#reveal-flashcard").disabled = false;
    $("#previous-flashcard").disabled = activeFlashcards.length < 2;
    $("#next-flashcard").disabled = activeFlashcards.length < 2;
}

$("#reveal-flashcard").addEventListener("click", () => {
    const back = $("#flashcard-back");
    back.hidden = !back.hidden;
    $("#reveal-flashcard").textContent =
        back.hidden ? "Reveal answer" : "Hide answer";
});

$("#previous-flashcard").addEventListener("click", () => {
    flashcardIndex -= 1;
    renderFlashcard();
});

$("#next-flashcard").addEventListener("click", () => {
    flashcardIndex += 1;
    renderFlashcard();
});

function createStudyPlan(event) {
    event.preventDefault();

    const dateValue = $("#exam-date").value;
    const hours = Number($("#study-hours").value);
    const weakTopic = $("#study-weak-topic").value;
    const targetDate = new Date(`${dateValue}T12:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!dateValue || Number.isNaN(targetDate.getTime())) {
        $("#planner-result").textContent = "Please choose a valid exam date.";
        return;
    }

    if (targetDate < today) {
        $("#planner-result").textContent =
            "Your target exam date is in the past. Choose a future date.";
        return;
    }

    if (!Number.isFinite(hours) || hours < 1 || hours > 40) {
        $("#planner-result").textContent =
            "Enter between 1 and 40 study hours per week.";
        return;
    }

    const daysUntilExam = Math.max(
        1,
        Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))
    );
    const weeks = Math.max(1, Math.ceil(daysUntilExam / 7));

    const plan = {
        examDate: dateValue,
        hours,
        weakTopic,
        weeks,
        createdAt: new Date().toISOString()
    };

    try {
        localStorage.setItem(PLANNER_KEY, JSON.stringify(plan));
    } catch (error) {
        console.warn("Could not save study plan:", error);
    }

    renderStudyPlan(plan);
}

function renderStudyPlan(plan) {
    const result = $("#planner-result");
    result.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = "Your study plan";

    const summary = document.createElement("p");
    summary.textContent =
        `You have approximately ${plan.weeks} week(s) until ${plan.examDate}, ` +
        `with ${plan.hours} study hour(s) available each week.`;

    const weeklyHours = document.createElement("p");
    weeklyHours.textContent =
        `Priority topic: ${TOPICS[plan.weakTopic] || TOPICS.cloud}.`;

    const list = document.createElement("ol");
    const sessions = [
        `Spend about ${Math.round(plan.hours * 0.4 * 10) / 10} hour(s) revising ${TOPICS[plan.weakTopic] || TOPICS.cloud}.`,
        `Use about ${Math.round(plan.hours * 0.3 * 10) / 10} hour(s) to practise quiz questions and read every explanation.`,
        `Use about ${Math.round(plan.hours * 0.2 * 10) / 10} hour(s) on flashcards and definitions.`,
        `Use about ${Math.round(plan.hours * 0.1 * 10) / 10} hour(s) reviewing mistakes and revisiting weaker concepts.`
    ];

    sessions.forEach(session => {
        const item = document.createElement("li");
        item.textContent = session;
        list.appendChild(item);
    });

    const note = document.createElement("p");
    note.textContent =
        "This is a suggested weekly routine, not an official Microsoft study plan. Adjust it as your results change.";

    result.append(heading, summary, weeklyHours, list, note);
}

$("#planner-form").addEventListener("submit", createStudyPlan);

function loadSavedStudyPlan() {
    try {
        const saved = JSON.parse(localStorage.getItem(PLANNER_KEY));
        if (saved && saved.examDate && saved.hours && saved.weakTopic) {
            $("#exam-date").value = saved.examDate;
            $("#study-hours").value = saved.hours;
            $("#study-weak-topic").value = saved.weakTopic;
            renderStudyPlan(saved);
        }
    } catch (error) {
        console.warn("Could not load saved study plan:", error);
    }
}

const BUDDY_GUIDE = [
    {
        keywords: ["shared responsibility", "responsibility model"],
        title: "Shared responsibility model",
        explanation: "Microsoft manages the cloud infrastructure, but the customer's responsibilities depend on the service. With IaaS, the customer manages more, including the operating system. With SaaS, Microsoft manages more of the application stack. Customers remain responsible for areas such as their data, identities, and access configuration."
    },
    {
        keywords: ["availability zone", "availability zones"],
        title: "Availability zones",
        explanation: "An availability zone is a physically separate location within an Azure region. Zones have independent power, cooling, and networking. Deploying supported resources across zones can help protect workloads from a failure in one zone."
    },
    {
        keywords: ["region", "regions", "geography"],
        title: "Azure regions",
        explanation: "An Azure region is a geographic area containing one or more datacentres connected through a low-latency network. Region choice can affect latency, service availability, data residency, and resilience options."
    },
    {
        keywords: ["resource group", "resource groups"],
        title: "Resource groups",
        explanation: "A resource group is a logical container for Azure resources. It helps you manage related resources together. A resource belongs to one resource group at a time, and deleting a resource group deletes the resources inside it."
    },
    {
        keywords: ["virtual machine", "virtual machines", "vm", "vms"],
        title: "Azure Virtual Machines",
        explanation: "An Azure virtual machine is a software-based computer hosted in Azure. It gives you control over the operating system and installed software. You manage more of the machine than you would with a fully managed platform service."
    },
    {
        keywords: ["iaas", "infrastructure as a service"],
        title: "Infrastructure as a Service",
        explanation: "IaaS provides fundamental computing infrastructure such as virtual machines, storage, and networking. The cloud provider manages the physical infrastructure; you typically manage the operating system, applications, and much of the configuration."
    },
    {
        keywords: ["paas", "platform as a service"],
        title: "Platform as a Service",
        explanation: "PaaS provides a managed platform for building and running applications. The provider manages more of the underlying infrastructure and operating environment, allowing you to focus on application code and data."
    },
    {
        keywords: ["saas", "software as a service"],
        title: "Software as a Service",
        explanation: "SaaS is software delivered as a service, often through a browser. The provider operates the application and underlying platform. Customers still manage their data, users, and access settings."
    },
    {
        keywords: ["blob storage", "object storage"],
        title: "Azure Blob Storage",
        explanation: "Azure Blob Storage stores large amounts of unstructured object data such as images, videos, documents, and backups. It is not the same as a traditional file share or a relational database."
    },
    {
        keywords: ["entra", "active directory", "identity", "identities"],
        title: "Microsoft Entra ID",
        explanation: "Microsoft Entra ID is Microsoft's cloud identity and access management service. It supports authentication and access management for users, applications, and other identities."
    },
    {
        keywords: ["rbac", "role based access"],
        title: "Role-based access control",
        explanation: "Azure RBAC grants permissions based on roles assigned to identities at a scope, such as a management group, subscription, resource group, or resource. It helps ensure people receive only the access they need."
    },
    {
        keywords: ["azure policy", "policy"],
        title: "Azure Policy",
        explanation: "Azure Policy helps enforce standards and assess compliance. For example, a policy can restrict which regions are allowed for deployments or audit whether resources follow organisational requirements."
    },
    {
        keywords: ["cost management", "pricing calculator", "cost", "budget"],
        title: "Cost management",
        explanation: "Azure Cost Management helps analyse and monitor cloud spending. The Azure pricing calculator estimates costs before deployment, while budgets and alerts help you track spending against a target."
    },
    {
        keywords: ["high availability", "reliability"],
        title: "High availability",
        explanation: "High availability means designing a service to remain accessible with minimal downtime. Redundancy, resilient architecture, and appropriate use of availability zones can help reduce the impact of failures."
    },
    {
        keywords: ["scalability", "elasticity"],
        title: "Scalability and elasticity",
        explanation: "Scalability is the ability to increase or decrease capacity to meet workload needs. Elasticity is the ability to adjust capacity as demand changes, often automatically."
    },
    {
        keywords: ["hybrid cloud", "public cloud", "private cloud"],
        title: "Cloud deployment models",
        explanation: "A public cloud uses services provided by a cloud provider. A private cloud is dedicated to one organisation. A hybrid cloud combines public cloud services with private infrastructure."
    },
    {
        keywords: ["monitor", "azure monitor", "metrics", "logs"],
        title: "Azure Monitor",
        explanation: "Azure Monitor collects and analyses monitoring data such as metrics and logs. It helps you understand the health and performance of applications and infrastructure."
    },
    {
        keywords: ["cloud computing", "what is cloud"],
        title: "Cloud computing",
        explanation: "Cloud computing is the delivery of computing services over a network, usually the internet. It lets organisations use resources such as compute, storage, databases, and networking without owning all the underlying physical infrastructure."
    }
];

function explainBuddyQuestion(event) {
    event.preventDefault();

    const question = $("#buddy-question").value.trim().toLowerCase();
    const response = $("#buddy-response");
    response.replaceChildren();

    if (!question) {
        response.textContent = "Enter a concept or question first.";
        return;
    }

    const match = BUDDY_GUIDE.find(entry =>
        entry.keywords.some(keyword => question.includes(keyword))
    );

    const heading = document.createElement("h3");
    const explanation = document.createElement("p");
    const note = document.createElement("p");

    if (match) {
        heading.textContent = match.title;
        explanation.textContent = match.explanation;
        note.textContent =
            "Study tip: find this concept in your flashcards, then try a quiz question without looking at the answer.";
    } else {
        heading.textContent = "Let's narrow down the concept";
        explanation.textContent =
            "I don't have a built-in explanation matching that wording yet. Try asking about cloud computing, shared responsibility, regions, availability zones, virtual machines, resource groups, IaaS, PaaS, SaaS, Blob Storage, Entra ID, RBAC, Azure Policy, cost management, scalability, or Azure Monitor.";
        note.textContent =
            "This study buddy uses a fixed set of explanations. It does not send your question to a live AI service.";
    }

    response.append(heading, explanation, note);
}

$("#buddy-form").addEventListener("submit", explainBuddyQuestion);

renderDashboard();
renderFlashcard();
loadSavedStudyPlan();
