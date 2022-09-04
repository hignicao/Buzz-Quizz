let allQuizzes = [];
let myQuizzes = [];
let quizzTitle = "";
let quizzImage = "";
let quizzNumQuestions = 0;
let quizzNumLevels = 0;
let quizzInGame = {
	gameOn: false,
	selected: 0,
	questions: 0,
	rightAnswers: 0,
	levelsStorage: 0,
	id: 0,
};

const url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

callLocalStorage();
getAllQuizzes();
renderMyQuizzes();
document.querySelector(".basic-info-button").onclick = goToFormQuestions;

function getAllQuizzes() {
	const promisse = axios.get(`${url}`);
	promisse.then(renderAllQuizzes);
}

function renderAllQuizzes(data) {
	allQuizzes = data.data;

	document.querySelector(".loading-all-quizzes-wrapper").classList.add("hidden");

	const quizzes = document.querySelector(".all-quizzes__quizz-list");
	quizzes.innerHTML = "";

	for (let i = 0; i < allQuizzes.length; i++) {
		quizzes.innerHTML += `
			<article onclick="enterQuizz(${allQuizzes[i].id})" class="quizz-list__quizz" data-identifier="quizz-card">
				<img src="${allQuizzes[i].image}" alt="">
				<div class="quizz-list__quizz__gradient"></div>
				<span>${allQuizzes[i].title}</span>
			</article>
		`;
	}
}

function renderMyQuizzes() {
	if (myQuizzes.length === 0) {
		return;
	} else {
		const quizzes = document.querySelector(".my-quizzes__quizz-list");
		quizzes.innerHTML = "";
		for (let i = 0; i < myQuizzes.length; i++) {
			quizzes.innerHTML += `
      <article onclick="enterQuizz(${myQuizzes[i].id})" class="quizz-list__quizz" data-identifier="quizz-card">
        <img src="${myQuizzes[i].image}" alt="">
        <div class="quizz-list__quizz__gradient"></div>
        <span>${myQuizzes[i].title}</span>
				<div class="edit-delete">
				<ion-icon onclick="editQuizz(${myQuizzes[i].id})" name="create-outline"></ion-icon>
				<ion-icon onclick="deleteQuizz(${myQuizzes[i].id})" name="trash-outline"></ion-icon>
			</div>
      </article>
      `;
		}
		document.querySelector(".my-quizzes__zero-quizzes").classList.add("hidden");
		document.querySelector(".my-quizzes__some-quizzes").classList.remove("hidden");
	}
}

function goToFormQuestions() {
	if (validateBasicInfo() === true) {
		gettingBasicInfo();
		document.querySelector(".creation-basic-info").classList.add("hidden");
		document.querySelector(".creation-questions").classList.remove("hidden");
	}
}

function goToFormLevels() {
	if (validateFormQuestions() === true) {
		document.querySelector(".creation-questions").classList.add("hidden");
		document.querySelector(".creation-levels").classList.remove("hidden");
	}
}

function goToSucessPageForm() {
	if (validateLevels()) {
		document.querySelector(".creation-levels").classList.add("hidden");
		document.querySelector(".created-quiz").classList.remove("hidden");
		sendNewQuizz();
	}
}

function gettingBasicInfo() {
	const answers = getBasicInfo();

	quizzTitle = answers.title;
	quizzImage = answers.image;
	quizzNumQuestions = answers.questions;
	quizzNumLevels = answers.levels;

	renderQuestions(quizzNumQuestions);
	renderLevels(quizzNumLevels);

	document.querySelector(".questions-button").onclick = goToFormLevels;
	document.querySelector(".submit-button").onclick = goToSucessPageForm;
}

