document.addEventListener("DOMContentLoaded", function() {
    const wordsList = ["chupo", "jugar", "amigos", "divertido", "desarrollo", "javascript", "programacion", "aprender", "palabras", "internet"];
    let wordToGuess = getWordToGuess();
    
    let attemptsLeft = 10;
    let guessedWords = Array(10).fill('').map(() => Array(5).fill(''));

    const attemptsLeftElement = document.getElementById("attempts-left");
    const wordGrid = document.getElementById("word-grid");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    function updateWordGrid() {
        wordGrid.innerHTML = guessedWords.map(word => {
            return word.map((letter, index) => {
                if (letter === '') {
                    return '<div></div>';
                }
                if (letter === wordToGuess[index]) {
                    return `<div class="correct">${letter}</div>`;
                } else if (wordToGuess.includes(letter) && wordToGuess.indexOf(letter) !== index) {
                    return `<div class="partial">${letter}</div>`;
                } else {
                    return `<div class="incorrect">${letter}</div>`;
                }
            }).join("");
        }).join("");
    }

    function checkGuess() {
        const guess = guessInput.value.toLowerCase();

        if (guess.length !== 5) {
            alert("Ingresa una palabra de 5 letras.");
            return;
        }

        if (guessedWords.length === 0) {
            alert("¡Has adivinado todas las palabras!");
            guessButton.disabled = true;
            return;
        }

        if (guess === wordToGuess) {
            const index = guessedWords.findIndex(word => word.join('') === '');
            if (index !== -1) {
                guessedWords[index] = guess.split('');
                updateWordGrid();

                // Agregar la clase "active" para activar la animación
                guessedWords[index].forEach((letter, i) => {
                    if (letter === wordToGuess[i]) {
                        setTimeout(() => {
                            const correctLetter = document.querySelector(`.correct:nth-child(${i + 1})`);
                            correctLetter.classList.add("active");
                        }, 100 * i); // Retraso para la animación
                    }
                });

                // Verificar si la palabra actual es correcta
                const isWordCorrect = guessedWords[index].every((letter, i) => letter === wordToGuess[i]);
                if (isWordCorrect) {
                    alert("¡Has adivinado la palabra!");
                }

                // Verificar si todas las palabras se han adivinado
                const isGameFinished = guessedWords.every(word => word.join('') !== '');
                if (isGameFinished) {
                    alert("¡Has ganado el juego!");
                    guessButton.disabled = true;
                }
            }
        } else {
            // Cuando se ingresa una palabra incorrecta, llenar la grilla con esa palabra
            const index = guessedWords.findIndex(word => word.join('') === '');
            if (index !== -1) {
                const guessArray = guess.split('');
                guessedWords[index] = guessArray;
                updateWordGrid();
            }
            attemptsLeft--;
            attemptsLeftElement.textContent = attemptsLeft;
            if (attemptsLeft === 0) {
                alert("Se te acabaron los intentos. La palabra era: " + wordToGuess);
                guessButton.disabled = true;
            }
        }
    }

    guessButton.addEventListener("click", checkGuess);
    updateWordGrid();

    // Función para obtener la palabra objetivo del día
    function getWordToGuess() {
        const now = new Date();
        const isMidnight = now.getHours() === 0 && now.getMinutes() === 1;

        if (isMidnight) {
            const startDate = new Date("2023-01-01");
            const currentDate = new Date();
            const daysElapsed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
            return wordsList[daysElapsed % wordsList.length];
        } else {
            return wordsList[0]; // Palabra predeterminada si no es 00:01
        }
    }

    // Comprobar la palabra objetivo a la 00:01 y actualizarla
    setInterval(() => {
        wordToGuess = getWordToGuess();
    }, 60000); // Comprobar cada minuto
});
