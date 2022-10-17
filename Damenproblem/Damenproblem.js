let queenProblemProperties = {
    startTime: 0,
    fieldSize: 8,
    calcuationMethod: 'rek',
    iterator: 0,
    solutionsFound: 0,
    totalSolutionsFound: 0,
    allSolutionsArray: [],
    flipHorizontal: false,
    flipVertical: false,
    rotation: 1,
    currentDisplayedSolution: [],
};

let loadingGif = document.querySelector('#loadingGif');
queenProblemProperties.startTime = new Date().getTime();

calculateSolutionsRecursive(queenProblemProperties.allSolutionsArray); //Lösungen berechnen

drawSolutionAsHtml(
    (queenProblemProperties.currentDisplayedSolution =
        queenProblemProperties.allSolutionsArray[0]),
); //Feld zeichnen mit erster Lösung

fillDropDownWithSolutions(queenProblemProperties.allSolutionsArray); //Drop Down Menü befüllen

//console.log(`Iterationen der Hauptfunktion: ${queenProblemProperties.iterator}`); //Nicht so wichtig

/************************************************************************************************/
/* FUNKTIONEN */

function fillDropDownWithSolutions(allSolutionsArray) {
    //Drop Down Menü befüllen
    let dropDownMenu = document.getElementById('DamenSelect');
    let menuItemStringAsHtmlCode;

    dropDownMenu.innerHTML = '';

    for (let elements of allSolutionsArray) {
        menuItemStringAsHtmlCode = '<option >';
        menuItemStringAsHtmlCode += elements;
        menuItemStringAsHtmlCode += '</option>';
        dropDownMenu.innerHTML += menuItemStringAsHtmlCode;
    }
}

function updateFieldWithOtherSolution(state = 'reset') {
    //Funktion wird beim Ändern des Drop Down Menüs aufgerufen
    switch (state) {
        case 'reset':
            let dropDownMenu = document.getElementById('DamenSelect');
            let selectedIndexOfDropDownMenu = dropDownMenu.selectedIndex;
            queenProblemProperties.currentDisplayedSolution = [
                ...queenProblemProperties.allSolutionsArray[
                    selectedIndexOfDropDownMenu
                ],
            ];
            queenProblemProperties.flipVertical = false;
            queenProblemProperties.flipHorizontal = false;
            queenProblemProperties.rotation = 1;
            break;
        case 'flipV':
            queenProblemProperties.flipVertical =
                !queenProblemProperties.flipVertical;
            queenProblemProperties.currentDisplayedSolution = [
                ...flipVertical(
                    queenProblemProperties.currentDisplayedSolution,
                ),
            ];
            break;
        case 'flipH':
            queenProblemProperties.flipHorizontal =
                !queenProblemProperties.flipHorizontal;
            queenProblemProperties.currentDisplayedSolution = [
                ...flipHorizontal(
                    queenProblemProperties.currentDisplayedSolution,
                ),
            ];
            break;
        case 'rotate':
            queenProblemProperties.rotation =
                queenProblemProperties.rotation === 1
                    ? 4
                    : queenProblemProperties.rotation - 1;
            queenProblemProperties.currentDisplayedSolution = [
                ...rotateLeft90degree(
                    queenProblemProperties.currentDisplayedSolution,
                    3,
                ),
            ];
            break;
    }
    drawSolutionAsHtml(queenProblemProperties.currentDisplayedSolution);
}

function updateAll() {
    let tempFieldSize, tempCalcMethod, loadTime;

    tempFieldSize = Number(document.getElementById('BoardSizeSelect').value);
    tempCalcMethod = document.getElementById('CalcMethodSelect').value;

    if ((tempFieldSize > 6 && tempCalcMethod === 'loop') || tempFieldSize > 7) {
        if (
            !confirm(
                'Die Berechnung kann einige Zeit andauern. Möchten Sie die Berechnung starten?',
            )
        ) {
            return;
        }
        loadingGif.style.display = 'inline';
        document.querySelector('#wrapper').innerHTML = '';
        window.setTimeout(updateAllFunctionLogic, 5);
    } else {
        updateAllFunctionLogic();
    }

    function updateAllFunctionLogic() {
        queenProblemProperties = {
            startTime: 0,
            fieldSize: 8,
            calcuationMethod: 'rek',
            iterator: 0,
            solutionsFound: 0,
            totalSolutionsFound: 0,
            allSolutionsArray: [],
            flipHorizontal: false,
            flipVertical: false,
            rotation: 1,
            currentDisplayedSolution: [],
        };
        queenProblemProperties.startTime = new Date().getTime();

        queenProblemProperties.fieldSize = tempFieldSize;
        queenProblemProperties.calcuationMethod = tempCalcMethod;

        if (queenProblemProperties.calcuationMethod === 'rek') {
            calculateSolutionsRecursive(
                queenProblemProperties.allSolutionsArray,
            );
            console.log(
                `Iterationen der Hauptfunktion: ${queenProblemProperties.iterator}`,
            ); //Nicht so wichtig
        } else {
            calculateSolutionsInLoop(queenProblemProperties.allSolutionsArray);
        }

        loadTime = new Date().getTime() - queenProblemProperties.startTime;
        document.getElementById('loadTime').innerHTML = `${Math.floor(
            loadTime / 1000,
        )} s ${loadTime % 1000} ms`;

        fillDropDownWithSolutions(queenProblemProperties.allSolutionsArray); //Drop Down Menü befüllen
        drawSolutionAsHtml(
            (queenProblemProperties.currentDisplayedSolution =
                queenProblemProperties.allSolutionsArray[0]),
        );
    }
}

