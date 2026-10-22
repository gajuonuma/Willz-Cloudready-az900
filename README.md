
# CloudReady AZ-900

CloudReady AZ-900 is a browser-based study tool for practising Microsoft Azure Fundamentals concepts.

It is an independent learning project and is not affiliated with or endorsed by Microsoft.

## Features

- Practice quizzes with topic selection and adjustable session length.
- Answer feedback and explanations, with a review of completed questions.
- Flashcards for reviewing key Azure concepts.
- A progress dashboard showing recorded answers, overall accuracy, and topics to revisit.
- A study planner based on a target exam date, weekly study hours, and a selected priority topic.
- A built-in study buddy with explanations of common Azure Fundamentals concepts.
- Browser-local storage for quiz progress and the study plan.

## Technology

- HTML
- CSS
- Vanilla JavaScript
- Browser localStorage
- GitHub Pages for static hosting

No backend or paid API is required.

## Run locally

1. Clone or download this repository.
2. Open `index.html` in a browser, or open the project in Visual Studio Code and use a local web server.
3. Use the navigation to access the dashboard, practice quiz, flashcards, study planner, and study buddy.

## Data and privacy

Quiz progress and the study plan are stored in the browser's localStorage. They are not automatically synchronised between browsers or devices. Clearing the browser's site data can remove this information.

The study buddy uses predefined explanations. It is not a live AI assistant and does not send questions to an external AI service.

## Learning limitations

The questions and flashcards are intended for independent revision. They are not official Microsoft exam questions, and results do not guarantee exam readiness. Check current Microsoft AZ-900 learning objectives and documentation when preparing for the exam.

## Project files

- `index.html` — page structure and application sections.
- `styles.css` — visual styling and responsive layout.
- `app.js` — navigation, quiz behaviour, progress, planner, flashcards, and study buddy.
- `questions.js` — quiz question bank.
- `flashcards.js` — flashcard content.
- `README.md` — project documentation.