function renderQuestions(numQuestions) {
	const questions = document.querySelector(".creation-questions");

	questions.innerHTML = `
    <legend>Crie suas perguntas</legend>

    <div class="question-wrapper question-1" data-identifier="question-form">
      <div class="question-header-cr">
        <h2>Pergunta 1</h2>
        <img onclick="showQuestion(this)" src="src/images/edit.svg" alt="edit icon" data-identifier="expand">
      </div>

      <div class="question-body">
        <input type="text" id="question-text" name="question-text" placeholder="Texto da pergunta">
        <label for="question-text"></label>

        <div class="color-picker">
              <label for="question-background">Cor de fundo da pergunta:</label>
              <input type="color" id="question-background" name="question-background" placeholder="Cor de fundo da pergunta">
        </div>
          
        <h2 class="correct-answer-info">Resposta correta</h2>

        <input type="text" id="correct-answer" name="question-correct-answer" placeholder="Resposta correta" class="question-body__answer">
        <label for="correct-answer"></label>

        <input type="url" id="correct-answer-image" name="correct-answer-image" placeholder="URL da imagem" class="answers-image question-body__answer">
        <label for="correct-answer-image"></label>

        <h2 class="incorrect-answer-info">Respostas incorretas</h2>

        <input type="text" id="incorrect-answer-1" name="incorrect-answer-1" placeholder="Resposta incorreta 1" class="incorrect-answers question-body__answer">
        <label for="incorrect-answer-1"></label>

        <input type="url" id="incorret-image-1" name="incorrect-image-1" placeholder="URL da imagem 1" class="answers-image question-body__answer">
				<label for="incorrect-image-1"></label>

        <input type="text" id="incorrect-answer-2" name="incorrect-answer-2" placeholder="Resposta incorreta 2" class="incorrect-answers question-body__answer">
        <label for="incorrect-answer-2"></label>

        <input type="url" id="incorrect-image-2" name="incorrect-image-2" placeholder="URL da imagem 2" class="answers-image question-body__answer">
        <label for="incorrect-image-2"></label>
          
        <input type="text" id="incorrect-answer-3" name="incorrect-answer-3" placeholder="Resposta incorreta 3" class="incorrect-answers question-body__answer">
        <label for="incorrect-answer-3"></label>

        <input type="url" id="incorrect-image-3" name="incorrect-answer-3" placeholder="URL da imagem 3" class="answers-image question-body__answer">
        <label for="incorrect-image-3"></label>
      </div>
    </div>
  `;

	for (let i = 2; i <= numQuestions; i++) {
		questions.innerHTML += `
      <div class="question-wrapper question-${i}" data-identifier="question-form">
        <div class="question-header-cr">
          <h2>Pergunta ${i}</h2>
          <img onclick="showQuestion(this)" src="src/images/edit.svg" alt="edit icon" data-identifier="expand">
        </div>

        <div class="question-body hidden" data-identifier="question-form">
          <input type="text" id="question-text" name="question-text" placeholder="Texto da pergunta">
          <label for="question-text"></label>

          <div class="color-picker">
              <label for="question-background">Cor de fundo da pergunta:</label>
              <input type="color" id="question-background" name="question-background" placeholder="Cor de fundo da pergunta">
          </div>
          
          <h2 class="correct-answer-info">Resposta correta</h2>

          <input type="text" id="correct-answer" name="question-correct-answer" placeholder="Resposta correta" class="question-body__answer">
          <label for="correct-answer"></label>

          <input type="url" id="correct-answer-image" name="correct-answer-image" placeholder="URL da imagem" class="answers-image question-body__answer">
          <label for="correct-answer-image"></label>

          <h2 class="incorrect-answer-info">Respostas incorretas</h2>

          <input type="text" id="incorrect-answer-1" name="incorrect-answer-1" placeholder="Resposta incorreta 1" class="incorrect-answers question-body__answer">
          <label for="incorrect-answer-1"></label>

          <input type="url" id="incorret-image-1" name="incorrect-image-1" placeholder="URL da imagem 1" class="answers-image question-body__answer">
		  		<label for="incorrect-image-1"></label>

          <input type="text" id="incorrect-answer-2" name="incorrect-answer-2" placeholder="Resposta incorreta 2" class="incorrect-answers question-body__answer">
          <label for="incorrect-answer-2"></label>

          <input type="url" id="incorrect-image-2" name="incorrect-image-2" placeholder="URL da imagem 2" class="answers-image question-body__answer">
          <label for="incorrect-image-2"></label>
          
          <input type="text" id="incorrect-answer-3" name="incorrect-answer-3" placeholder="Resposta incorreta 3" class="incorrect-answers question-body__answer">
          <label for="incorrect-answer-3"></label>

          <input type="url" id="incorrect-image-3" name="incorrect-answer-3" placeholder="URL da imagem 3" class="answers-image question-body__answer">
          <label for="incorrect-image-3"></label>
        </div>
      </div>
    `;
	}

	questions.innerHTML += `
  <button type="button" class="questions-button">Prosseguir para criar níveis</button>
  `;
}

