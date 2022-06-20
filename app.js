let width = 10; //**Preset: Original dimension of the board **
let numSquares = width ** 2;
let numBombs = 20; //**Preset: Number of Bombs **/
let safeRemaining = numSquares - numBombs;
let bombsRemaining = numBombs; //decreases as users place flags marking bombs
let gameOver = false;
let grid = document.querySelector('.grid');

const squareData = []; // Holds the backend information of each square including whether it's a bomb or
//not, whether the contents have been unveiled, whether a flag as been added, and # of adjacent bombs
const squaresDisplayInfo = []; //Holds the front-end information of each square (innerText, color, etc)

let bombsDisplay = document.querySelector("#numBombs") //The top left display showing # of remaining bombs
const smiley = document.querySelector('.smiley'); //Controls the midle smiley face
let minutesLabel = document.querySelector("#minutes"); //Controls the clock at the top right
let secondsLabel = document.querySelector("#seconds");

const colors = ['blue', 'green', 'red', 'darkblue', 'brown', 'teal', 'black', 'gray']; // Number colors
const offsets = [-11, -10, -9, -1, 1, 9, 10, 11]; //offsets used for finding neighboring squares
let totalSeconds = 0;
setInterval(setTime, 1000); //ongoing timer in the upper right

function playGame() {
    /* squareData represents which squares on the grid will contain a bomb.
    Squares that contain "safe" are safe squares, and squares with "bomb"
    are bombs*/
    //fills the entire array with "safe"; 
    for (let i = 0; i < numSquares; i++) {
        let newSquare = {
            status: 'safe', //stores either 'safe' or 'bomb'
            checked: false, //whether the contents of the square have been unveiled
            hasFlag: false, //whether the user has placed a flag on that square
            adjBombs: 0, //the number of adjacent neighborings that contain a bomb
        };
        squareData.push(newSquare);
    }
    addBombs(squareData, numBombs); //replaces a pre-specified number of squares with bombs
}

