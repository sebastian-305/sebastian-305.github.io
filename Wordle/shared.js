export var LoggerLevel;
(function (LoggerLevel) {
    LoggerLevel[LoggerLevel["OFF"] = 0] = "OFF";
    LoggerLevel[LoggerLevel["ERROR"] = 1] = "ERROR";
    LoggerLevel[LoggerLevel["WARNING"] = 2] = "WARNING";
    LoggerLevel[LoggerLevel["INFO"] = 3] = "INFO";
})(LoggerLevel || (LoggerLevel = {}));
export var GameState;
(function (GameState) {
    GameState[GameState["UNMAPPED"] = 0] = "UNMAPPED";
    GameState[GameState["INITIALIZED"] = 1] = "INITIALIZED";
    GameState[GameState["ONGOING"] = 2] = "ONGOING";
    GameState[GameState["FINISHED"] = 3] = "FINISHED";
})(GameState || (GameState = {}));
export class SimpleLogger {
    constructor(initial_level = LoggerLevel.OFF) {
        this._level = initial_level;
    }
    set level(lvl) {
        this._level = lvl;
    }
    get level() {
        return this._level;
    }
}
export class GameBoardInterface {
    constructor(obj, logger) {
        this._logger = logger;
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`GameBoard.constructor: ${obj}`);
        }
        this._canvas = obj;
        this._current_row = 1;
        this._current_letter_index = 1;
        // this._rowColor = [];
        this._currentRowContent = new Array();
        this._length_word = 0;
    }
}
export class WordleGameInterface {
    constructor(solution_words, gameBoard, dict_words, logger) {
        this._logger = logger;
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(`Game.constuctor: *solution_words*, ${gameBoard}, *dict_words`);
        }
        this._solution_words = solution_words;
        this._gameBoard = gameBoard;
        this._full_dictionary = dict_words;
        this._dictionary = dict_words;
        this._solution = [];
        this._gameState = GameState.INITIALIZED;
        this._current_row = 1;
        this._current_letter_index = 1;
        this._length_word = 0;
        this._current_row_content = [];
        this._restart = 0;
        this._usedLetters = new Set();
        this._greenLetters = new Set();
        this._yellowLetters = new Set();
        this._greyLetters = new Set();
    }
}