function renderLevels(numLevels) {
	const levels = document.querySelector(".creation-levels");

	levels.innerHTML = `
    <legend>Agora, decida os níveis</legend>
            
    <div class="levels-wrapper level-1" data-identifier="level">
      <div class="level-header">
        <h2>Nível 1</h2>
        <img onclick="showLevel(this)" src="src/images/edit.svg" alt="edit icon" data-identifier="expand">
      </div>

      <div class="level-body" data-identifier="level">
        <input type="text" id="title-level-1" name="title-level-1" placeholder="Título do nível">
        <label for="title-level-1"></label>

        <input type="number" id="percentage-level-1" name="percentage-level-1" placeholder="% de acerto mínima">
        <label for="percentage-level-1"></label>

        <input type="url" id="image-level-1" name="image-level-1" placeholder="URL da imagem do nível">
        <label for="image-level-1"></label>

        <input type="text" id="description-level-1" name="description-level-1" placeholder="Descrição do nível">
        <label for="description-level-1"></label>
      </div>
    </div>
  `;

	for (let i = 2; i <= numLevels; i++) {
		levels.innerHTML += `
      <div class="levels-wrapper level-${i}" data-identifier="level">
        <div class="level-header">
          <h2>Nível ${i}</h2>
          <img onclick="showLevel(this)" src="src/images/edit.svg" alt="edit icon" data-identifier="expand">
        </div>

        <div class="level-body hidden">
          <input type="text" id="title-level-${i}" name="title-level-${i}" placeholder="Título do nível">
          <label for="title-level-${i}"></label>

          <input type="number" id="percentage-level-${i}" name="percentage-level-${i}" placeholder="% de acerto mínima" min="0">
          <label for="percentage-level-${i}"></label>

          <input type="url" id="image-level-${i}" name="image-level-${i}" placeholder="URL da imagem do nível" min="0">
          <label for="image-level-${i}"></label>

          <input type="text" id="description-level-${i}" name="description-level-${i}" placeholder="Descrição do nível">
          <label for="description-level-${i}"></label>
        </div>
      </div>
    `;
	}

	levels.innerHTML += `
  <button type="button" class="submit-button">Finalizar Quizz</button>
  `;
}

function renderCreatedQuizz() {
	const quizz = document.querySelector(".created-quiz");
	const answers = getBasicInfo();
	const id = getQuizzID();

	quizzTitle = answers.title;
	quizzImage = answers.image;

	quizz.innerHTML = `
    <h3>Seu quizz está pronto!</h3>
    <article class="created-quiz-image">
      <img onclick="enterQuizz(${id})" src="${quizzImage}" alt="">
      <div class="created-quiz-image__gradient"></div>
      <span>${quizzTitle}</span>
    </article>
    <button onclick="enterQuizz(${id})" class="open-quiz-button">Acessar Quiz</button>
    <button onclick="backToMain()" class="homepage-button">Voltar para home</button>
  `;
}

function showQuestion(element) {
	const question = element.parentNode.parentNode.querySelector(".question-body");
	question.classList.toggle("hidden");
}

function showLevel(element) {
	const level = element.parentNode.parentNode.querySelector(".level-body");
	level.classList.toggle("hidden");
}

