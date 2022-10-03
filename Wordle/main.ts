//Ver 2.0.0.1
import {setDict, setSolutions} from './dictionary.js';
import {
    LoggerLevel,
    MaybeHTMLElement,
    SimpleLogger,
    GameBoardInterface,
} from './shared';
import {GameBoard} from './GameBoard';

setVersion('2.0.0.1');
const LENGTH_WORD = 5;
const MAX_ROW = 6;
let LOGGER = 'off'; //"info";
const dict_words = setDict();
const solution_word_array = setSolutions();

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
