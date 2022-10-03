// Querying and storing elements from the DOM
let puzzle = document.querySelector("#puzzle");

const createElement = (numberRoot) => {
	let innerHtml = "";
	for (let i = 0; i < numberRoot ** 2 + 1; i++) {
		innerHtml += `<li class="puzzle-piece-wrapper wrapper${Number(
			i
		)}"><img class="puzzle-piece piece${Number(
			i
		)}"src="./files/one.jpg" alt=""></li>`;
	}
	puzzle.innerHTML = innerHtml;
};

const styleElement = (numberRoot) => {
	number = numberRoot ** 2 + 1;

	let gridAreaString = `"${'.'.repeat(numberRoot-1)}  box0"`
	// let gridAreaString = ` `
	let gridLineString = '"';
	for (let i = 1; i < number; i++) {
		if (i % numberRoot !== 0) {
			gridLineString += ` box${i} `;
		} else {
			gridLineString += ` box${i} "`;
			gridAreaString += gridLineString;
			gridLineString = '"';
		}
	}
	console.log(gridAreaString)
	puzzle.style.gridTemplateAreas = `${gridAreaString}`;

	puzzle.style.gridTemplateRows = `${(60 / numberRoot + "vw ").repeat(
		numberRoot +1
	)}`;

	puzzle.style.gridTemplateColumns = ` ${(90 / numberRoot + "vw ").repeat(
		numberRoot
	)}`;
	for (let i = 1; i < number; i++) {
		let puzzlePiece = document.querySelector(`.piece${Number(i)}`);
		puzzlePiece.style.width = `${numberRoot * 100}% `;
		puzzlePiece.style.left = `-${((i - 1) % numberRoot) * 100}% `;
		puzzlePiece.style.top = `-${Math.floor(i / numberRoot - 0.01) * 100}% `;
	}

	for (let i = 0; i < number; i++) {document.querySelector(`.wrapper${i}`).style.gridArea = `box${i}`}
};

const clickHandler = () => {
	Array.from(document.querySelectorAll("[class^=puzzle-piece-wrapper]")).map(
		(wrapper) => {
			console.log(wrapper);
			wrapper.addEventListener("click", () => console.log("clickedd"));
		}
	);
};

const createGame = (difficulty) => {
	createElement(7);
	styleElement(7);
	clickHandler();
};

createGame("a");
