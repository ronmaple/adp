// jsonData - local, can be accessed on src/json if needed.
const jsonData = {"quizzes":[{"title":"Abstract Quiz","questions":[{"question":"If two left handed people argue, which one is right?","answers":[{"content":"The one on the right.","value":false},{"content":"The one on the left.","value":true},{"content":"The one with the gun.","value":false},{"content":"Tom.","value":false}]},{"question":"What does Google use if it can't find an answer on Google?","answers":[{"content":"Bing","value":false},{"content":"Bang","value":false},{"content":"Bong","value":false},{"content":"Ask Jeeves","value":true}]},{"question":"What kind of pants do Mario and Luigi wear?","answers":[{"content":"Dussault apparel slashed jeans","value":false},{"content":"Tapered bell bottoms","value":false},{"content":"Acid washed Guccis","value":false},{"content":"Denim denim denim","value":true}]}]},{"title":"Dev Quiz","questions":[{"question":"How many programmers does it take to change a lightbulb?","answers":[{"content":"x = x + 1","value":false},{"content":"undefined","value":false},{"content":"NaN === NaN","value":false},{"content":"None. It's a hardware problem.","value":true}]},{"question":"What's the object oriented way to become wealthy?","answers":[{"content":"Inheritance","value":true},{"content":"Have some class","value":false},{"content":"Super props","value":false},{"content":"Wealth is subjective","value":false}]},{"question":"What should you do when a bug is sad?","answers":[{"content":"Help it out of a bind","value":false},{"content":"Console it","value":true},{"content":"Express your feelings","value":false},{"content":"Be more responsive","value":false}]}]}]};

// control UI, and contains dynamic HTML - takes in data from Data class
class AppUI {
    constructor(data) {
        // data = object { type, questions&answers, score }
        this.data = data;

        // local variables to update header, questions, answers
        this.score = '';
        this.type = '';
        this.question;
        this.answers;
        this.scoreDisplay = `Score: ${this.score}`;
    }

    // initial build
    start() {
        let html = `
        <div class="start-content">
            <h4> Quiz App </h4>

            <div class="quiz-type"> 
                <button class="button-choose" id="A">Quiz A</button>
                <button class="button-choose" id="B">Quiz B</button>
            </div>

        </div>
        
        `;
        root.innerHTML = html;
    }

    // questions and answers section
    main() {
        // generate html with question answers 
        function renderAnswers(answers) {
            const content = answers.map((answer, index) => { 
                return (`
                    <div value="${answer.value}" class="answer" data-key='${index}'>
                        <h4 value="${answer.value}" data-key='${index}' class="answer-content">${answer.content}</h4>
                    </div>`);
            }).join('');
            return content;
        }
        let { question, answers } = this.question;
        let content = renderAnswers(answers);

        let html = 
        `
            <div id='main-content' class="main-content" style="display: inline;">
                <div class="question-section" id="question-section">
                    <h4 id="question">${question}</h4>
                </div>

                <div class="answer-section" id="answer-section">
                    ${content}
                </div>
            </div>
        `

        root.innerHTML = html;
    }

    // end state - pass/fail
    end(overall) {
        let { score, total } = overall;
        let html = 
        `
        <div class="end">
            <h4>${(score / total > 0.50 ) ? `Pass!` : `Fail`}</h4>
            <p>Score: ${score} / ${total}</p>
        </div>
        `;

        root.innerHTML = html;
    }

    // update the header, which displays current score
    header(overall) {
        let score = `${overall.score} / ${overall.total}`;
        let html = `<div class="nav">
                        <h3 class="title">${this.type}</h3>
                        <h3 class="score">${score}</h3>
                    </div>`;
        document.getElementById('nav').innerHTML = html;
    }

    // common sequence method declarations
    updateUI(state, progress, answerValue = undefined, node = undefined) {
        // change background color of answer selection button
        if (node !== undefined) {
            let styleQuery = document.querySelector(`[data-key='${node}']`).style;
            if (answerValue === 'true') {
                styleQuery.backgroundColor = 'hsl(140, 100%, 30%)'; // red
                styleQuery.color = 'white';
            } else {
                styleQuery.backgroundColor = 'hsl(0, 100%, 55%)'; // green
                styleQuery.color = 'white';
            }
        }
        // this.validateUI(node);
        setTimeout(() => {
            this.header(progress);
            if (state === 'end') {
                this.end(progress);
            } else {
                this.main();
            }
        }, (answerValue === undefined) ? 100 : 2000)
    }

    // set data maintained from outside source, and update the UI
    set data(data) {
        // prevent error message - setters invoked in initialization of class
        if (data == null) { return }
        
        // destructuring of data sent from Data class. reassign to Class scope
        let { title, question } = data;
        this.type = title;
        this.question = question;

    }
}

// user object containing basic info, and answers
const User = {
    // check if user selected answer is 'true' 
    update: function(nodeValue) { // function declaration to be able to access 'this'
        this.total++;
        if (nodeValue === 'true') {
            User.score++;
        }
        this.overall = {
            score: this.score,
            total: this.total
        }

        return this.overall;
    },
    score: 0,
    total: 0,
    overall: {
        score: 0,
        total: 0
    }
}

// initialization of json Data, and determines current progress
class Data {
    constructor(data) {
        this.data = data;
        this.questions = [];
        this.title = '';
        this.index = 0;
    }

    initializeVariables(choice) {
        const { quizzes : list } = this.data;
        let quiz;
        (choice === 'A') ? 
            [ quiz ] = list 
            : [ , quiz ] = list;
        const { title, questions } = quiz;
        
        this.questions = questions;
        this.title = title;
    }

    current() {
        if (this.questions.length === this.index) {
            return false; 
        }
        let question = this.questions[this.index];
        let title = this.title;

        let obj = {
            title,
            question
        }

        this.index++;
        return obj;
    }
}

// start of app, and a series of event listeners for general purpose
const listen = (function() {
    const root = document.getElementById('root');
    const app = new AppUI();
    const data = new Data(jsonData);

    app.start();

    document.addEventListener('click', (event) => {
        let value = event.target.classList.value;
        let datakey = '';
        let current, answerValue;
        switch(value) {
            // user choses quiz A or B
            case('button-choose'):
                // assign chosen Quiz type into 'current', and set data into AppUI to display
                data.initializeVariables(event.target.id);
                current = data.current();
                app.data = current;
                app.updateUI('main', User.overall);
                break;
            // user choses answer; clicks either the div element, or text
            case('answer'):
            case('answer-content'):
                datakey = event.target.dataset.key;
                answerValue = event.target.attributes[0].nodeValue;

                current = data.current();
                User.update(answerValue);
                // if end of quiz, run end sequence
                if (!current) {
                    app.updateUI('end', User.overall, answerValue, datakey);
                    return;
                } else {
                    app.data = current;
                    app.updateUI('main', User.overall, answerValue, datakey);
                }
                break;
            default:
                // prevents any non specific inputs
                break;
        }
    })
})();