//function that decides the locations of the bombs for the starting gameboard.
function addBombs(squareData, numBombs) {
    let bombCount = numBombs;
    while(bombCount > 0) {   
        let randomCell = Math.floor(Math.random() * 100);
        if (squareData[randomCell].status !== 'bomb') {
            squareData[randomCell].status = 'bomb';
            bombCount--;
        }
    }    
    // create each individual square, first by creating a div for each square,
    // Then added the square to the frontend array.
    for (let i = 0; i < numSquares; i++) {
        let square = document.createElement('div');
        square.classList.add('gridSquare');
        grid.appendChild(square);
        squaresDisplayInfo.push(square);
    }

    //calcuates the number of neighboring bombs and sets that number as
    //an attribute of each square;
    for (let idNum = 0; idNum < numSquares; idNum++) {     
        if (squareData[idNum].status !== 'bomb') {
            squareData[idNum].adjBombs = findAdjacentBombs(idNum);
        }

        //adds an event listener on each square for a left click
        //revealing what value is under that square;
        squaresDisplayInfo[idNum].addEventListener('click', function (e) {
            if (!squareData[idNum].flag && !gameOver && !squareData[idNum].checked) {
                clickSquare(idNum);
            }       
        })

        //Adds an event listener for a right click, toggling a red flag on
        //and off marking a bomb;
        squaresDisplayInfo[idNum].addEventListener('contextmenu', function (e) {
            e.preventDefault(); //prevents the typical right click window from opening
            if (!gameOver) {
                if (!squareData[idNum].flag && !squareData.checked && bombsRemaining > 0) {
                    squareData[idNum].flag = true;
                    squaresDisplayInfo[idNum].innerHTML= '🚩';
                    bombsRemaining--;
                    bombsDisplay.innerText = bombsRemaining.toString().padStart(3, '0');   
                }
                else if (squareData[idNum].flag) {
                    squareData[idNum].flag = false;
                    squaresDisplayInfo[idNum].innerHTML = "";
                    bombsRemaining++;
                    bombsDisplay.innerText = bombsRemaining.toString().padStart(3, '0');
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
    bombsDisplay.innerText = bombsRemaining.toString().padStart(3, '0');
    // document.getElementById("numSafe").innerText = safeRemaining;
    console.log("squareData3", squareData);        
}

//Function that returns the number of bombs surrounding a particular square
function findAdjacentBombs(idNum) {
    let surroundingBombs = 0;
    
    for (let i = 0; i < 8; i++) {
        let neighborIdNum = idNum + offsets[i];
        if (isAdjacent(idNum, neighborIdNum) && squareData[neighborIdNum].status === 'bomb') {
            surroundingBombs++;
        }
    }
    return surroundingBombs;
}

//Returns whether the square with IdNum is adjacent to the neighborIdNum, which assists
//in figuring out the number of adjacent bombs to a square, and also helps with the recursive
// component of opening all squares adjacent to a square with 0 neighboring bombs.
function isAdjacent(idNum, neighborIdNum) {

    //The clicked square is at the top or bottom row of the grid
    if (neighborIdNum < 0 || neighborIdNum >= numSquares) {
        return false;
    }

    //The clicked square is on the left side of the grid
    else if (idNum % 10 === 0 && neighborIdNum % 10 === 9) {
        return false;
    }

    //The clicked square is on the right side of the grid
    else if (idNum % 10 === 9 && neighborIdNum % 10 === 0) {
        return false;
    }
    return true;
}

//Dictates what happens when a square is clicked
function clickSquare(idNum) {
    squareData[idNum].checked = true;
    squaresDisplayInfo[idNum].classList.add('checked'); //For CSS styles to be applied
    smiley.innerHTML = '😮'; //updates the smiley face
    if(squareData[idNum].status === 'bomb') {
        setTimeout(function() { 
            //the time delay helps with the aesthetics of the program
            smiley.innerHTML = '💀';}, 100);     
            gameOver = true;
            endGame(false); //"false" indicates that the user lost
            
    }
    else {
        safeRemaining--;
        let bombs = squareData[idNum].adjBombs;    
        if (bombs !== 0) {
            squaresDisplayInfo[idNum].innerText = bombs; //displays the number of adjacent bombs
            squaresDisplayInfo[idNum].style.color = colors[bombs-1] //-1 because the array is 0 indexed
        }
        else {
        //In the event that a square has no adjacent bombs, all adjacent squares around it are
        //automatically opened. If an adjacent square also has no adjacent bombs, that square will
        //be recursively opened as well.
            for (let i = 0; i < 8; i++) {
                let neighborIdNum = idNum + offsets[i];
                if (isAdjacent(idNum, neighborIdNum) && !squareData[neighborIdNum].checked) {
                    clickSquare(neighborIdNum)
                }
            }
        }
    }
    // document.getElementById("numSafe").innerText = safeRemaining;
    if (safeRemaining === 0) {
        setTimeout(function() { 
            //the time delay helps with the aesthetics of the program
            smiley.innerHTML = '😎';}, 100);      
            gameOver = true;
            endGame(true);
    }
    
    if (!gameOver) {
        setTimeout(function() {
            smiley.innerHTML = '🙂';}, 100);  
    }
}

//Ends the game and displays all bombs. 
// If the game is lost, the bombs have a red background.
// Otherwise, they have a light green background;
function endGame(gameWon) {
    for (let i = 0; i < squareData.length; i++) {
        if (squareData[i].status === 'bomb') {
            squaresDisplayInfo[i].innerHTML = '💣';
            gameWon ? squaresDisplayInfo[i].style.backgroundColor = "lightgreen" : squaresDisplayInfo[i].style.backgroundColor = "red";
        }
    }
}

//Controls the timer at the top right. It updates the clock numbers and pads the front with zeroes
function setTime() {
  if (!gameOver) {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  }
}

//Helper function to setTime
function pad(val) {
  let valString = val.toString();
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

playGame();