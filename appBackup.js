
let width = 10; //**Preset: Original dimension of the board **
let numSquares = width ** 2;
let numBombs = 20; //**Preset: Number of Bombs **/
let grid = document.querySelector('.grid');
const squares = []; //Array holding the data of all the grid's squares
let safeRemaining = numSquares - numBombs;
let bombsRemaining = numBombs;
let gameOver = false;
let gameWon = false;
const smiley = document.querySelector('.smiley');
let minutesLabel = document.querySelector("#minutes");
let secondsLabel = document.querySelector("#seconds");
let totalSeconds = 0;
setInterval(setTime, 1000);



function playGame() {
    /* squareValues represents which squares on the grid will contain a bomb.
    Squares that contain "valid" are safe squares, and squares with "bomb"
    are bombs*/
    const squareValues = new Array(numSquares); // Creates the array
    squareValues.fill('valid'); //fills the entire array with "valid"; 
    addBombs(squareValues, numBombs); //replaces a pre-specified number of squares with bombs

    // create each individual square, first by creating a div for each square,
    // then giving each square an id of its number and a value of "valid"/"bomb"
    // The square is then added to the grid and a new array.
    for (let i = 0; i < numSquares; i++) {
        let square = document.createElement("div");
        square.setAttribute("id", i)
        square.setAttribute("class", squareValues[i]);
        square.classList.add('gridSquare');
        grid.appendChild(square);
        squares.push(square);
    }

    //calcuates the number of neighboring bombs and sets that number as
    //an attribute of each square;
    for (let i = 0; i < numSquares; i++) {     
        if (squares[i].classList.contains('valid')) {
            let adjacentBombs = findAdjacentBombs(squares[i]);
            squares[i].setAttribute('numAdjacentBombs', adjacentBombs);
        }
        //adds an event listener on each square for a left click
        //revealing what value is under that square;
        squares[i].addEventListener("click", function (e) {
            if (!squares[i].classList.contains("flag") && !gameOver) {
                clickSquare(squares[i]);
            }       
        })
        //Adds an event listener for a right click, toggling a red flag on
        //and off marking a bomb;
        squares[i].addEventListener("contextmenu", function (e) {
            e.preventDefault();
            if (!gameOver) {
                if (!squares[i].classList.contains("flag")) {
                    if (!squares[i].classList.contains("checked")  && bombsRemaining > 0) {
                        squares[i].classList.add("flag");
                        squares[i].innerHTML= '🚩';
                        bombsRemaining--;
                        document.getElementById("numBombs").innerText = bombsRemaining.toString().padStart(3, '0');
                        
    
                    }
                    
                }
                else {
                    squares[i].classList.remove("flag");
                    squares[i].innerHTML = "";
                    bombsRemaining++;
                    document.getElementById("numBombs").innerText = bombsRemaining.toString().padStart(3, '0');
    
                }
            }     
        })

        //Event listener for the "reset" button. Reloads the page when clicked
        smiley.addEventListener('click', function (e) {
            location.reload();
        })

        //Changes the smiley to shock on hover
        smiley.addEventListener('mouseover', function() {
            if (smiley.innerHTML === '🙂') {
                smiley.innerHTML = '😮';
            }
        })

        //Removes shocked smiley when hover ends
        smiley.addEventListener('mouseout', function() {
            if (smiley.innerHTML === '😮') {
                smiley.innerHTML = '🙂';
            }
            
        })
        
    }
    //displays initial number of bombs/safe squares
    document.getElementById("numBombs").innerText = bombsRemaining.toString().padStart(3, '0');
    // document.getElementById("numSafe").innerText = safeRemaining;
}

//function that decides the locations of the bombs for the starting gameboard
function addBombs(squareValues, numBombs) {
    let bombCount = numBombs;
    while (bombCount > 0) {
        let randomCell = Math.floor(Math.random() * 100);
        if (squareValues[randomCell] !== 'bomb') {
            squareValues[randomCell] = 'bomb';
            bombCount--;
        }
    }
}