function drawSolutionAsHtml(solution1d) {
    //Spielfeld mit der jeweiligen Lösung in das HTML übertragen
    let solution2d = convertSolutionFrom1dIn2dArrayWithFlags(solution1d);
    let counter = 0;
    let target = document.getElementById('wrapper');
    let rowStringAsHtmlCode; //Speichert HTML code, der dann in die Webseite geschrieben wird
    target.innerHTML = ''; //Wir setzen das Spielfeld zurück

    loadingGif.style.display = 'none';

    for (let y_index in solution2d) {
        rowStringAsHtmlCode = '<div>'; //Neue Zeile

        for (let x_index in solution2d[y_index]) {
            //Alle Felder einer Reihe setzen
            if (solution2d[y_index][x_index]) {
                //Wenn das Feld 'true' ist, steht eine Dame darauf und wir färben es mit der CSS Klasse queen
                rowStringAsHtmlCode += "<div class='field queen unselectable'>";
            } else {
                rowStringAsHtmlCode += "<div class='field unselectable'>";
            }
            rowStringAsHtmlCode += counter;
            rowStringAsHtmlCode += '</div>';
            counter++;
        }

        rowStringAsHtmlCode += '</div>';
        target.innerHTML += rowStringAsHtmlCode; //Zeile Zeichnen
    }

    document.getElementById('uniqueSoltions').innerHTML =
        queenProblemProperties.solutionsFound;
    document.getElementById('totalSolutions').innerHTML =
        queenProblemProperties.totalSolutionsFound;

    function convertSolutionFrom1dIn2dArrayWithFlags(solution1d) {
        //Die jeweilige Lösung als einen 2-dimensionalen Boolean Array berechnen
        let solution2d = new Array(queenProblemProperties.fieldSize);

        for (let i = 0; i < queenProblemProperties.fieldSize; ++i) {
            solution2d[i] = new Array(queenProblemProperties.fieldSize);
            solution2d[i].fill(false); //Alle Werte standardmäßig auf "false" setzen, auch wird dadurch der Array als Boolean Array initialisiert
        }

        for (let queen of solution1d) {
            solution2d[Math.floor(queen / queenProblemProperties.fieldSize)][
                queen % queenProblemProperties.fieldSize
            ] = true; //Position der jeweiligen Dame in den 2-dimensionalen Array eintragen
        }

        return solution2d;
    }
}

function calculateSolutionsRecursive(
    saveSolutionsHere,
    arrayOfLegitQueens = [],
    startCheckingCurrentQueenFromHere = 0,
) {
    //Rekursive Funtion um die Lösungen zu berechnen
    queenProblemProperties.iterator++;

    if (
        arrayOfLegitQueens[arrayOfLegitQueens.length - 1] >
        arrayOfLegitQueens.length * queenProblemProperties.fieldSize
    ) {
        // Unnötige Iterationen verwerfen
        return false;
    }

    for (
        let currentlyInvestigatedQueen = startCheckingCurrentQueenFromHere;
        currentlyInvestigatedQueen <
        queenProblemProperties.fieldSize * queenProblemProperties.fieldSize;
        currentlyInvestigatedQueen++ //Wir probieren alle Felder aus, ob die Felder zu einer Lösung führen
    ) {
        if (checkCollisions(arrayOfLegitQueens, currentlyInvestigatedQueen)) {
            //Wenn es eine Kollision gibt, können wir den Rest der Schleife überspringen
            continue;
        }

        arrayOfLegitQueens.push(currentlyInvestigatedQueen);

        if (arrayOfLegitQueens.length === queenProblemProperties.fieldSize) {
            //Eine Lösung gefunden!
            queenProblemProperties.totalSolutionsFound++;

            if (
                !checkIfSolutionExcists(saveSolutionsHere, arrayOfLegitQueens)
            ) {
                saveSolutionsHere.push([...arrayOfLegitQueens]); //Lösung speichern
                queenProblemProperties.solutionsFound++;
            }
            arrayOfLegitQueens.pop();
            continue; //Weitersuchen
        }

        if (
            calculateSolutionsRecursive(
                saveSolutionsHere,
                arrayOfLegitQueens,
                currentlyInvestigatedQueen + 1,
            )
        ) {
            //die jetzige Position der Dame passt soweit, jetzt können wir eine weitere Dame hinzufügen
            return true;
        }
        arrayOfLegitQueens.pop();
    }
    return;
}

