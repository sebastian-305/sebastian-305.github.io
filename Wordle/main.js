//Ver 2.2.2.0
setVersion('2.2.2.0');
import { getDict, getSolutions } from './dictionary.js';
import { LoggerLevel, SimpleLogger, GameState, } from './shared.js';
import { GameBoard } from './GameBoard.js';
import { WordleGame } from './WordleGame.js';
const LENGTH_WORD = 5;
const dict_words = getDict();
const solution_word_array = getSolutions();
const logger = new SimpleLogger(LoggerLevel.OFF);
/*START MAIN LOGIC*/
const element = window.document;
const Board = new GameBoard(element, logger);
const MyGame = new WordleGame(Board, dict_words, logger);
MyGame.newGame(LENGTH_WORD, solution_word_array);
document.addEventListener('keyup', (event) => {
    logger.info(`Event \'keyup\' ${event}->${event.key}`);
    const name = event.key;
    if (name == 'End') {
        logger.level =
            logger.level === LoggerLevel.OFF
                ? LoggerLevel.INFO
                : LoggerLevel.OFF;
        console.log(`Logger level: ${logger.levelAsString}`);
    }
    else if (MyGame.gameState !== GameState.FINISHED ||
        name === 'Enter' ||
        name === 'Dead') {
        MyGame.inputSingleLetter(name);
    }
}, false);
document.addEventListener('click', function handleClick(event) {
    logger.info(`Event \'click\' ${event}`);
    const target = event.target;
    if (target.classList.contains('keyboard_letter')) {
        MyGame.inputSingleLetter(target.id);
    }
});
/*Setup Helper Functions */
function setVersion(version) {
    const elem = document.getElementById('version');
    if (elem) {
        elem.innerHTML = version;
    }
}
