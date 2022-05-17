fetch("/game_data.json")
    .then(res => res.json())
    .then(data => setup(data))
    .catch(err => console.error(err));

let _g = {};
const setup = (data) => {
    _g.data = data;
    // TODO: Check if score data is in browser storage
    _g.score = { correct: 0, total: 0, correct_in_row: 0 };
    _g.score.correct_elem = document.getElementById("correct");
    _g.score.total_elem = document.getElementById("total");
    _g.score.correct_in_row_elem = document.getElementById("correct-row");

    _g.unique = {};
    _g.unique.genres = _g.data.map(x => x.genre).filter(unique);
    _g.unique.authors = _g.data.map(x => x.author).filter(unique);
    _g.unique.sections = _g.data.map(x => x.section).filter(unique);
    _g.unique.titles = _g.data.map(x => x.title);

    _g.gamefield = document.getElementById("gamefield");
    // setup reload -> when the animation of previous question ends
    _g.gamefield.addEventListener("animationend", () => {
        loadQuestion();
    });

    loadQuestion();
}

const loadQuestion = () => {
    // set global state
    _g.gamefield.replaceChildren(); // with no args passed -> removes all children
    _g.gamefield.classList.remove("reveal-delete");
    _g.iter = {};

    const index = Math.floor(Math.random() * _g.data.length);
    const neigbors_start_idx = 3 * Math.floor(index / 3);
    const neigbors_end_idx = neigbors_start_idx + 3;
    _g.iter.idx = index % 3;
    _g.iter.works = _g.data.slice(neigbors_start_idx, neigbors_end_idx);
    _g.iter.work = _g.iter.works[_g.iter.idx];
    _g.iter.q = Math.floor(Math.random() * 4); // question type

    const real_ans = getRealAnswer();
    const ans = getAnswers(real_ans);
    console.assert(ans.length === 4);
    console.assert(ans.indexOf(real_ans) !== -1);

    // display
    _g.gamefield.append(getQuestionElement(), getAnswerElement(ans, real_ans));
    // display score
    _g.score.correct_elem.innerHTML = _g.score.correct;
    _g.score.total_elem.innerHTML = _g.score.total;
    _g.score.correct_in_row_elem.innerHTML = _g.score.correct_in_row;
}

const unique = (value, index, self) => self.indexOf(value) === index;
const getQuestionType = () => 0; // Math.floor(Math.random() * numQuestions);
const getAnswers = (real_ans) => {
    let options;
    switch (_g.iter.q) {
        case 0: options = _g.unique.genres.filter(x => x !== real_ans); break;
        case 1: options = _g.unique.authors.filter(x => x !== real_ans); break;
        case 2: options = _g.unique.sections.filter(x => x !== real_ans); break;
        case 3: options = _g.unique.titles.filter(x => x !== real_ans); break;
        default:
            console.error("question type not found");
            return "Error!";
    }

    // choose 3 random
    options = options.sort(() => 0.5 - Math.random());
    options = options.slice(0, 3);

    // shuffle answers
    options.push(real_ans);
    options = options.sort(() => 0.5 - Math.random());


    console.assert(options.length == 4);

    return options;
};

const getRealAnswer = () => {
    const q = _g.iter.q;
    const work = _g.iter.work;

    switch (q) {
        case 0: return work.genre;
        case 1: return work.author;
        case 2: return work.section;
        case 3: return work.title;
        default:
            console.error("question type not found");
            return "Error!";
    }
};

const getQuestionElement = () => {
    const q = _g.iter.q;
    const work = _g.iter.work;

    let question = document.createElement("div");
    question.classList.add("d-question");
    switch (q) {
        case 0: question.innerHTML = `Какъв е <b>жанра</b> на творбата "${work.title}"?`; break;
        case 1: question.innerHTML = `Кой е <b>автора</b> на творбата "${work.title}"?`; break;
        case 2: question.innerHTML = `От коя <b>тема</b> е творбата "${work.title}"?`; break;
        case 3: question.innerHTML = `Кое произведение е от темата за <b>${work.section}</b> с автор <b>${work.author}</b>?`; break;
        default:
            console.error("question type not found");
            return "Error!";
    }

    return question;
};

const getAnswerElement = (ans, real_ans) => {
    console.assert(ans.length == 4);
    let answers = document.createElement("div");
    answers.classList.add("d-ans");

    ans.forEach(a => {
        let answer = document.createElement("div");
        answer.innerText = a;
        answer.onclick = revealAnswer;
        if (a === real_ans) {
            answer.classList.add("correct");
        }
        answers.appendChild(answer);
    });

    return answers;
}

const revealAnswer = (event) => {
    // if not clicked -> don't execute
    if (event.target.parentElement.classList.contains("reveal")) return;
    event.target.classList.add("clicked");
    event.target.parentElement.classList.add("reveal");
    _g.gamefield.classList.add("reveal-delete");

    // TODO: Save to browser storage
    // Scoring
    if (event.target.classList.contains("correct")) {
        _g.score.correct += 1;
        _g.score.correct_in_row += 1;
    }
    else {
        _g.score.correct_in_row = 0;
    }
    _g.score.total += 1;
};
