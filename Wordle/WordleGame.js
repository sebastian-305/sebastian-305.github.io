const MAX_ROW = 6; //TODO Dynamisch machen!
import { GameState, WordleGameInterface, } from './shared.js';
export class WordleGame extends WordleGameInterface {
    constructor(gameBoard, dict_words, logger) {
        super(gameBoard, dict_words, logger);
    }
    //public:
    newGame(length_word, solution_words) {
        this._logger.info(`Game.newGame: ${length_word}, *solution_words*`);
        this._length_word = length_word;
        this._dictionary = this.setUpDictionary(this._length_word, this._full_dictionary);
        this._solution_words = solution_words;
        this._solution = this.setUpSolution();
        this._gameState = GameState.ONGOING;
        this._gameBoard.newGame(length_word);
        this._current_row_content = [];
        this._restart = 0;
        this._usedLetters = new Set();
        this._greenLetters = new Set();
        this._yellowLetters = new Set();
        this._greyLetters = new Set();
    }
    inputSingleLetter(letter) {
        this._logger.info(`Game.inputSingleLetter: ${letter}`);
        /*
                if (this.gameState === "finished") {
                    return;
                }
        */
        letter = letter.toUpperCase();
        if (letter === 'BACKSPACE' && this._current_letter_index !== 1) {
            this._current_row_content.pop();
            this._gameBoard.removeLetter(this._current_row, --this._current_letter_index);
            if (this._gameState === GameState.UNMAPPED) {
                this._gameState = GameState.ONGOING;
                this._gameBoard.setRowColors(this._current_row);
            }
            return;
        }
        if (letter === 'DEAD') {
            this._gameBoard.showSolution(this._solution.join(''));
            return;
        }
        if (letter === 'ENTER') {
            if (this._gameState === GameState.FINISHED) {
                if (++this._restart >= 1) {
                    location.reload();
                    this.newGame(this._length_word, this._solution_words);
                    return;
                }
            }
            else {
                this.checkRow();
            }
            return;
        }
        if (this._current_row > MAX_ROW) {
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
            if (!valid_letters.includes(letter) ||
                this._current_letter_index > this._length_word) {
                return;
            }
            this._current_row_content.push(letter);
            this._gameBoard.writeLetter(this._current_row, this._current_letter_index++, letter);
        }
    }
    //private
    checkRow() {
        //Vielleicht \u00DCbergabeparameter angeben, damit die Logik leichter nachvollziehbar ist.
        this._logger.info(`Game.checkRow()`);
        let solution = [...this._solution];
        let input_letter = '';
        let return_color = new Array(this._length_word).fill('grey');
        //Wort zu kurz
        if (this._current_letter_index <= this._length_word) {
            this._gameBoard.handleShortInput(this._current_row_content.join());
            return;
        }
        //Wort unbekannt
        if (!this._dictionary.includes(this._current_row_content.join(''))) {
            console.log(`Wort: ${this._current_row_content.join('')} ist nicht im W\u00f6rterbuch!`);
            this._gameBoard.handleUnknownWord(this._current_row, this._current_row_content.join(''));
            this._gameState = GameState.UNMAPPED;
            return;
        }
        //Gr\u00FCne Buchstaben
        for (let i = 0; i < this._length_word; i++) {
            input_letter = String(this._current_row_content[i]);
            this._greyLetters.add(input_letter);
            this._usedLetters.add(input_letter);
            if (this._solution[i] === input_letter) {
                return_color[i] = 'green';
                delete solution[i];
            }
        }
        //Gelbe Buchstaben
        for (let i = 0; i < this._length_word; i++) {
            input_letter = String(this._current_row_content[i]);
            if (return_color[i] === 'green') {
                this._usedLetters.delete(input_letter);
                this._greenLetters.add(input_letter);
                this._greyLetters.delete(input_letter);
                this._yellowLetters.delete(input_letter);
                continue;
            }
            if (solution.includes(input_letter)) {
                this._usedLetters.delete(input_letter);
                this._greyLetters.delete(input_letter);
                this._yellowLetters.add(input_letter);
                return_color[i] = 'yellow';
                delete solution[solution.indexOf(input_letter)];
            }
            this._logger.info(`row: ${this._current_row} i: ${i} return_color[i-1] ${return_color[i]} input_letter ${input_letter}`);
        }
        this._logger.info(`checking if won: green Letters: ${this._greenLetters}, green Letter size ${this._greenLetters.size} length word: ${this._length_word}`);
        //Buchstaben einf\u00E4rben
        this._gameBoard.setLetterColor(this._current_row, return_color);
        this.updateKeyboardColor(this._greyLetters, this._yellowLetters, this._greenLetters);
        this._current_letter_index = 1;
        if (this._solution.join('') === this._current_row_content.join('')) {
            this._gameState = GameState.FINISHED;
            this._gameBoard.handleGameWon(this._solution.join(''));
            this._current_row_content = [];
            return;
        }
        this._current_row_content = [];
        if (++this._current_row > MAX_ROW) {
            this._gameState = GameState.FINISHED;
            this._gameBoard.handleGameLost(this._solution.join(''));
            return;
        }
    }
    updateKeyboardColor(greyLetters, yellowLetters, greenLetters) {
        this._logger.info(`Game.updateKeyboardColor()`);
        for (let element of greenLetters.values()) {
            this._gameBoard.setKeyboardLetterColor(element, 'green');
        }
        for (let element of greyLetters.values()) {
            this._gameBoard.setKeyboardLetterColor(element, 'grey');
        }
        for (let element of yellowLetters.values()) {
            this._gameBoard.setKeyboardLetterColor(element, 'yellow');
        }
    }
    setUpDictionary(word_length, dict_words) {
        this._logger.info(`Game.setUpDictionary: ${word_length}, *dict_words*`);
        let wordsArray = new Array();
        for (let element in dict_words) {
            let current_word = String(dict_words[element]);
            if (current_word.toUpperCase().length === word_length) {
                wordsArray.push(current_word.toUpperCase());
            }
        }
        return wordsArray;
    }
    setUpSolution() {
        this._logger.info(`Game.setUpSolution()`);
        let rand = Math.floor(Math.random() * this._solution_words.length);
        let solution = this._solution_words[rand];
        if (typeof solution === 'undefined') {
            return [];
        }
        return Array.from(solution.toUpperCase());
    }
}
