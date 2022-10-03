//Ver 2.0.0.1
import {setDict, setSolutions} from './dictionary.js';
import {
    LoggerLevel,
    MaybeHTMLElement,
    SimpleLogger,
    GameBoardInterface,
    GameState,
} from './shared';
import {GameBoard} from './GameBoard';
import {WordleGame} from './WordleGame';

setVersion('2.0.0.1');
const LENGTH_WORD = 5;
const dict_words = setDict();
const solution_word_array = setSolutions();
const logger = new SimpleLogger(LoggerLevel.OFF);

/*START MAIN LOGIC*/
{
    const element = window.document;

    let Board: GameBoardInterface = new GameBoard(element, logger);
    let MyGame = new WordleGame(Board, dict_words, logger);

    MyGame.newGame(LENGTH_WORD, solution_word_array);

    document.addEventListener(
        'keyup',
        (event) => {
            let name = event.key;
            if (logger.level >= LoggerLevel.INFO) {
                console.log(`Event \'keyup\' ${event}->${name}`);
            }

            if (name == 'End') {
                logger.level =
                    logger.level === LoggerLevel.OFF
                        ? LoggerLevel.INFO
                        : LoggerLevel.OFF;
                console.log(`Logger level: ${logger.level}`);
            } else if (
                MyGame.gameState !== GameState.FINISHED ||
                name === 'Enter' ||
                name === 'Dead'
            ) {
                MyGame.inputSingleLetter(name);
            }
        },
        false,
    );
}

/*Setup Helper Functions */

function setVersion(version: string) {
    let elem: MaybeHTMLElement = document.getElementById('version');
    if (elem) {
        elem.innerHTML = version;
    }
}
