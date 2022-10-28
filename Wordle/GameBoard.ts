import {MaybeHTMLElement, SimpleLogger, GameBoardInterface} from './shared.js';

export class GameBoard extends GameBoardInterface {
    constructor(obj: Document, logger: SimpleLogger) {
        super(obj, logger);
    }

    newGame(length_word: number) {
        this._logger.info(`GameBoard.newGame: ${length_word}`);

        this._current_row = 1;
        this._current_letter_index = 1;
        this._currentRowContent = new Array();
        this._length_word = length_word;
        // this._rowColor = new Array(this._length_word);
    }

    writeLetter(row: number, letter_index: number, try_letter: string) {
        this._logger.info(
            `GameBoard.writeLetter: ${row}, ${letter_index}, ${try_letter}`,
        );

        const writeTarget = `#try${row}${letter_index}`;
        const elem: MaybeHTMLElement = this._canvas.querySelector(writeTarget);
        if (elem === null) {
            return;
        }
        this._currentRowContent.push(try_letter);
        elem.innerHTML = try_letter;
    }

    removeLetter(row: number, letter_index: number) {
        this._logger.info(`GameBoard.removeLetter ${row}, ${letter_index}`);

        const writeTarget: string = `#try${row}${letter_index}`;
        const elem: MaybeHTMLElement = this._canvas.querySelector(writeTarget);
        if (elem === null) {
            return;
        }
        elem.innerHTML = '';
    }

    setRowColors(row: number, colorClass: string = '') {
        this._logger.info(`GameBoard.setRowColors ${row}, ${colorClass}`);

        for (let i = 1; i <= this._length_word; i++) {
            //REFACTOR!!
            /*Maybe Add a little animation later */
            const elem: MaybeHTMLElement = this._canvas.querySelector(
                `#try${row}${i}`,
            );
            if (elem === null) {
                return;
            }
            elem.className = colorClass;
        }
    }

    handleShortInput(current_word: string) {
        this._logger.info(`GameBoard.handleShortInput: ${current_word}`);

        alert(`This word is too short: ${current_word}`);
    }

    handleUnknownWord(row: number, word?: string) {
        //Will be maybe used later
        this._logger.info(`GameBoard.handleUnknownWord: ${row}: ${word}`);

        this.setRowColors(row, 'orange');
    }

    setLetterColor(row: number, color: string[]) {
        this._logger.info(`GameBoard.setLetterColor ${row}, ${color}`);

        for (let i = 1; i <= this._length_word; i++) {
            /*Maybe add a little animation later */
            const elem: MaybeHTMLElement = this._canvas.querySelector(
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
        this._logger.info(`GameBoard.setKeyboardLetterColor()`);

        const elem: MaybeHTMLElement = this._canvas.querySelector(`#${key}`);
        if (!elem) {
            return;
        }

        let classlist = elem.classList;

        classlist.remove('yellow');
        classlist.add(color);
    }

    handleGameWon(solution: string) {
        this._logger.info(`GameBoard.handleGameWon()`);

        setTimeout(function () {
            alert(`Du hast gewonnnen!\nDas gesuchte Wort war: ${solution}`);
        }, 2);
    }

    handleGameLost(solution: string) {
        this._logger.info(`GameBoard.handleGameLost()`);

        setTimeout(function () {
            alert(
                `Du hast leider alle Versuche aufgebraucht!\nDas gesuchte Worte war: ${solution}`,
            );
        }, 2);
    }

    handleWrongInput() {
        this._logger.info(`GameBoard.handleWrongInput()`);
    }

    showSolution(solution: string) {
        this._logger.info(`GameBoard.showSolution()`);

        setTimeout(function () {
            alert(`Bauchst du etwas Hilfe?\n L\u00f6sungswort: ${solution}`);
        }, 1);
    }

    setUsedLetters(
        usedLetters: Set<string>, //TODO DO I NEED THIS?
    ) {
        this._logger.info(`GameBoard.setUsedLetters()`);

        let setString = 'Nicht vorhandene Buchstaben: <br/>';
        for (let element of usedLetters.values()) {
            setString += element;
            setString += '  ';
        }

        const elem: MaybeHTMLElement =
            this._canvas.querySelector(`#usedLetters`);

        if (!elem) {
            return;
        }

        elem.innerHTML = setString;
    }
}