function backToMain() {
	document.querySelector(".main-screen").classList.remove("hidden");
	document.querySelector(".quizz-screen").classList.add("hidden");
	document.querySelector(".creation-screen").classList.add("hidden");
	document.location.reload(true);
}

function createNewQuizz() {
	document.querySelector(".main-screen").classList.add("hidden");
	document.querySelector(".creation-screen").classList.remove("hidden");
}

function enterQuizz(id) {
	document.querySelector(".quizz-screen").classList.remove("end-screen-update-space");
	document.querySelector(".creation-screen").classList.add("hidden");
	document.querySelector(".main-screen").classList.add("hidden");
	document.querySelector(".quizz-screen").classList.remove("hidden");
	document.querySelector(".rendering-quizz-wrapper").classList.add("hidden");
	downloadQuizz(id);
}

function getBasicInfo() {
	const answers = document.querySelector(".basic-info-wrapper");

	quizzTitle = answers.querySelector("#basic-title").value;
	quizzImage = answers.querySelector("#basic-img").value;
	quizzNumQuestions = parseInt(answers.querySelector("#basic-questions").value);
	quizzNumLevels = parseInt(answers.querySelector("#basic-levels").value);

	const info = {
		title: quizzTitle,
		image: quizzImage,
		questions: quizzNumQuestions,
		levels: quizzNumLevels,
	};

	return info;
}

const validateQuizTitle = (title) => {
	if (title.length < 20) {
		alert("O título deve ter pelo menos 20 caracteres!");
		return false;
	} else if (title.length > 65) {
		alert("O título pode ter no máximo 65 caracteres!");
		return false;
	} else {
		return true;
	}
};

const validateImageUrl = (string) => {
	const regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

	if (!regex.test(string)) {
		alert("O endereço da imagem deve ser uma URL");
		return false;
	} else {
		return true;
	}
};

const validateNumberQuestions = (questions) => {
	if (questions < 3) {
		alert("O número de questões deve ser maior ou igual a 3");
		return false;
	} else {
		return true;
	}
};

const validateNumberLevels = (levels) => {
	if (levels < 2) {
		alert("O número de níveis deve ser maior ou igual a 2");
		return false;
	} else {
		return true;
	}
};

const validateBasicInfo = () => {
	const basicInfo = getBasicInfo();

	const validatedTitle = validateQuizTitle(basicInfo.title);
	const validatedImage = validateImageUrl(basicInfo.image);
	const validatedQuestions = validateNumberQuestions(basicInfo.questions);
	const validatedLevels = validateNumberLevels(basicInfo.levels);

	if (validatedTitle && validatedImage && validatedQuestions && validatedLevels) {
		return true;
	} else {
		return false;
	}
};

const validateQuestionText = () => {
	const questions = document.querySelectorAll("input[name=question-text]");

	for (let i = 0; i < questions.length; i++) {
		let question = questions[i];
		let text = question.value;

		if (text.length === 0) {
			alert("O texto das perguntas não pode ficar em branco");
			return false;
		} else if (text.length < 20) {
			alert("O texto da pergunta deve ter pelo menos 20 caracteres");
			return false;
		}
	}

	return true;
};

const validateQuestionBackground = () => {
	const backgrounds = document.querySelectorAll("input[name=question-background]");
	const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

	for (let i = 0; i < backgrounds.length; i++) {
		let bg = backgrounds[i];
		let color = bg.value;

		if (!regex.test(color)) {
			alert("A cor de fundo deve ser uma cor hexadecimal");
			return false;
		}
	}

	return true;
};

const validateCorrectAnswer = () => {
	const answers = document.querySelectorAll("input[name=question-correct-answer]");

	if (answers.length === 0) {
		alert("Cada pergunta tem que ter pelo menos uma resposta correta");
		return false;
	}

	for (let i = 0; i < answers.length; i++) {
		let answer = answers[i].value;

		if (answer.length === 0) {
			alert("Cada pergunta tem que ter pelo menos uma resposta correta");
			return false;
		}
	}

	return true;
};

