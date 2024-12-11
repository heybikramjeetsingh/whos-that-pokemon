// Improved and Optimized Code

// Step 1: Select HTML elements to manipulate
const resultImageElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("points");
const totalCount = document.getElementById("totalCount");
const pointsValue = document.getElementById("pointsValue");
const mainContainer = document.querySelector(".container");
const loadingContainer = document.getElementById("loadingContainer");

// Step 2: Initialize variables
let usedPokemonIDs = new Set(); // Set to store unique Pokémon IDs
let count = 0; // Counter for questions answered
let points = 0;
let showLoading = true;

// Step 3: Fetch Pokémon data by ID
async function fetchPokemonByID(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch Pokémon data");
    }
    return response.json();
}

// Step 4: Generate a random Pokémon ID (1-151)
function getRandomPokemonId() {
    return Math.ceil(Math.random() * 151);
}

// Step 5: Load a question with options
async function loadQuestionWithOptions() {
    try {
        toggleLoading(true);

        let pokemonID;
        do {
            pokemonID = getRandomPokemonId();
        } while (usedPokemonIDs.has(pokemonID));

        usedPokemonIDs.add(pokemonID);
        const pokemon = await fetchPokemonByID(pokemonID);

        const options = [pokemon.name];
        while (options.length < 4) {
            let randomPokemonID;
            do {
                randomPokemonID = getRandomPokemonId();
            } while (usedPokemonIDs.has(randomPokemonID));

            const randomPokemon = await fetchPokemonByID(randomPokemonID);
            options.push(randomPokemon.name);
        }

        shuffleArray(options);
        updateUIForQuestion(pokemon, options);
    } catch (error) {
        console.error("Error loading question:", error);
    } finally {
        toggleLoading(false);
    }
}

// Step 6: Check if the selected answer is correct
function checkAnswer(isCorrect, button) {
    if (button.classList.contains("selected")) return;

    button.classList.add("selected");
    count++;
    totalCount.textContent = count;

    const allButtons = optionsContainer.querySelectorAll("button");
    allButtons.forEach(btn => (btn.disabled = true));

    if (isCorrect) {
        displayResult("Correct answer!");
        points++;
        pointsValue.textContent = points;
        button.classList.add("correct");
    } else {
        displayResult("Incorrect answer...");
        button.classList.add("wrong");
    }

    setTimeout(loadQuestionWithOptions, 1000);
}

// Step 7: Shuffle the options array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Step 8: Update UI for a new question
function updateUIForQuestion(pokemon, options) {
    resultImageElement.textContent = "Who's that Pokemon?";
    pokemonImageElement.src = ""; // Clear the previous image

    // no delay
    setTimeout(() => {
        pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;
    }, 0);

    optionsContainer.innerHTML = "";
    options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => checkAnswer(option === pokemon.name, button));
        optionsContainer.appendChild(button);
    });
}

// Step 9: Toggle loading visibility
function toggleLoading(show) {
    if (show) {
        loadingContainer.classList.remove("hide");
        mainContainer.classList.add("hide");
    } else {
        loadingContainer.classList.add("hide");
        mainContainer.classList.remove("hide");
    }
}

// Step 10: Display the result message
function displayResult(message) {
    resultImageElement.textContent = message;
}

// Initialize the game
loadQuestionWithOptions();