function calculateSolutionsInLoop(saveSolutionsHere) {
    let calculationArray = new Array(queenProblemProperties.fieldSize);
    calculationArray.fill(0);
    let rowPointer = 0;
    let finished = false;
    let currentSolution;
    let testcounter = 0;

    do {
        rowPointer = 0;
        currentSolution = convertSoltionInConsecutiveNumbers([
            ...calculationArray,
        ]);
        testcounter++;
        if (!checkCollisonRowForLoopFunction(calculationArray)) {
            if (!checkCollisionQueenArray([...currentSolution])) {
                queenProblemProperties.totalSolutionsFound++;
                if (
                    !checkIfSolutionExcists(saveSolutionsHere, currentSolution)
                ) {
                    saveSolutionsHere.push([...currentSolution]); //Lösung speichern
                    queenProblemProperties.solutionsFound++;
                }
            }
        }

        while (
            ++calculationArray[rowPointer] === queenProblemProperties.fieldSize
        ) {
            calculationArray[rowPointer] = 0;
            ++rowPointer;

            if (rowPointer === queenProblemProperties.fieldSize) {
                finished = true;
                break;
            }
        }

        if (rowPointer === queenProblemProperties.fieldSize - 2) {
            const bigPercent =
                (100 / queenProblemProperties.fieldSize) *
                calculationArray[queenProblemProperties.fieldSize - 1];
            const smallPercent =
                ((100 / queenProblemProperties.fieldSize) *
                    calculationArray[queenProblemProperties.fieldSize - 2]) /
                queenProblemProperties.fieldSize;
            // console.clear();
            console.log(
                'Progress: ',
                (bigPercent + smallPercent).toFixed(2),
                '%',
            );
        }
    } while (!finished);

    // console.clear();
    console.log(
        'Progress: ',
        (100).toFixed(2),
        '%',
        'Schleifendurchgänge: ',
        testcounter,
    );

    function convertSoltionInConsecutiveNumbers(solution = []) {
        solution.forEach(function (cur, index, arr) {
            arr[index] = cur + index * arr.length;
        });
        return solution;
    }
}

function checkCollisionQueenArray(queenArray) {
    collision = false;
    let tempArray;
    for (let index = 0; index < queenArray.length; ++index) {
        if (index === queenArray.length - 1) {
            break;
        }
        tempArray = [...queenArray];
        tempArray.splice(0, index + 1);
        if (checkCollisions(tempArray, queenArray[index])) {
            return true;
        }
    }
    return collision;
}

