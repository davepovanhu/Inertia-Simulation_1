const questions = [
    {
        question: "What is inertia?",
        choices: ["A. A property of matter", "B. A force", "C. A type of energy", "D. A kind of motion"],
        correct: "A"
    },
    {
        question: "Which object has more inertia?",
        choices: ["A. A small rock", "B. A large boulder", "C. A feather", "D. A paperclip"],
        correct: "B"
    },
    {
        question: "How does mass affect inertia?",
        choices: ["A. More mass means less inertia", "B. More mass means more inertia", "C. Mass has no effect", "D. Mass and inertia are unrelated"],
        correct: "B"
    },
    {
        question: "What will happen to an object in motion if no net force acts on it?",
        choices: ["A. It will stop", "B. It will change direction", "C. It will continue in a straight line at constant speed", "D. It will accelerate"],
        correct: "C"
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let isAnswerSelected = false;
let score = 0;

function showQuestion(index) {
    const questionData = questions[index];
    document.getElementById('question').innerText = questionData.question;
    document.getElementById('options').innerHTML = questionData.choices.map((choice, i) =>
        `<button class="choice-button" onclick="selectAnswer('${String.fromCharCode(65 + i)}')">${choice}</button>`
    ).join('');
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('prevButton').style.display = index > 0 ? 'inline-block' : 'none';
    document.getElementById('nextButton').style.display = isAnswerSelected && index < questions.length - 1 ? 'inline-block' : 'none';
    document.getElementById('seeAnswersButton').style.display = index === questions.length - 1 ? 'inline-block' : 'none';
}

function selectAnswer(answer) {
    const correctAnswer = questions[currentQuestionIndex].correct;
    if (answer === correctAnswer) {
        document.getElementById('feedback').innerHTML = `<span class="correct">Correct!</span>`;
        score++;
    } else {
        document.getElementById('feedback').innerHTML = `<span class="incorrect">Incorrect.</span>`;
    }
    userAnswers[currentQuestionIndex] = answer;
    isAnswerSelected = true;
    document.getElementById('nextButton').style.display = 'inline-block';
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
        isAnswerSelected = false;
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

function showCorrectAnswers() {
    const answersHtml = questions.map((question, index) => {
        return `
            <div>
                <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
                <p><strong>Correct Answer:</strong> ${question.correct}</p>
            </div>
        `;
    }).join('');
    document.getElementById('question').innerHTML = `<p><strong>Your Score: ${score} / ${questions.length}</strong></p>`;
    document.getElementById('options').innerHTML = '';
    document.getElementById('feedback').innerHTML = answersHtml;
    document.getElementById('nextButton').style.display = 'none';
    document.getElementById('prevButton').style.display = 'none';
    document.getElementById('seeAnswersButton').style.display = 'none';
}

function goBack() {
    window.location.href = 'index.html'; // Redirects to the home page
}

showQuestion(currentQuestionIndex);
