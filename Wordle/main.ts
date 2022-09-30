//Ver 2.0.0.1
import {setDict, setSolutions} from './dictionary.js';
import {
    LoggerLevel,
    MaybeHTMLElement,
    LoggerInterface,
    GameBoardInterface,
} from './shared';
import {GameBoard} from './GameBoard';

setVersion('2.0.0.1');
const LENGTH_WORD = 5;
const MAX_ROW = 6;
let LOGGER = 'off'; //"info";
const dict_words = setDict();
const solution_word_array = setSolutions();

class Game {
    /******************************
     *    -----Properties-----
     *    -----Methods-----
     ******************************/

    constructor(solution_words, gameBoard, dict_words) {
        if (LOGGER === 'info') {
            console.log(
                `Game.constuctor: *solution_words*, ${gameBoard}, *dict_words`,
            );
        }
        this.solution_words = solution_words;
        this.gameBoard = gameBoard;
        this.dictionary;
        this.solution;
        this.gameState = 'initialized';
        this.current_row = 1;
        this.current_letter_index = 1;
        this.length_word = 0;
        this.current_row_content;
        this.restart;
        this.usedLetters;
        this.greenLetters;
        this.yellowLetters;
        this.greyLetters;
    }

    //public:
    newGame(length_word, solution_words) {
        //excessive solution_words
        if (LOGGER === 'info') {
            console.log(`Game.newGame: ${length_word}, *solution_words*`);
        }
        this.length_word = length_word;
        this.dictionary = this.setUpDictionary(length_word, dict_words);
        this.solution = Array.from(
            this.solution_words[
                Math.floor(Math.random() * this.solution_words.length)
            ].toUpperCase(),
        );
        this.gameState = 'ongoing';
        this.gameBoard.newGame(length_word);
        this.current_row_content = [];
        this.restart = 0;
        this.usedLetters = new Set();
        this.greenLetters = new Set();
        this.yellowLetters = new Set();
        this.greyLetters = new Set();
    }

    inputSingleLetter(letter) {
        if (LOGGER === 'info') {
            console.log(`Game.inputSingleLetter: ${letter}`);
        }
        /*
                if (this.gameState === "finished") {
                    return;
                }
        */
        letter = letter.toUpperCase();

        if (letter === 'BACKSPACE' && this.current_letter_index !== 1) {
            this.current_row_content.pop();

            this.gameBoard.removeLetter(
                this.current_row,
                --this.current_letter_index,
            );
            if (this.gameState === 'unmapped') {
                this.gameState = 'ongoing';
                this.gameBoard.setRowColors(this.current_row);
            }
            return;
        }

        if (letter === 'DEAD') {
            this.gameBoard.showSolution(this.solution.join(''));
            return;
        }

        if (letter === 'ENTER') {
            if (this.gameState === 'finished') {
                if (++this.restart >= 1) {
                    location.reload();
                    this.newGame(LENGTH_WORD, solution_word_array);
                    return;
                }
            } else {
                this.checkRow();
            }
            return;
        }

        if (this.current_row > MAX_ROW) {
            return;
        }

        //Normaler Spielzug
        {
            if (letter === 'SS') {
                letter = '\u00df';
            }

            let valid_letters = [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
                '\u00c4',
                '\u00d6',
                '\u00dc' /*, '\u00df'*/,
            ];

            //Wenn es kein g\u00FCltiger Buchstabe ist *do nothing*
            if (
                !valid_letters.includes(letter) ||
                this.current_letter_index > this.length_word
            ) {
                return;
            }

            this.current_row_content.push(letter);
            this.gameBoard.writeLetter(
                this.current_row,
                this.current_letter_index++,
                letter,
            );
        }
    }