function checkCollisions(arrayOfLegitQueens, currentlyInvestigatedQueen) {
    //Wir prüfen ob die jetztige Dame mit anderen Damen kolidiert
    if (arrayOfLegitQueens.length === 0) {
        //Wenn es keine weiteren Damen gibt, kann es keine Kollisionen geben
        return false;
    }

    for (let currentLegitQueen of arrayOfLegitQueens) {
        //Alle bisher gefundenen Damen überprüfen, ob diese mit der jetzigen Dame kolidieren
        if (
            Math.floor(currentLegitQueen / queenProblemProperties.fieldSize) ===
            Math.floor(
                currentlyInvestigatedQueen / queenProblemProperties.fieldSize,
            )
        ) {
            //Zeile testen
            return true;
        }

        if (
            currentLegitQueen % queenProblemProperties.fieldSize ===
            currentlyInvestigatedQueen % queenProblemProperties.fieldSize
        ) {
            //Spalte testen
            return true;
        }

        if (
            checkDiagonalCollisions(
                currentLegitQueen,
                currentlyInvestigatedQueen,
            )
        ) {
            //Diagonal ist komplizierter, darum wurde das auf eine eigene Funktion ausgelagert
            return true;
        }
    }
    return false;

    function checkDiagonalCollisions(
        currentLegitQueen,
        currentlyInvestigatedQueen,
    ) {
        //Diagonal auf Kollisionen überprüfen
        for (
            let currentFieldToCheck = currentlyInvestigatedQueen;
            currentFieldToCheck % queenProblemProperties.fieldSize <=
                currentlyInvestigatedQueen % queenProblemProperties.fieldSize &&
            currentFieldToCheck >= currentLegitQueen;
            currentFieldToCheck -= queenProblemProperties.fieldSize + 1 //Nach links oben
        ) {
            if (currentFieldToCheck === currentLegitQueen) {
                return true;
            }
        }

        for (
            let currentFieldToCheck = currentlyInvestigatedQueen;
            currentFieldToCheck % queenProblemProperties.fieldSize >=
                currentlyInvestigatedQueen % queenProblemProperties.fieldSize &&
            currentFieldToCheck >= currentLegitQueen;
            currentFieldToCheck -= queenProblemProperties.fieldSize - 1 //Nach rechts oben
        ) {
            if (currentFieldToCheck === currentLegitQueen) {
                return true;
            }
        }

        for (
            let currentFieldToCheck = currentlyInvestigatedQueen;
            currentFieldToCheck % queenProblemProperties.fieldSize <=
                currentlyInvestigatedQueen % queenProblemProperties.fieldSize &&
            currentFieldToCheck <= currentLegitQueen;
            currentFieldToCheck += queenProblemProperties.fieldSize - 1 //Nach links unten
        ) {
            if (currentFieldToCheck === currentLegitQueen) {
                return true;
            }
        }

        for (
            let currentFieldToCheck = currentlyInvestigatedQueen;
            currentFieldToCheck % queenProblemProperties.fieldSize >=
                currentlyInvestigatedQueen % queenProblemProperties.fieldSize &&
            currentFieldToCheck <= currentLegitQueen;
            currentFieldToCheck += queenProblemProperties.fieldSize + 1 //Nach rechts unten
        ) {
            if (currentFieldToCheck === currentLegitQueen) {
                return true;
            }
        }
        return false; //Keine Kollision gefunden
    }
}

function checkCollisonRowForLoopFunction(queens) {
    for (let i = 0; i < queens.length; ++i) {
        for (let j = i + 1; j < queens.length; ++j) {
            if (queens[i] === queens[j]) {
                return true;
            }
        }
    }
    return false;
}

function checkIfSolutionExcists(foundSolutions, solutionCandidate) {
    for (let solution of foundSolutions) {
        // console.log(`checking ${solutionCandidate} with ${solution}`);

        for (let i = 1; i < 5; i++) {
            // console.log(`checking ${rotateLeft90(solutionCandidate, i)} with ${solution}`);
            if (rotateLeft90degree(solutionCandidate, i).equals(solution)) {
                return true;
            }
            if (
                flipHorizontal(rotateLeft90degree(solutionCandidate, i)).equals(
                    solution,
                )
            ) {
                return true;
            }
            if (
                flipVertical(rotateLeft90degree(solutionCandidate, i)).equals(
                    solution,
                )
            ) {
                return true;
            }
        }
    }

    return false;
}

function rotateLeft90degree(solution, flipCounter = 1) {
    let newSolution = [...solution];

    for (let i = 0; i < flipCounter; i++) {
        newSolution.forEach((currentValue, index) => {
            newSolution[index] =
                currentValue +
                queenProblemProperties.fieldSize *
                    queenProblemProperties.fieldSize -
                queenProblemProperties.fieldSize -
                (queenProblemProperties.fieldSize + 1) * currentValue +
                (queenProblemProperties.fieldSize *
                    queenProblemProperties.fieldSize +
                    1) *
                    Math.floor(currentValue / queenProblemProperties.fieldSize);
        });
    }
    return newSolution.sort((a, b) => {
        return a - b;
    });
}

function flipHorizontal(solution1d) {
    let newSolution = [...solution1d];
    solution1d.forEach((currentValue, index) => {
        newSolution[index] =
            queenProblemProperties.fieldSize *
                (Math.floor(currentValue / queenProblemProperties.fieldSize) +
                    1) -
            1 -
            (currentValue % queenProblemProperties.fieldSize);
    });
    return newSolution.sort((a, b) => {
        return a - b;
    });
}

function flipVertical(solution1d) {
    let newSolution = [...solution1d];

    solution1d.forEach((currentValue, index) => {
        newSolution[index] =
            queenProblemProperties.fieldSize *
                queenProblemProperties.fieldSize +
            queenProblemProperties.fieldSize -
            currentValue -
            2 *
                ((queenProblemProperties.fieldSize *
                    queenProblemProperties.fieldSize -
                    (currentValue + 1)) %
                    queenProblemProperties.fieldSize) -
            2;
    });
    return newSolution.sort((a, b) => {
        return a - b;
    });
}
