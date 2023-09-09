const start = document.querySelector('#start')
const modal = document.querySelector('#modal')
const levelSelector = document.querySelector('#level')
const restartButton = document.querySelector('#restart')
const victory = document.querySelector('#victory')
victory.style.display='none'

const unique = (referenceType) => JSON.parse(JSON.stringify(referenceType));


const startHandler =()=>{
modal.style.display="none"
const level = levelSelector.value==="one"?  3 :
                levelSelector.value==="two"?  4 : 
                 levelSelector.value==="three"?  5 : 6

const blank_id = level * 10 + level;

const orderedPositions = [...Array(level).keys()].map((row) => [
  ...Array.from({ length: level }, (_, i) => i + (10 * row + 11)),
]);



const shuffleArray = (array)=> {
  const shuffled = unique(array)
  for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled
}
const orderedPositionsTemp = unique(orderedPositions).flat();
let randomPositions = shuffleArray(orderedPositionsTemp.filter(i=>i!==blank_id))
randomPositions.push(blank_id);
randomPositions = randomPositions
  .map((e, i) => (i % level === 0 ? randomPositions.slice(i, i + level) : null))
  .filter((t) => t);

const puzzle = document.querySelector(".puzzle");
const [vh, vw] = [window.innerHeight / 100, window.innerWidth / 100];
for (i = 1; i < level + 1; i++) {
  for (j = 1; j < level + 1; j++) {
    const [id, location] = [`${i}${j}`, randomPositions[i - 1][j - 1]];
    puzzle.insertAdjacentHTML(
      "beforeend",
      `<li  id="w${id}" class="puzzle-piece-wrapper" style="grid-area:g${location};">
		 <img
		  class="puzzle-piece "
		  src="./files/${id === `${blank_id}` ? "white.jpg" : "one.jpg"}"
		  alt="piece${id}"
		  height=${vw * 80}px
		  width=${vw * 80}px
		  style="top:${100 - 100 * i}%; right:${100 * j - 100 * level}%; "
		 />
	   </li>`
    );
  }
}


const gridArea = orderedPositions.map((r) => '"g' + r.join(" g") + '"').join("");
puzzle.style.gridTemplateAreas = gridArea;
const puzzlePieces = Array.from(document.querySelectorAll(".puzzle-piece"));
const puzzleWrappers = Array.from(document.querySelectorAll("[id^='w']"));


window.addEventListener("resize", (e) =>
  puzzlePieces.map((piece) => {
    const [vh, vw] = [e.target.innerHeight / 100, e.target.innerWidth / 100];
    piece.style.height = `${vw * 80}px`;
    piece.style.width = `${vw * 80}px`;
  })
);


const colorize = (ids, color) => {
  ids.map(
    (id) => (document.querySelector(`#w${id}`).style.borderColor = color)
  );
};

const indexer = (array, value) => {
  return array
    .map((position, index) =>
      position.includes(value) ? [index, position.indexOf(value)] : null
    )
    .filter((a) => a)
    .flat();
};



const legalNeighborsGetter = (gridArea) => {
  const [higher, lower] = indexer(orderedPositions, gridArea);
  const neighbourRelativePosition = [
    [higher, lower - 1],
    [higher, lower + 1],
    [higher - 1, lower],
    [higher + 1, lower],
  ];
  const neighbors = neighbourRelativePosition
    .map((position) => {
      if (
        position[0] >= 0 &&
        position[0] < level &&
        position[1] >= 0 &&
        position[1] < level
      ) {
        return orderedPositions[position[0]][position[1]];
      }
    })
    .filter((a) => a);
  return neighbors;
};

let spaceGridArea = blank_id;
const defaultSelected = {
  expecting: false,
  id: 0,
  legalNeighboursAreas: [],
  spaceGridArea,
};
let selected = unique(defaultSelected);
const clickHandler = (e) => {
  colorize(orderedPositions.flat(), "black");
  const gridArea = Number(
    e.currentTarget.style.gridArea.split(" ")[0].replace("g", "")
  );
  const id = Number(e.currentTarget.id.replace("w", ""));
  const legalNeighboursAreas =
    gridArea === spaceGridArea
      ? legalNeighborsGetter(gridArea)
      : legalNeighborsGetter(gridArea).includes(spaceGridArea)
      ? [spaceGridArea]
      : [];
  const legalNeighboursIds = legalNeighboursAreas.map((gridArea) => {
    const [idLead, idLag] = indexer(randomPositions, gridArea);
    return orderedPositions[idLead][idLag];
  });
  const potentialSelected = {
    expecting: true,
    id,
    gridArea,
    legalNeighboursAreas,
    legalNeighboursIds,
    spaceGridArea,
  };

  if (!selected.expecting) {
    selected = unique(potentialSelected);
  } else if (id === selected.id) {
    selected = unique(defaultSelected);
  } else if (
    selected.legalNeighboursIds.includes(id) &&
    (id === blank_id || selected.id === blank_id)
  ) {
    const [areaOne, areaTwo] = [selected.gridArea, gridArea];
    document.querySelector("#w" + id).style.gridArea =
      "g" + Array(4).fill(areaOne).join(" / g");
    document.querySelector("#w" + selected.id).style.gridArea =
      "g" + Array(4).fill(areaTwo).join(" / g");
    console.log(id, selected.id, gridArea, selected.gridArea);
    console.log(unique(orderedPositions), unique(randomPositions));
    const [fromIndex, toIndex] = [
      indexer(orderedPositions, selected.id),
      indexer(orderedPositions, id),
    ];
    const [oldRandomOne, oldRandomTwo] = [
      randomPositions[fromIndex[0]][fromIndex[1]],
      randomPositions[toIndex[0]][toIndex[1]],
    ];
    randomPositions[fromIndex[0]][fromIndex[1]] = oldRandomTwo;
    randomPositions[toIndex[0]][toIndex[1]] = oldRandomOne;
    spaceGridArea = gridArea;

    selected = unique(defaultSelected);
  } else {
    selected = unique(potentialSelected);
  }

  selected.expecting
    ? id === blank_id || selected.legalNeighboursIds.includes(blank_id)
      ? (colorize(selected.legalNeighboursIds, "white"),
        colorize([id], "orange"))
      : colorize([id], "red")
    : null;

const gameState = puzzleWrappers.reduce((acc, wrap)=>{
  const [final, current] = [Number(wrap.id.replace('w','')), Number(wrap.style.gridArea.slice(1,3))]
  console.log(acc, final===current, acc && final===current)
  return acc && final===current
} , true)

if (gameState){
  victory.style.display=''
}
};

puzzleWrappers.map((piece) => {
  piece.addEventListener("click", clickHandler);

});
restartButton.addEventListener('click', ()=>{
  location.reload()
})
}


start.addEventListener('click',startHandler)