    //private
    checkRow() {
        //Vielleicht \u00DCbergabeparameter angeben, damit die Logik leichter nachvollziehbar ist.
        if (LOGGER === 'info') {
            console.log(`Game.checkRow()`);
        }
        let solution = [...this.solution];
        let input_letter = '';
        let return_color = new Array(this.length_word).fill('grey');

        //Wort zu kurz
        if (this.current_letter_index <= this.length_word) {
            this.gameBoard.handleShortInput(this.current_row_content);
            return;
        }

        //Wort unbekannt
        if (!this.dictionary.includes(this.current_row_content.join(''))) {
            console.log(
                `Wort: ${this.current_row_content.join(
                    '',
                )} ist nicht im W\u00f6rterbuch!`,
            );
            this.gameBoard.handleUnknownWord(
                this.current_row,
                this.current_row_content.join(''),
            );
            this.gameState = 'unmapped';
            return;
        }

        //Gr\u00FCne Buchstaben
        for (let i = 0; i < this.length_word; i++) {
            input_letter = this.current_row_content[i];
            this.greyLetters.add(input_letter);
            this.usedLetters.add(input_letter);

            if (this.solution[i] === input_letter) {
                return_color[i] = 'green';
                delete solution[i];
            }
        }

        //Gelbe Buchstaben
        for (let i = 0; i < this.length_word; i++) {
            input_letter = this.current_row_content[i];

            if (return_color[i] === 'green') {
                this.usedLetters.delete(input_letter);
                this.greenLetters.add(input_letter);
                this.greyLetters.delete(input_letter);
                this.yellowLetters.delete(input_letter);
                continue;
            }

            if (solution.includes(input_letter)) {
                this.usedLetters.delete(input_letter);
                this.greyLetters.delete(input_letter);
                this.yellowLetters.add(input_letter);
                return_color[i] = 'yellow';
                delete solution[solution.indexOf(input_letter)];
            }
            if (LOGGER === 'info') {
                console.log(
                    `row: ${this.current_row} i: ${i} return_color[i-1] ${return_color[i]} input_letter ${input_letter}`,
                );
            }
        }
        if (LOGGER === 'info') {
            console.log(
                `checking if won: green Letters: ${this.greenLetters}, green Letter size ${this.greenLetters.size} length word: ${this.length_word}`,
            );
        }

        //Buchstaben einf\u00E4rben
        this.gameBoard.setLetterColor(this.current_row, return_color);
        this.updateKeyboardColor(
            this.greyLetters,
            this.yellowLetters,
            this.greenLetters,
        );
        this.current_letter_index = 1;

        this.gameBoard.setUsedLetters(this.usedLetters);

        if (this.solution.join('') === this.current_row_content.join('')) {
            this.gameState = 'finished';
            this.gameBoard.handleGameWon(this.solution.join(''));
            this.current_row_content = [];
            return;
        }

        this.current_row_content = [];

        if (++this.current_row > MAX_ROW) {
            this.gameState = 'finished';
            this.gameBoard.handleGameLost(this.solution.join(''));
            return;
        }
    }

    updateKeyboardColor(greyLetters, yellowLetters, greenLetters) {
        for (let element of greenLetters.values()) {
            this.gameBoard.setKeyboardLetterColor(element, 'green');
        }

        for (let element of greyLetters.values()) {
            this.gameBoard.setKeyboardLetterColor(element, 'grey');
        }
        for (let element of yellowLetters.values()) {
            this.gameBoard.setKeyboardLetterColor(element, 'yellow');
        }
    }

    setUpDictionary(word_length, dict_words) {
        if (LOGGER === 'info') {
            console.log(`Game.setUpDictionary: ${word_length}, *dict_words*`);
        }

        let wordsArray = new Array();

        for (let element in dict_words) {
            if (dict_words[element].toUpperCase().length === word_length) {
                wordsArray.push(dict_words[element].toUpperCase());
            }
        }

        return wordsArray;
    }
}

/*START MAIN LOGIC*/
{
    const element = window.document;

    let Board: GameBoardInterface = new GameBoard(element);
    let MyGame = new Game(solution_word_array, Board, dict_words);

    MyGame.newGame(LENGTH_WORD);

    document.addEventListener(
        'keyup',
        (event) => {
            let name = event.key;
            if (LOGGER === 'info') {
                console.log(`Event \'keyup\' ${event}->${name}`);
            }

            if (name == 'End') {
                LOGGER = LOGGER === 'off' ? 'info' : 'off';
                console.log(`Logger level: ${LOGGER}`);
            } else if (
                MyGame.gameState !== 'finished' ||
                name === 'Enter' ||
                name === 'Dead'
            ) {
                MyGame.inputSingleLetter(name);
            }
        },
        false,
    );

    function clickLetter(letter) {
        MyGame.inputSingleLetter(letter);
    }
}

/*Setup Helper Functions */

function setVersion(version) {
    document.getElementById('version').innerHTML = version;
}
