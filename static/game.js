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
    _g.iter.q = getQuestionType();

    const real_ans = getRealAnswer();
    let ans = getAnswers();
    ans = ans.sort(() => Math.random() - 0.5);
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
const getAnswers = () => {
    const data = _g.data;
    const q = _g.iter.q;
    const works = _g.iter.works;
    // helper functions
    const genRandomGenre = () => {
        while(true) {
            const random_idx = Math.floor(Math.random() * data.length);
            const new_genre = data[random_idx].genre;
            if (genres.indexOf(new_genre) == -1) { return new_genre; }
        }
    }

    // assume q = 0 for now
    console.assert(q === 0);
    // we'll do just title -> genres as PoC

    let genres = works.map(x => x.genre).filter(unique);
    console.assert(genres.length <= 3);
    while (genres.length < 4) {
        genres.push(genRandomGenre());
    }
    console.assert(genres.length == 4);

    return genres;
};
const getRealAnswer = () => {
    const q = _g.iter.q;
    const work = _g.iter.work;
    // assume q = 0 for now
    console.assert(q === 0);
    return work.genre;
};
const getQuestionElement = () => {
    const q = _g.iter.q;
    const work = _g.iter.work;

    let question = document.createElement("div");
    question.classList.add("d-question");

    // assume only asking for genre for now
    console.assert(q === 0);
    question.innerHTML = `Какъв е <b>жанра</b> на творбата "${work.title}"?`;

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