//Function that returns the number of bombs surrounding a particular square
function findAdjacentBombs(square) {
    let idNum = parseInt(square.id);
    let total = 0;
    let isLeft = false; //true if square is on the left column of grid
    let isRight = false; //true if square is on right column of grid
    let isTop = false; //true if square is in top row of grid
    let isBottom = false; //true if square is in bottom row of grid

    if (idNum % width === 0) {
        isLeft = true;
    }

    if (idNum % width === width - 1) {
        isRight = true;
    }

    if (idNum - width < 0) {
        isTop = true;
    }

    if (idNum + width > 99) {
        isBottom = true;
    }

    //checks upper left square for bomb
    if (!isLeft && !isTop) {
        if (squares[idNum - width - 1].classList.contains('bomb')) {
            total++;
        }
    }

    //checks upper middle square for bomb
    if (!isTop) {
        if (squares[idNum - width].classList.contains('bomb')) {
            total++;
        }
    }

    //check upper right square for bomb
    if (!isRight && !isTop) {
        if (squares[idNum - width + 1].classList.contains('bomb')) {
            total++;
        }
    }

    //checks center left for bomb
    if (!isLeft) {
        if (squares[idNum - 1].classList.contains('bomb')) {
            total++;
        }
    }

    //checks center right for bomb
    if (!isRight) {
        if (squares[idNum + 1].classList.contains('bomb')) {
            total++;
        }
    }

    //checks bottom left for bomb
    if (!isLeft && !isBottom) {
        if (squares[idNum + width - 1].classList.contains('bomb')) {
            total++;
        }
    }

    //check bottom for bomb
    if (!isBottom) {
        if (squares[idNum + width].classList.contains('bomb')) {
            total++;
        }
    }

    //check bottom right for bomb
    if (!isRight && !isBottom) {
        if(squares[idNum + width + 1].classList.contains('bomb')) {
            total++;
        }
    }
    return total;
}

//Dictates what happens when a square is clicked
function clickSquare(square) {
    smiley.innerHTML = '😮';
    console.log("CP1")
    if(square.classList.contains('bomb')) {
        setTimeout(function() { //the delay gives time for the board with bombs to load
            smiley.innerHTML = '💀';}, 100);     
        endGame();
        gameOver = true;
        gameWon = false;
    }
    else {
        let bombs = parseInt(square.getAttribute('numAdjacentBombs'));    
        if (bombs !== 0) {
            square.innerText = bombs;
            changeColor(square, bombs);
            if (!square.classList.contains("checked")) {
                square.classList.add("checked");
                console.log("CP1: Safe Square", square.id);
                safeRemaining--;
            }
            
        }
        else {
          unveil(square);
        }
    }
    // document.getElementById("numSafe").innerText = safeRemaining;
    if (safeRemaining === 0) {
        setTimeout(function() { //the delay gives time for the board with bombs to load
            smiley.innerHTML = '😎';}, 100);      
        gameWon = true;
        gameOver = true;
        endGame();
    }
    
    if (!gameOver) {
        setTimeout(function() { //the delay gives time for the board with bombs to load
            smiley.innerHTML = '🙂';}, 100);  
    }
}

