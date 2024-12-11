// Step 1: Select all HTML IDs elements that will be manipulated
const resultImageElement = document.getElementById("result"); // Element to display 'Who's that Pokémon?'
const pokemonImageElement = document.getElementById("pokemonImage"); // Element to display Pokémon image
const optionsContainer = document.getElementById("options"); // Element to hold the answer buttons
const pointsElement = document.getElementById("points"); // Element for displaying the points
const totalCount = document.getElementById("totalCount"); // Element for displaying total count
const pointsValue = document.getElementById("pointsValue"); // Element to show current score
const mainContainer = document.getElementsByClassName("container"); // Main container for the game
const loadingContainer = document.getElementById("loadingContainer"); // Loading screen container

// Step 2: Initialize variables
let usedPokemonID = []; // Array to store IDs of Pokémon that have already been used
let count = 0; // Counter for keeping track of questions answered
let points = 0;
let showLoading = false;

// Step 3: Create a function to fetch Pokémon data using the Pokémon API
async function fetchPokemonByID(id) {
    showLoading = true;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`); // Fetch Pokémon data by ID
  const data = await response.json(); // Parse the JSON response
  return data; // Return the Pokémon data
}

// Step 4: Create a utility function to get a random Pokémon ID (1-151)
function getRandomPokemonId() {
  return Math.ceil(Math.random() * 151); // Generate random ID between 1 and 151
}

// Step 5: Create an asynchronous function to load a question with options
async function loadQuestionWithOptions() {
    if(showLoading) {
        showLoadingWindow();
        hidePuzzleWindow();
    }
  // Step 5.1: Fetch the correct answer (Pokémon) by generating a random ID
  let pokemonID = getRandomPokemonId();

  // Step 5.2: Ensure the Pokémon ID is unique by checking if it has already been used
  while (usedPokemonID.includes(pokemonID)) {
    pokemonID = getRandomPokemonId(); // If used, get another random ID
  }

  // Step 5.3: Add the ID to the used list to prevent repetition
  usedPokemonID.push(pokemonID);

  // Step 5.4: Fetch the Pokémon data using the generated ID
  const pokemon = await fetchPokemonByID(pokemonID);

  // Step 5.5: Create an array for the options, starting with the correct answer
  const options = [pokemon.name];
  const optionsIds = [pokemon.id]; // Array to track the IDs of options

  // Step 5.6: Fetch 3 additional random Pokémon for options (total 4 options)
  while (options.length < 4) {
    let randomPokemonID = getRandomPokemonId();

    // Step 5.7: Ensure the random ID does not repeat by checking against existing options
    while (optionsIds.includes(randomPokemonID)) {
      randomPokemonID = getRandomPokemonId(); // Get a new random ID if repeated
    }

    // Step 5.8: Fetch the random Pokémon and add it to the options array
    const randomPokemon = await fetchPokemonByID(randomPokemonID);
    const randomOption = randomPokemon.name;

    options.push(randomOption); // Add the Pokémon name to the options array
    optionsIds.push(randomPokemonID); // Add the Pokémon ID to the optionsIds array

    console.log(options); // Log the options for debugging
    console.log(optionsIds); // Log the IDs for debugging
    
    // turn off loading if all options are fetched
    if (options.length === 4) {
        showLoading = false;
    }
  }

  // Step 5.9: Shuffle the options array to randomize the order
  shuffleArray(options);

  // Step 5.10: Clear any previous data and update the UI with the correct Pokémon image
  resultImageElement.textContent = "Who's that Pokemon?"; // Set question text
  pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default; // Set Pokémon image

  // Step 5.11: Display the options on the page (buttons for each option)
  optionsContainer.innerHTML = ""; // Clear any previous options

  options.forEach((option) => {
    const button = document.createElement("button"); // Create a new button element
    button.textContent = option; // Set the button text to the option
    button.onclick = (event) => {
      checkAnswer(option === pokemon.name, event); // Call checkAnswer when the button is clicked
    };
    optionsContainer.appendChild(button); // Append the button to the options container
  });
  if (!showLoading) {
    hideLoadingWindow();
    showPuzzleWindow();
  }
}

// Step 6: Check if the selected answer is correct
function checkAnswer(isCorrect, event) {
  // Step 6.1: Prevent multiple selections by checking if a button has already been selected
  const selectedButton = document.querySelector(".selected");

  if (selectedButton) {
    return; // Exit the function if a button has already been selected
  }

  // Step 6.2: Mark the clicked button as selected
  event.target.classList.add("selected");
  count++;
  totalCount.textContent = count;

  // Step 6.3: Disable all other buttons to prevent further clicks
  const allButtons = document.querySelectorAll("button");
  allButtons.forEach((button) => (button.disabled = true));

  // Step 6.4: Optionally display a message for correct/incorrect answer
  if (isCorrect) {
    displayResult("Correct answer!");
    points++;
    pointsValue.textContent = points;
    event.target.classList.add("correct");
  } else {
    displayResult("Incorrect answer...");
    event.target.classList.add("wrong");
  }

  // Step 6.5 Load the next question with a set timeout
  setTimeout(() => {
    showLoading = true;
    loadQuestionWithOptions();
  }, 1000);
}

// Step 7: Call the loadQuestionWithOptions function to initialize the game
loadQuestionWithOptions();

// Step 8: Shuffle the options array to randomize the answer order
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5); // Randomly shuffle the array
}

function displayResult(result) {
  resultImageElement.textContent = result;
  console.log(result);
}

function hideLoadingWindow() {
    loadingContainer.classList.add("hide");
}

function showLoadingWindow() {
    mainContainer[0].classList.remove("show");
    loadingContainer.classList.remove("hide");
    loadingContainer.classList.add("show");
}

function showPuzzleWindow() {
    loadingContainer.classList.remove("show");
    mainContainer[0].classList.remove("hide");
    mainContainer[0].classList.add("show");
}

function hidePuzzleWindow() {
    mainContainer[0].classList.add("hide");
}