const validateIncorrectAnswer = () => {
	const answers = document.querySelectorAll("input[name=incorrect-answer-1]");

	for (let i = 0; i < answers.length; i++) {
		let answer = answers[i].value;

		if (answer.length === 0) {
			alert("Cada pergunta deve ter pelo menos uma resposta incorreta");
			return false;
		}
	}

	return true;
};

const validateAnswersImages = () => {
	const images = document.querySelectorAll(".answers-image");
	const regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

	for (let i = 0; i < images.length; i++) {
		let image = images[i].value;

		if (image !== "" && !regex.test(image)) {
			alert("A imagem deve ser uma URL");
			return false;
		}
	}

	return true;
};

const urlRegex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
const validateAnswerURLPair = () => {
	const answerTypes = ["question-correct-answer", "incorrect-answer-1", "incorrect-answer-2", "incorrect-answer-3"];

	for (let i = 0; i < answerTypes.length; i++) {
		const answerType = answerTypes[i];
		const selector = `input[name=${answerType}]`;
		const answers = document.querySelectorAll(selector);

		for (let j = 0; j < answers.length; j++) {
			const answer = answers[j];
			const url = answer.nextElementSibling.nextElementSibling;

			if (answer.value !== "" && url && !urlRegex.test(url.value)) {
				alert("Cada resposta deve conter uma URL correspondente.");
				return false;
			}
		}
	}
	return true;
};

const validateFormQuestions = () => {
	if (validateQuestionText() === true && validateCorrectAnswer() === true && validateIncorrectAnswer() === true && validateAnswersImages() === true && validateAnswerURLPair() === true) {
		return true;
	}
};

function validateLevels() {
	const numOfQuestEachLevel = 4;
	const regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	const getLevelNodes = document.querySelectorAll(".level-body");
	let trueValidations = 0;
	getLevelNodes.forEach((parentNode, ind) => {
		//Getting each value (of each Level)
		const values = {
			title: parentNode.querySelector("input[placeholder='Título do nível']").value,
			percentage: parentNode.querySelector("input[placeholder='% de acerto mínima']").value,
			url: parentNode.querySelector("input[placeholder='URL da imagem do nível']").value,
			description: parentNode.querySelector("input[placeholder='URL da imagem do nível']").value,
		};
		//----------------------Checking each value-----------------------//
		//Título do nível: mínimo de 10 caracteres
		values.title.length >= 10 ? trueValidations++ : alert(`Título do Nível ${ind} com problema`);

		//% de acerto mínima: um número entre 0 e 100
		values.percentage <= 100 && values.percentage >= 0 ? trueValidations++ : alert(`% de acerto do nível ${ind} está com problemas`);

		//URL da imagem do nível: deve ter formato de URL
		regex.test(values.url) ? trueValidations++ : alert(`Url do nível ${ind} não é válido`);

		//Descrição do nível: mínimo de 30 caracteres
		values.description.length >= 30 ? trueValidations++ : alert(`A descrição do Nível ${ind} está inválida`);
	});
	//É obrigatório existir pelo menos 1 nível cuja % de acerto mínima seja 0%
	for (let i = 0; i < getLevelNodes.length; i++) {
		if (getLevelNodes[i].querySelector("input[placeholder='% de acerto mínima']").value === "0") {
			trueValidations++;
			break;
		} else if (i === getLevelNodes.length - 1) {
			alert(`Pelo menos um nível deve ter a porcentagem 0`);
		}
	}
	return trueValidations === getLevelNodes.length * numOfQuestEachLevel + 1 ? true : false;
}

