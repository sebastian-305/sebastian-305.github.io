import { LoggerLevel, GameBoardInterface, } from './shared';
export class GameBoard extends GameBoardInterface {
    constructor(obj, logger) {
        super(obj, logger);
    }
    newGame(length_word) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.newGame: ${length_word}`);
        }
        this._current_row = 1;
        this._current_letter_index = 1;
        this._currentRowContent = new Array();
        this._length_word = length_word;
        // this._rowColor = new Array(this._length_word);
    }
    writeLetter(row, letter_index, try_letter) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.writeLetter: ${row}, ${letter_index}, ${try_letter}`);
        }
        let writeTarget = `#try${row}${letter_index}`;
        let elem = this._canvas.querySelector(writeTarget);
        if (elem === null) {
            return;
        }
        this._currentRowContent.push(try_letter);
        elem.innerHTML = try_letter;
    }
    removeLetter(row, letter_index) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.removeLetter ${row}, ${letter_index}`);
        }
        let writeTarget = `#try${row}${letter_index}`;
        let elem = this._canvas.querySelector(writeTarget);
        if (elem === null) {
            return;
        }
        elem.innerHTML = '';
    }
    setRowColors(row, colorClass = '') {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.setRowColors ${row}, ${colorClass}`);
        }
        for (let i = 1; i <= this._length_word; i++) {
            //REFACTOR!!
            /*Maybe Add a little animation later */
            let elem = this._canvas.querySelector(`#try${row}${i}`);
            if (elem === null) {
                return;
            }
            elem.className = colorClass;
        }
    }
    handleShortInput(current_word) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.handleShortInput: ${current_word}`);
        }
        alert(`This word is too short: ${current_word}`);
    }
    handleUnknownWord(row, word) {
        //Will be maybe used later
        /* alert(`Unbekanntes Wort: ${word} row: ${row}`); */
        this.setRowColors(row, 'orange');
    }
    setLetterColor(row, color) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.setLetterColor ${row}, ${color}`);
        }
        for (let i = 1; i <= this._length_word; i++) {
            //REFACTOR!!!
            /*Maybe Add a little animation later */
            let elem = this._canvas.querySelector(`#try${row}${i}`);
            if (elem === null) {
                return;
            }
            let cur_color = color[i - 1];
            if (cur_color) {
                elem.classList.add(cur_color);
            }
        }
    }
    setKeyboardLetterColor(key, color) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`setKeyboardLetterColor()`);
        }
        let elem = this._canvas.querySelector(`#${key}`);
        if (!elem) {
            return;
        }
        let classlist = elem.classList;
        classlist.remove('yellow');
        classlist.add(color);
    }
    handleGameWon(solution) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.handleGameWon()`);
        }
        setTimeout(function () {
            alert(`Du hast gewonnnen!\nDas gesuchte Worte war: ${solution}`);
        }, 2);
    }
    handleGameLost(solution) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.handleGameLost()`);
        }
        setTimeout(function () {
            alert(`Du hast leider alle Versuche aufgebraucht!\nDas gesuchte Worte war: ${solution}`);
        }, 2);
    }
    handleWrongInput() {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.handleWrongInput()`);
        } /*Do nothing*/
    }
    showSolution(solution) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.showSolution()`);
        }
        setTimeout(function () {
            alert(`Bauchst du etwas Hilfe?\n L\u00f6sungswort: ${solution}`);
        }, 1);
    }
    setUsedLetters(usedLetters) {
        let setString = 'Nicht vorhandene Buchstaben: <br/>';
        for (let element of usedLetters.values()) {
            setString += element;
            setString += '  ';
        }
        let elem = this._canvas.querySelector(`#usedLetters`);
        if (!elem) {
            return;
        }
        elem.innerHTML = setString;
    }
}
