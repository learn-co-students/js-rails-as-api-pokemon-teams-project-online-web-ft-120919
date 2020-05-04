const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

// sends get request to trainers index route and builds trainer card for each trainer in json response
function loadTrainers() {
  fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(json => json.forEach(trainer => displayTrainer(trainer)))
}

// receives json object of pokemon data and targeted dom element, builds and displays li with click listeners
function addPokemonToList(pokemon, list) {
  const pokLi = document.createElement("li")
  const pokInfo = document.createTextNode(`${pokemon.nickname} (${pokemon.species})`)
  const releaseBtn = document.createElement("button")
  const release = document.createTextNode("Release")
  releaseBtn.classList.add("release")
  releaseBtn.setAttribute("data-pokemon-id", pokemon.id)
  releaseBtn.appendChild(release)
  pokLi.appendChild(pokInfo)
  pokLi.appendChild(releaseBtn)
  list.appendChild(pokLi)

  // add listener to release button
  releaseBtn.addEventListener("click", (e) => {
    const pokemonId = e.target.getAttribute("data-pokemon-id")
    removePokemonFromTeam(pokemonId)
  })
}

// builds a trainer card in document from json data containing info about team pokemon
function displayTrainer(trainer) {
  // ***  DELETE
  console.log(trainer);

  // div card
  const card = document.createElement("div");
  card.classList.add("card")
  card.setAttribute("data-id", trainer.id)

  // p trainer name
  const cardHeader = document.createElement("p")
  const trainerName = document.createTextNode(trainer.name)
  cardHeader.appendChild(trainerName)
  card.appendChild(cardHeader)

  // btn add pokemon
  const addBtn = document.createElement("button")
  const addBtnText = document.createTextNode("Add Pokemon")
  addBtn.setAttribute("data-trainer-id", trainer.id)
  addBtn.appendChild(addBtnText)
  card.appendChild(addBtn)

  // list pokemon
  const pokemonList = document.createElement("ul")
  trainer.pokemons.forEach(pokemon => addPokemonToList(pokemon, pokemonList));
  card.appendChild(pokemonList)

  // append card to page
  const main = document.querySelector("main")
  main.appendChild(card)

  // add listener to add button
  addBtn.addEventListener("click", (e) => {
    const trainerId = e.target.getAttribute("data-trainer-id")
    addPokemonToTeam(trainerId)
  })
}

// uses restful route to reach nested trainer pokemons resource create, adds new pokemon li from json response
function addPokemonToTeam(trainerId) {
  const targetUl = document.querySelector(`div[data-id='${trainerId}'] ul`)

  // configures post expecting json response
  const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }

  fetch(`${TRAINERS_URL}/${trainerId}/pokemons`, configObj)
    .then(res => res.json())
    .then(json => addPokemonToList(json, targetUl))

  // fetch nested rails route posts trainer/:id/pokemons 
  // controller looks up trainer and counts pokemon
  // if pokemon >= 5 returns error message: "Team is Full" 
  // if pokemon <= 5 adds pokemon and returns trainer pokemons, adds pokemon to list
}

// sends delete header to restful route which deletes the pokemon, removes li from dom using json response
function removePokemonFromTeam(pokemonId) {
  // configures headers and method for fetch request to reach proper route
  const configObj = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }

  fetch(`${POKEMONS_URL}/${pokemonId}`, configObj)
    .then(res => res.json())
    .then(json => removePokemonFromList(json))
}

// receives json object of pokemon data and removes its corresponding li element from team list
function removePokemonFromList(pokemon) {
  // find the button with pokemon data id and selecting its parent li
  const pokeLi = document.querySelector(`button[data-pokemon-id='${pokemon.id}']`).parentElement
  pokeLi.remove()
}


window.addEventListener("DOMContentLoaded", () => {
  // fetches api data about trainers and pokemon then creates cards with listeners
  loadTrainers();

})