function newQuizz() {
	const info = getBasicInfo();
	const newQuizz = {
		title: "",
		image: "",
		questions: [],
		levels: [],
	};

	const questions = Array.from(document.querySelectorAll(".question-body")).map((el) => {
		return {
			title: el.querySelector("input[name='question-text'").value,
			color: el.querySelector("input[name='question-background").value,
			answers: Array.from(el.querySelectorAll(".question-body__answer"))
				.map((el, ind, arr) => {
					return ind % 2 === 0 ? { text: arr[ind].value, image: arr[(ind += 1)].value, isCorrectAnswer: quizzGetCorrectAnswer(el) } : "";
				})
				.filter((el) => el !== "" && el !== null && !(el.image === "" || el.text === "")),
		};
	});

	const levels = Array.from(document.querySelectorAll(".level-body")).map((el) => {
		const levelInputs = el.querySelectorAll("input");
		return {
			title: levelInputs[0].value,
			image: levelInputs[2].value,
			text: levelInputs[3].value,
			minValue: parseInt(levelInputs[1].value),
		};
	});
	newQuizz.title = info.title;
	newQuizz.image = info.image;
	newQuizz.questions = questions;
	newQuizz.levels = levels;

	return newQuizz;
}

function quizzGetCorrectAnswer(el) {
	if (el.getAttribute("name") === "question-correct-answer") {
		return true;
	} else {
		return false;
	}
}

async function downloadQuizz(id) {
	const promise = await axios.get(`${url}/${id}`);
	data = promise.data;

	quizzInGame = {
		gameOn: true,
		selected: 0,
		questions: data.questions.length,
		rightAnswers: 0,
		levelsStorage: data.levels,
		id: id,
	};

	quizzHtmlCreation(data);
}

function quizzHtmlCreation(data) {
	const quizzObject = randomizeQuizz(data);
	const newHTML = `
    <section class="quizz-header">
      <p class="quizz-header__title">${quizzObject.title}</p>
      <div class="quizz-header-opacity">
        <img draggable="false" src="${quizzObject.image}" alt=""/>
      </div>
    </section>
    <section class="quizz-questions">
      ${quizzObject.questions
				.map((el) => {
					return `
          <div class="quizz-questions__quizz-box">
            <div class="quizz-question-header-div" style="background-color:${el.color}" data-identifier="question">
              <p class="question-header">${el.title}</p>
            </div>
            <div class="quizz-questions-options-div">
      
            ${el.answers
							.map((newEl) => {
								return `
                <div onclick='checkCorrect(this)' class="questions-answer ${newEl.isCorrectAnswer ? "correct-answer" : "wrong-answer"}" data-identifier="answer">
                  <img draggable="false" src=${newEl.image} alt="" class="answer-img">
                  <p class="answer-p">${newEl.text}</p>
                </div>
              `;
							})
							.reduce((acc, el) => acc + el, "")}
      
            </div>
          </div>
        `;
				})
				.reduce((acc, el) => acc + el, "")}
    </section>
    `;
	renderQuizz(newHTML);
}

function renderQuizz(render) {
	document.querySelector(".quizz-screen").innerHTML += render;
}

function sendNewQuizz() {
	const quizz = newQuizz();

	const promisse = axios.post(`${url}`, quizz);
	promisse.then(getQuizzInfo);
}

function getQuizzInfo(data) {
	callLocalStorage();

	myQuizzes.push(data.data);

	sendToLocalStorage();
	renderMyQuizzes();
	renderCreatedQuizz();
}

function sendToLocalStorage() {
	const myQuizzesSerialized = JSON.stringify(myQuizzes);
	localStorage.setItem("myQuizzes", myQuizzesSerialized);
}

function callLocalStorage() {
	const myQuizzesSerialized = localStorage.getItem("myQuizzes");

	if (myQuizzesSerialized !== null) {
		myQuizzes = JSON.parse(myQuizzesSerialized);
	}
}

function getQuizzID() {
	const id = myQuizzes[myQuizzes.length - 1].id;
	return id;
}

