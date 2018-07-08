const jsonData = {"quizzes":[{"title":"Abstract Quiz","questions":[{"question":"If two left handed people argue, which one is right?","answers":[{"content":"The one on the right.","value":false},{"content":"The one on the left.","value":true},{"content":"The one with the gun.","value":false},{"content":"Tom.","value":false}]},{"question":"What does Google use if it can't find an answer on Google?","answers":[{"content":"Bing","value":false},{"content":"Bang","value":false},{"content":"Bong","value":false},{"content":"Ask Jeeves","value":true}]},{"question":"What kind of pants do Mario and Luigi wear?","answers":[{"content":"Dussault apparel slashed jeans","value":false},{"content":"Tapered bell bottoms","value":false},{"content":"Acid washed Guccis","value":false},{"content":"Denim denim denim","value":true}]}]},{"title":"Dev Quiz","questions":[{"question":"How many programmers does it take to change a lightbulb?","answers":[{"content":"x = x + 1","value":false},{"content":"undefined","value":false},{"content":"NaN === NaN","value":false},{"content":"None. It's a hardware problem.","value":true}]},{"question":"What's the object oriented way to become wealthy?","answers":[{"content":"Inheritance","value":true},{"content":"Have some class","value":false},{"content":"Super props","value":false},{"content":"Wealth is subjective","value":false}]},{"question":"What should you do when a bug is sad?","answers":[{"content":"Help it out of a bind","value":false},{"content":"Console it","value":true},{"content":"Express your feelings","value":false},{"content":"Be more responsive","value":false}]}]}]};

// control UI, and contains dynamic HTML
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
        <div class="state_1">
            <h4>
                Quiz App
            </h4>

            <div class="quiz-type">
                <button class="button-choose" id="A">Quiz A</button>
                <button class="button-choose" id="B">Quiz B</button>
            </div>

        </div>
        
        `;
        root.innerHTML = html;
    }

    // questions : answers state
    main() {
        // generate html with question answers 
        function renderAnswers(answers) {
            console.log('renderanswers answers', answers);
            const content = answers.map(answer => { 
                return (`
                    <div value="${answer.value}" class="answer">
                        <h4 value="${answer.value}" id='answer_#' class="answer-content">${answer.content}</h4>
                    </div>`);
            }).join('');
            return content;
        }
        console.log('this.question', this.question);
        let { question, answers } = this.question;
        console.log('answers', answers);
        console.log('question', question);
        let content = renderAnswers(answers);

        let html =                     `
        '   <div id='main-content' class="main-content" style="display: inline;">
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
    end(score) {
        let html = 
        `
        <div class="end">
            <h4>Pass/Fail</h4>
            <p>Score: </p>
        </div>
        `;

        root.innerHTML = html;
    }

    // determine which state to run (start, main, end)
    // update(command) {
    //     console.log('app control')
    //     switch(command) {
    //         default:
    //             console.log('start');
    //             document.getElementById('root').innerHTML = this.start();
    //     }
    // }

    // contains quiz type, and updated score
    header() {
        return `<div class="nav">
                    <h3 class="title">${this.type}</h3>
                    <h3 class="score">${this.score}</h3>
                </div>`;
    }

    // set data maintained from outside source, and update the UI
    set data(data) {
        if (data == null) { return }
        //console.log('APPUI set Data', data);
        let { title, question } = data;
        console.log('title', title);
        console.log('question', question);
        this.type = title;
        this.question = question;
        console.log('this.type',this.type);
    }
}

// user object containing basic info, and answers
const User = {
    // check if answer is 'true'
    update: (truthy) => {
        User.total++;
        if (truthy) {
            User.score++;
        }

        return {
            score: User.score,
            total: User.total
        }
    },
    score: 0,
    total: 0,
    answers: []
}

// decide which data to send to AppUI
// const data = {
//     questions: [],
//     title: '',
//     index: 0,
//     initializeVariables: function(choice) {

//     },
//     current: () => {
//         console.log('this', this)
//         // let question = this.questions[this.index];
//         // let title = this.title;
        
//         // let obj = {
//         //     title,
//         //     question
//         // }

//         // this.index++;

//         // return obj;
//     }
// }

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
        console.log('title, questions', title, questions)
        
        this.questions = questions;
        this.title = title;

        // this.current();
    }

    current() {
        console.log('data.current invoked, this.index:', this.index);
        if (this.questions.length === this.index) {
            console.log('data.current if statement entered')
            return false; 
        }
        let question = this.questions[this.index];
        // console.log('question length', this.questions.length);
        let title = this.title;

        let obj = {
            title,
            question
        }

        this.index++;
        return obj;
    }
}

// event listeners to control user input

const listen = (function() {
    const root = document.getElementById('root');
    // const nav = documnt.getElementById('header');
    const app = new AppUI();
    const data = new Data(jsonData);

    app.start();

    document.addEventListener('click', (event) => {
        console.log(event);
        let value = event.target.classList.value;
        let answerValue = event.target.attributes[0].nodeValue;
        let current, totals;
        switch(value) {
            case('button-choose'):
                data.initializeVariables(event.target.id);
                current = data.current();
                console.log('current', current);
                app.data = current;
                app.main();
                break;
            case('answer'):
            case('answer-content'):
                // if end of quiz ==> end quiz
                current = data.current();
                console.log('current', current);
                console.log('answerValue', answerValue);
                if (!current) {
                    console.log('end');
                    console.log('totals end', totals);
                    app.end();
                    return;
                }
                totals = User.update();
                console.log('totals', totals);
                app.data = current;
                app.main();
                break;
            default:
                break;
        }
    })
})();