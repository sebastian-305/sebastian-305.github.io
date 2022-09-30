export enum LoggerLevel {
    OFF,
    ERROR,
    WARNING,
    INFO,
}

export enum GameState {
    UNMAPPED,
    INITIALIZED,
    ONGOING,
    FINISHED,
}

export type MaybeHTMLElement = HTMLElement | null;

export class SimpleLogger {
    private _level: LoggerLevel;

    constructor(initial_level: LoggerLevel = LoggerLevel.OFF) {
        this._level = initial_level;
    }
    public set level(lvl: LoggerLevel) {
        this._level = lvl;
    }
    public get level(): LoggerLevel {
        return this._level;
    }
}

export abstract class GameBoardInterface {
    protected _canvas: Document;
    protected _current_row: number;
    protected _current_letter_index: number;
    // private _rowColor: string[];
    protected _currentRowContent: string[];
    protected _length_word: number;
    protected _logger: SimpleLogger;

    constructor(obj: Document, logger: SimpleLogger) {
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

    abstract newGame(length_word: number): void;

    abstract writeLetter(
        row: number,
        letter_index: number,
        try_letter: string,
    ): void;

    abstract removeLetter(row: number, letter_index: number): void;

    abstract setRowColors(row: number, colorClass: string): void;

    abstract handleShortInput(current_word: string): void;

    abstract handleUnknownWord(row: number, word?: string): void;

    abstract setLetterColor(row: number, color: string[]): void;

    abstract setKeyboardLetterColor(key: string, color: string): void;

    abstract handleGameWon(solution: string): void;

    abstract handleGameLost(solution: string): void;

    abstract handleWrongInput(): void;

    abstract showSolution(solution: string): void;

    abstract setUsedLetters(usedLetters: string[]): void; //TODO DO I NEED THIS?
}

export abstract class WordleGameInterface {
    protected _solution_words: string[];
    protected _gameBoard: GameBoardInterface;
    protected _dictionary: string[];
    protected _solution: string[];
    protected _gameState: GameState;
    protected _current_row: number;
    protected _current_letter_index: number;
    protected _length_word: number;
    protected _current_row_content: string[];
    protected _restart: number;
    protected _usedLetters: string[];
    protected _greenLetters: string[];
    protected _yellowLetters: string[];
    protected _greyLetters: string[];
    protected _logger: SimpleLogger;

    constructor(
        solution_words: string[],
        gameBoard: GameBoardInterface,
        dict_words: string[],
        logger: SimpleLogger,
    ) {
        this._logger = logger;
        if (this._logger.level >= LoggerLevel.INFO) {
            console.log(
                `Game.constuctor: *solution_words*, ${gameBoard}, *dict_words`,
            );
        }
        this._solution_words = solution_words;
        this._gameBoard = gameBoard;
        this._dictionary = dict_words;
        this._solution = [];
        this._gameState = GameState.INITIALIZED;
        this._current_row = 1;
        this._current_letter_index = 1;
        this._length_word = 0;
        this._current_row_content = [];
        this._restart = 0;
        this._usedLetters = [];
        this._greenLetters = [];
        this._yellowLetters = [];
        this._greyLetters = [];
    }

    //public:
    public abstract newGame(
        length_word: number,
        solution_words: string[],
    ): void;

    public abstract inputSingleLetter(letter: string[]): void;

    //private
    protected abstract checkRow(): void;

    protected abstract updateKeyboardColor(
        greyLetters: string[],
        yellowLetters: string[],
        greenLetters: string[],
    ): void;

    protected abstract setUpDictionary(
        word_length: number,
        dict_words: string[],
    ): void;
}