function randomizeQuizz(quiz) {
	let questions = quiz.questions;
	for (let i = 0; i < 5; i++) {
		questions.forEach((el) =>
			el.answers.forEach((el, ind, arr) => {
				const newInd = Math.floor(Math.random() * arr.length);
				const tmpEl = arr[newInd];
				arr[newInd] = el;
				arr[ind] = tmpEl;
			})
		);
	}
	quiz.questions = questions;

	return quiz;
}

function checkCorrect(el) {
	const parentNode = el.closest(".quizz-questions-options-div");
	parentNode.querySelectorAll('div[onclick="checkCorrect(this)"]').forEach((el) => el.removeAttribute("onclick")); //Removes all onClicks
	el.classList.add("lock-selected");
	parentNode.querySelectorAll(".questions-answer:not(.lock-selected)").forEach((el) => el.classList.add("lock-unselected"));
	parentNode.querySelector(".correct-answer").classList.add("color-right");
	parentNode.querySelectorAll(".wrong-answer").forEach((el) => el.classList.add("color-wrong"));
	el.getAttribute("class").includes("correct-answer") ? (quizzInGame.gameOn === true ? (quizzInGame.rightAnswers += 1) : "") : 0;
	quizzInGame.selected += 1;
	checkEndGame();

	quizzInGame.selected !== 0 && quizzInGame.selected !== quizzInGame.questions
		? setTimeout(() => {
				el.closest(".quizz-questions__quizz-box").nextElementSibling.scrollIntoView({ behavior: "smooth", block: "center" });
		  }, 2000)
		: null;
}

function checkEndGame() {
	quizzInGame.questions === quizzInGame.selected ? loadEndGame() : "";
}

function loadEndGame() {
	const percentage = parseFloat((quizzInGame.rightAnswers / quizzInGame.questions).toFixed(2)) * 100;
	const getRightLevel = quizzInGame.levelsStorage.reduce((acc, el) => (percentage - el.minValue > 0 && el.minValue > acc.minValue ? el : acc));
	const finalHTML = `
	<section class="quizz-completed">
	<div class="quizz-completed__inner-box">
	  <div class="quizz-completed-header-div">
		<p class="completed-status-header">${percentage}% de acerto: ${getRightLevel.title}</p>
	  </div>
	  <div class="quizz-completed-main-content" data-identifier="quizz-result">
		<img src="${getRightLevel.image}" alt="">
		<p>${getRightLevel.text}</p>
	  </div>
	</div>
	<div class="quizz-completed__buttons">
		<button class="quizz-completed__restart-quizz">Reiniciar Quizz</button>
		<p onclick="backToMain()" class="quizz-completed__go-home">Voltar pra home</p>
	</div>
	</section>
	
	`;

	renderQuizz(finalHTML);
	document.querySelector(".quizz-screen").classList.add("end-screen-update-space");
	setTimeout(() => {
		document.querySelector(".quizz-completed").scrollIntoView({ behavior: "smooth" });
	}, 2000);

	quizzInGame.gameOn = false;

	document.querySelector(".quizz-completed__restart-quizz").onclick = () => {
		resetQuizz();
		enterQuizz(quizzInGame.id);
	};
}

function resetQuizz() {
	document.querySelector(".quizz-screen").innerHTML = `
	<div class="rendering-quizz-wrapper">
					<div class="loading-all-quizzes">
						<div class="lds-ripple">
							<div></div>
							<div></div>
						</div>
						<p>Carregando o Quizz...</p>
					</div>
				</div>
	`;
}

function deleteQuizz(id) {
	const answer = confirm("Tem certeza que deseja deletar esse quizz?");

	if (answer) {
		const quizzSorted = myQuizzes.filter((el) => el.id === id);
		const myOtherQuizzes = myQuizzes.filter((el) => el.id !== id);

		myQuizzes = myOtherQuizzes;
		sendToLocalStorage();

		const headers = {
			"Secret-Key": quizzSorted[0].key,
		};

		axios.delete(`${url}/${id}`, { headers }).then(() => {
			alert("Quizz Deletado");
			window.location.reload();
		});
	} else {
		window.location.reload();
	}
}
