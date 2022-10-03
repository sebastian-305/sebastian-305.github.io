import {
    LoggerLevel,
    MaybeHTMLElement,
    SimpleLogger,
    GameBoardInterface,
} from './shared';

export class GameBoard extends GameBoardInterface {
    constructor(obj: Document, logger: SimpleLogger) {
        super(obj, logger);
    }

    newGame(length_word: number) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.newGame: ${length_word}`);
        }

        this._current_row = 1;
        this._current_letter_index = 1;
        this._currentRowContent = new Array();
        this._length_word = length_word;
        // this._rowColor = new Array(this._length_word);
    }

    writeLetter(row: number, letter_index: number, try_letter: string) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(
                `GameBoard.writeLetter: ${row}, ${letter_index}, ${try_letter}`,
            );
        }
        let writeTarget = `#try${row}${letter_index}`;
        let elem: MaybeHTMLElement = this._canvas.querySelector(writeTarget);
        if (elem === null) {
            return;
        }
        this._currentRowContent.push(try_letter);
        elem.innerHTML = try_letter;
    }

    removeLetter(row: number, letter_index: number) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.removeLetter ${row}, ${letter_index}`);
        }
        let writeTarget: string = `#try${row}${letter_index}`;
        let elem: MaybeHTMLElement = this._canvas.querySelector(writeTarget);
        if (elem === null) {
            return;
        }
        elem.innerHTML = '';
    }

    setRowColors(row: number, colorClass: string = '') {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.setRowColors ${row}, ${colorClass}`);
        }
        for (let i = 1; i <= this._length_word; i++) {
            //REFACTOR!!
            /*Maybe Add a little animation later */
            let elem: MaybeHTMLElement = this._canvas.querySelector(
                `#try${row}${i}`,
            );
            if (elem === null) {
                return;
            }
            elem.className = colorClass;
        }
    }

    handleShortInput(current_word: string) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.handleShortInput: ${current_word}`);
        }
        alert(`This word is too short: ${current_word}`);
    }

    handleUnknownWord(row: number, word?: string) {
        //Will be maybe used later
        /* alert(`Unbekanntes Wort: ${word} row: ${row}`); */
        console.log(`Unbekanntes Wort ${word}`);
        this.setRowColors(row, 'orange');
    }

    setLetterColor(row: number, color: string[]) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.setLetterColor ${row}, ${color}`);
        }

        for (let i = 1; i <= this._length_word; i++) {
            //REFACTOR!!!
            /*Maybe Add a little animation later */
            let elem: MaybeHTMLElement = this._canvas.querySelector(
                `#try${row}${i}`,
            );

            if (elem === null) {
                return;
            }
            let cur_color: string | undefined = color[i - 1];
            if (cur_color) {
                elem.classList.add(cur_color);
            }
        }
    }

    setKeyboardLetterColor(key: string, color: string) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`setKeyboardLetterColor()`);
        }
        let elem: MaybeHTMLElement = this._canvas.querySelector(`#${key}`);
        if (!elem) {
            return;
        }

        let classlist = elem.classList;

        classlist.remove('yellow');
        classlist.add(color);
    }

    handleGameWon(solution: string) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.handleGameWon()`);
        }

        setTimeout(function () {
            alert(`Du hast gewonnnen!\nDas gesuchte Worte war: ${solution}`);
        }, 2);
    }

    handleGameLost(solution: string) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.handleGameLost()`);
        }

        setTimeout(function () {
            alert(
                `Du hast leider alle Versuche aufgebraucht!\nDas gesuchte Worte war: ${solution}`,
            );
        }, 2);
    }

    handleWrongInput() {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.handleWrongInput()`);
        } /*Do nothing*/
    }

    showSolution(solution: string) {
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.showSolution()`);
        }
        setTimeout(function () {
            alert(`Bauchst du etwas Hilfe?\n L\u00f6sungswort: ${solution}`);
        }, 1);
    }

    setUsedLetters(
        usedLetters: Set<string>, //TODO DO I NEED THIS?
    ) {
        let setString = 'Nicht vorhandene Buchstaben: <br/>';
        for (let element of usedLetters.values()) {
            setString += element;
            setString += '  ';
        }

        let elem: MaybeHTMLElement = this._canvas.querySelector(`#usedLetters`);

        if (!elem) {
            return;
        }

        elem.innerHTML = setString;
    }
}
