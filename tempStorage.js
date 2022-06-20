// create each individual square, first by creating a div for each square,
    // then giving each square an id of its number and a value of "safe"/"bomb"
    // The square is then added to the grid and a new array.
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
            if (!squareData[idNum].flag && !gameOver && !squareData[idNum].clicked) {
                clickSquare(idNum);
            }       
        })

        //Adds an event listener for a right click, toggling a red flag on
        //and off marking a bomb;
        squares[idNum].addEventListener('contextmenu', function (e) {
            e.preventDefault();
            if (!gameOver) {
                if (!squareData.flag && !squareData.checked && bombsRemaining > 0) {
                    squareData[idNum].flag = true;
                    squaresDisplayInfo[idNum].innerHTML= '🚩';
                    bombsRemaining--;
                    bombsDisplay.innerText = bombsRemaining.toString().padStart(3, '0');   
                }
                else {
                    squareData.flag = false;
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




