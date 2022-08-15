
const words = new Array(
    "Falle",
    "Pause",
    "Audio",
    "Liebe",
    "Islam",
    "Ernte",
    "Fisch",
    "Lachs",
    "Buche",
    "Jause",
    "Schuh",
    "Braun",
    "Haare",
    "Beere",
    "Rache",
    "Clown",
    "Busch"
);


class GameBoard {
    constructor(obj) {
        this.canvas = obj;


    }

    newGame(solution) {
        this.canvas.innerHTML = "";
        this.writeLine(solution);

    }

    writeLine(word2d) {
        let returnValue = "";
        for (let i = 0; i < 5; i++) {
            returnValue += `<td class="${word2d[i][1]}">${word2d[i][0]}</td>`;
        }
        let insertString = `<tr>${returnValue}</tr>`;

        this.canvas.innerHTML += insertString;
    }



};

class Game {
    constructor(words, gameBoard) {
        this.words = words;
        this.gameBoard = gameBoard;
    }


    newGame() {
        this.solution = Array.from(this.words[this.getRandom()]);
        this.gameState = "ongoing";
        this.searchWords = new Array();
        this.gameBoard.newGame(this.solution.join(""));
    }

    ask(currentTry) {

        // = window.prompt('Tippen Sie ein Wort mit 5 Buchstaben ein' + this.solution);
        if (currentTry == null) {
            this.gameState = "cancel";
            return;
        }

        
        this.writeLine(currentTry);
        this.searchWords.push(currentTry);
        

        if (currentTry == this.solution.join("")) {
            this.gameState = "won";
        }

    }

    writeLine(word) {
        if (word.length != 5)
            return Error;
        let word2d = new Array();

        for (let i = 0; i < 5; i++) {
            word2d[i]= [word[i], "grey"];
            
            if (this.solution.includes(word[i])) {
                word2d[i][1] = "yellow";
            }

            if (this.solution[i] === word[i]) {
                word2d[i][1] = "green";
            }
        } 
        this.gameBoard.writeLine(word2d);
    }

    getRandom() {
        let rd = Math.random();
        let lg = this.words.length;
        return Math.floor(rd * lg);
    }









};

const element = this.document.getElementById("gaming_table").firstElementChild;

let Board= new GameBoard(element);
let MyGame = new Game(words, Board);




MyGame.newGame();
MyGame.ask("Fisch");
MyGame.ask("Busch");
MyGame.ask("Clown");
MyGame.ask("Audio");




console.log("Ende");