function unveil(square) {
    let idNum = parseInt(square.id);
    let isLeft = false;
    let isRight = false;
    let isTop = false;
    let isBottom = false;
    
    if (!square.classList.contains("checked")) {
        square.classList.add("checked");
        console.log("CP2: Safe Square", square.id);
        safeRemaining--;
        if (idNum % width === 0) {
            isLeft = true;
        }
    
        if (idNum % width === width - 1) {
            isRight = true;
        }
    
        if (idNum - width < 0) {
            isTop = true;
        }
    
        if (idNum + width > 99) {
            isBottom = true;
        }
    
        //checks upper left square
        let upperLeftSquare = squares[idNum - width - 1];
        if (!isLeft && !isTop && !upperLeftSquare.classList.contains('checked')) {
            let val = parseInt(upperLeftSquare.getAttribute('numAdjacentBombs'));
            if (val !== 0) { //no need to recurse - will just display the single value
                upperLeftSquare.innerText = val;
                changeColor(upperLeftSquare, val); //each number has a different volor
                upperLeftSquare.classList.add("checked"); //blocks the square from being processed again
                console.log("CP3: Safe Square", upperLeftSquare);
                safeRemaining--; //decrements the number of safe squares to find
            }
            else {
                unveil(upperLeftSquare); //0 neighboring bombs found. recurse using upper left square
            }
        }
    
        //checks upper middle square
        let upperMiddleSquare = squares[idNum - width];
        if (!isTop && !upperMiddleSquare.classList.contains('checked')) {
            let val = parseInt(upperMiddleSquare.getAttribute('numAdjacentBombs'));
            if (val !== 0) {
                upperMiddleSquare.innerText = val;
                changeColor(upperMiddleSquare, val);
                upperMiddleSquare.classList.add("checked");
                console.log("CP4: Safe Square", upperMiddleSquare.id);
                safeRemaining--;
            }
            else {
                unveil(upperMiddleSquare);
            }
        }
    
        //check upper right square
        let upperRightSquare = squares[idNum - width + 1];
        if (!isRight && !isTop && !upperRightSquare.classList.contains('checked')) {
            let val = parseInt(upperRightSquare.getAttribute('numAdjacentBombs'));
            if (val !== 0) {
                upperRightSquare.innerText = val;
                changeColor(upperRightSquare, val);
                upperRightSquare.classList.add("checked");
                console.log("CP5: Safe Square", upperRightSquare.id);
                safeRemaining--;
            }
            else {
                unveil(upperRightSquare);
            }
        }
    
        //check center left
        let centerLeftSquare = squares[idNum - 1];
        if (!isLeft && !centerLeftSquare.classList.contains('checked')) {
            let val = parseInt(centerLeftSquare.getAttribute('numAdjacentBombs'));
            if (val !== 0) {
                centerLeftSquare.innerText = val;
                changeColor(centerLeftSquare, val);
                centerLeftSquare.classList.add("checked");
                console.log("CP6: Safe Square", centerLeftSquare.id);
                safeRemaining--;
            }
            else {
                unveil(centerLeftSquare);
            }
        }
    
        //check center right
        let centerRightSquare = squares[idNum + 1]
        if (!isRight && !centerRightSquare.classList.contains('checked')) {
            let val = parseInt(centerRightSquare.getAttribute('numAdjacentBombs'));
            if (val !== 0) {
                centerRightSquare.innerText = val;
                changeColor(centerRightSquare, val);
                centerRightSquare.classList.add("checked");
                console.log("CP7: Safe Square", squares[idNum+1].id);
                safeRemaining--;
            }
            else {
                unveil(centerRightSquare);
            }
        }
    
        //check bottom left
        let bottomLeftSquare = squares[idNum + width - 1];
        if (!isLeft && !isBottom && !bottomLeftSquare.classList.contains('checked')) {
            let val = parseInt(bottomLeftSquare.getAttribute('numAdjacentBombs'));
            if (val !== 0) {
                bottomLeftSquare.innerText = val;
                changeColor(bottomLeftSquare, val);
                bottomLeftSquare.classList.add("checked");
                console.log("CP8: Safe Square", bottomLeftSquare.id);
                safeRemaining--;
            }
            else {
                unveil(bottomLeftSquare);
            }
        }
        
        //check bottom center
        let bottomCenterSquare = squares[idNum + width]
        if (!isBottom && !bottomCenterSquare.classList.contains('checked')) {
            let val = parseInt(bottomCenterSquare.getAttribute('numAdjacentBombs'));
            if (val !== 0) {
                bottomCenterSquare.innerText = val;
                changeColor(bottomCenterSquare, val);
                bottomCenterSquare.classList.add("checked");
                console.log("CP9: Safe Square", bottomCenterSquare.id);
                safeRemaining--;
            }
            else {
                unveil(bottomCenterSquare);
            }
        }
        
        //check bottom right
        let bottomRightSquare = squares[idNum + width + 1];
        if (!isRight && !isBottom && !bottomRightSquare.classList.contains('checked')) {
            let val = parseInt(bottomRightSquare.getAttribute('numAdjacentBombs'));
            if (val !== 0) {
                bottomRightSquare.innerText = val;
                changeColor(bottomRightSquare, val);
                bottomRightSquare.classList.add("checked");
                safeRemaining--;
            }
            else {
                unveil(bottomRightSquare);
            }
        }
    }  
}

//Sets the color of each number of bombs like the original game
function changeColor (square, val) {
    switch(val) {
        case 1:
            square.style.color = 'blue';
            break;
        case 2:
            square.style.color = 'green'
            break;
        case 3:
            square.style.color = 'red'
            break;
        case 4:
            square.style.color = 'darkblue'
            break;
        case 5:
            square.style.color = 'brown'
            break;
        case 6:
            square.style.color = 'teal'
            break;
        case 7:
            square.style.color = 'black'
            break;
        case 8:
            square.style.color = 'gray'
            break;
      }
}

//Ends the game and displays all bombs. 
// If the game is lost, the bombs have a red background.
// Otherwise, they have a light green background;
function endGame() {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('bomb')) {
            squares[i].innerHTML = '💣';
            if (gameWon) {
                squares[i].style.backgroundColor = "lightgreen";
            }
            else {
                squares[i].style.backgroundColor = "red";
            }
        }
    }
}

function setTime() {
  if (!gameOver) {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  }
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

playGame();

