

/* Constants Declaration */
const MODE_IA_VS_IA = 0;
const MODE_PLAYER_VS_IA = 1;
const MODE_PLAYER_VS_PLAYER = 2;

const playerVSPlayerMessages = {

    "Player_1": {

        "symbol": "X",
        "color": "aqua",
        "nextPlayer": "Player_2"

    },

    "Player_2": {

        "symbol": "O",
        "color": "greenyellow",
        "nextPlayer": "Player_1"

    }

}

/* Global Declarations */
var cellsContent = [];
var cellsHoverActivated = [];

var firstPlayerScore = 0;
var secondPlayerScore = 0;

var currentNumericGameMode = 0;

var playerVSPlayerCurrentPlayer = "";

/* Main Execution */
$(function (){

    // Init cells hover activated
    for(let i = 0; i < 9; i++)
        cellsHoverActivated[i] = true;

    // Hide the screens
    $(".game").hide();

    // Event Handlers
    $("#homeContinueButton").click(function () {

        let playersNumber = $("#playersNumberSelect :selected").val();
        playersNumber = parseInt(playersNumber);
        $(".home").hide();
        selectGameMode(playersNumber);

    });

    $(".game-board-cell").click(function (event) {

        let cellID = event.target.getAttribute("id");
        cellID = parseInt(cellID);

        if(cellsHoverActivated[cellID]){

            if (currentNumericGameMode == MODE_PLAYER_VS_IA){

                let victory = false;
                let gameboardFull = false;

                makeMove(cellID, "X");

                // Check Player victory
                victory = checkVictory("X");
                if(victory){

                    deactivateCellsHover();

                    $("#gameResultsText").text("Ganador: Player_1 [X]");
                    $("#gameResultsText").css({"color": "aqua"});
                    firstPlayerScore++;
                    $("#scoreboardFirstPlayerScore").text("Player_1 [X]: " + firstPlayerScore);

                    $(".game-results").show();
                    $(".game-end-buttons").show();

                    $("#gameScreenText").text("Juego finalizado, compruebe resultados...");
                    $("#gameScreenText").css({"color": "orange"});

                }
                
                // Check board is full
                gameboardFull = checkGameboardIsFull();
                if(gameboardFull){

                    $("#gameResultsText").text("Ganador: EMPATE");
                    $("#gameResultsText").css({"color": "orange"});

                    $(".game-results").show();
                    $(".game-end-buttons").show();

                    $("#gameScreenText").text("Juego finalizado, compruebe resultados...");
                    $("#gameScreenText").css({"color": "orange"});

                }

                if(!victory && !gameboardFull){

                    $("#gameScreenText").text("Es el turno de IA_1 [X]");
                    $("#gameScreenText").css({"color": "greenyellow"});
                    makeMove(getRandomFreeCell(), 'O');

                    victory = checkVictory("O");
                    if(victory){

                        deactivateCellsHover();

                        $("#gameResultsText").text("Ganador: IA_1 [X]");
                        $("#gameResultsText").css({"color": "greenyellow"});
                        secondPlayerScore++;
                        $("#scoreboardSecondPlayerScore").text("IA_1 [O]: " + secondPlayerScore);

                        $(".game-results").show();
                        $(".game-end-buttons").show();

                        $("#gameScreenText").text("Juego finalizado, compruebe resultados...");
                        $("#gameScreenText").css({"color": "orange"});

                    }
                    
                    gameboardFull = checkGameboardIsFull();
                    if(gameboardFull){

                        $("#gameResultsText").text("Ganador: EMPATE");
                        $("#gameResultsText").css({"color": "orange"});
    
                        $(".game-results").show();
                        $(".game-end-buttons").show();

                        $("#gameScreenText").text("Juego finalizado, compruebe resultados...");
                        $("#gameScreenText").css({"color": "orange"});
    
                    }

                    if(!victory && !gameboardFull){

                        $("#gameScreenText").text("Es el turno de Player_1 [X]");
                        $("#gameScreenText").css({"color": "aqua"});

                    }

                }

            }

            if (currentNumericGameMode == MODE_PLAYER_VS_PLAYER ){

                let victory = false;
                let gameboardFull = false;

                let symbol = playerVSPlayerMessages[playerVSPlayerCurrentPlayer]["symbol"];
                let color = playerVSPlayerMessages[playerVSPlayerCurrentPlayer]["color"];
                let playerName = playerVSPlayerCurrentPlayer + " [" + symbol + "]";

                makeMove(cellID, symbol);

                // Check Player victory
                victory = checkVictory(symbol);
                if(victory){

                    deactivateCellsHover();

                    $("#gameResultsText").text("Ganador: " + playerName);
                    $("#gameResultsText").css({"color": color});
                    
                    if(symbol == "X"){

                        firstPlayerScore++;
                        $("#scoreboardFirstPlayerScore").text("Player_1 [X]: " + firstPlayerScore);

                    }
                    else{

                        secondPlayerScore++;
                        $("#scoreboardSecondPlayerScore").text("Player_2 [O]: " + secondPlayerScore);

                    }

                    $(".game-results").show();
                    $(".game-end-buttons").show();

                    $("#gameScreenText").text("Juego finalizado, compruebe resultados...");
                    $("#gameScreenText").css({"color": "orange"});

                }
                
                // Check board is full
                gameboardFull = checkGameboardIsFull();
                if(gameboardFull && !victory){

                    $("#gameResultsText").text("Ganador: EMPATE");
                    $("#gameResultsText").css({"color": "orange"});

                    $(".game-results").show();
                    $(".game-end-buttons").show();

                    $("#gameScreenText").text("Juego finalizado, compruebe resultados...");
                    $("#gameScreenText").css({"color": "orange"});

                }

                if(!victory && !gameboardFull){

                    playerVSPlayerCurrentPlayer = playerVSPlayerMessages[playerVSPlayerCurrentPlayer]["nextPlayer"];
                    symbol = playerVSPlayerMessages[playerVSPlayerCurrentPlayer]["symbol"];
                    color = playerVSPlayerMessages[playerVSPlayerCurrentPlayer]["color"];
                    playerName = playerVSPlayerCurrentPlayer + " [" + symbol + "]";

                    $("#gameScreenText").text("Es el turno de " + playerName);
                    $("#gameScreenText").css({"color": color});

                }

            }

        }

    });

    $("#nextGameButton").click(function () {

        selectGameMode(currentNumericGameMode);

    });

    $("#restartGameButton").click(function () {

        window.location.reload();

    });

});

/* Functions Code */
function selectGameMode(playersNumber){

    switch(playersNumber){

        case MODE_IA_VS_IA:
            startGameIAVSIA();
            break;
        
        case MODE_PLAYER_VS_IA:
            startGamePlayerVSIA();
            break;
        
        case MODE_PLAYER_VS_PLAYER:
            startGamePlayerVSPlayer();
            break;

    }

}

function startGameIAVSIA(){

    currentNumericGameMode = MODE_IA_VS_IA;

    // Hide results and end buttons
    $(".game-results").hide();
    $(".game-end-buttons").hide();

    // Text initialization
    $("#scoreboardFirstPlayerScore").text("IA_1 [X]: " + firstPlayerScore);
    $("#scoreboardSecondPlayerScore").text("IA_2 [O]: " + secondPlayerScore);

    $("#gameScreenTitle").text("Tres en Raya (IA VS IA)");

    // Initialize game cells
    initGameCells();
    deactivateCellsHover();

    // Make choices
    IAVSIAGameLoop();

    // Show all
    $(".game").show();

}

function startGamePlayerVSIA(){

    currentNumericGameMode = MODE_PLAYER_VS_IA;

    // Hide results and end buttons
    $(".game-results").hide();
    $(".game-end-buttons").hide();

    // Text initialization
    $("#scoreboardFirstPlayerScore").text("Player_1 [X]: " + firstPlayerScore);
    $("#scoreboardSecondPlayerScore").text("IA_1 [O]: " + secondPlayerScore);

    $("#gameScreenTitle").text("Tres en Raya (Player VS IA)");

    $("#gameScreenText").text("Es el turno de Player_1 [X]");
    $("#gameScreenText").css({"color": "aqua"});

    // Init game cells
    initGameCells();

    // Show screen
    $(".game").show();

}

function startGamePlayerVSPlayer(){

    currentNumericGameMode = MODE_PLAYER_VS_PLAYER;

    // Hide results and end buttons
    $(".game-results").hide();
    $(".game-end-buttons").hide();

    // Text initialization
    $("#scoreboardFirstPlayerScore").text("Player_1 [X]: " + firstPlayerScore);
    $("#scoreboardSecondPlayerScore").text("Player_2 [O]: " + secondPlayerScore);

    $("#gameScreenTitle").text("Tres en Raya (Player VS Player)");

    $("#gameScreenText").text("Es el turno de Player_1 [X]");
    $("#gameScreenText").css({"color": "aqua"});

    // Initialize game cells
    initGameCells();

    // Init players turns
    playerVSPlayerCurrentPlayer = "Player_1";

    // Show all
    $(".game").show();

}

function initGameCells(){

    cellsContent = [];

    for(let i = 0; i < 9; i++){

        cellsContent.push(" ");
        $("#" + i).text("");
        activateCellHover(i);

    }

}

function activateCellsHover(){

    for(let i = 0; i < 9; i++)
        activateCellHover(i);

}

function activateCellHover(cell){

    if(!cellsHoverActivated[cell]){

        $("#" + cell).toggleClass("game-board-cell-hover");
        cellsHoverActivated[cell] = true;

    }

}

function deactivateCellsHover(){

    for(let i = 0; i < 9; i++)
        deactivateCellHover(i);

}

function deactivateCellHover(cell){

    if(cellsHoverActivated[cell]){

        $("#" + cell).toggleClass("game-board-cell-hover");
        cellsHoverActivated[cell] = false;

    }

}

function getRandomFreeCell(){

    let random = 0;

    do{

        random = Math.floor(Math.random() * cellsContent.length);

    }while(!checkCellIsFree(random));

    return random;

}

function checkCellIsFree(cell){

    return cellsContent[cell] == " ";

}

function makeMove(cell, symbol){

    cellsContent[cell] = symbol;
    $("#" + cell).text(symbol);
    deactivateCellHover(cell);

}

function checkGameboardIsFull(){

    for(let i = 0; i < 9; i++)
        if(cellsContent[i] == " ")
            return false;
    
    return true;

}

function checkVictory(symbol){

    // Check vertical wins
    for(let i = 0; i < 3; i++)
        if(cellsContent[i] == symbol && cellsContent[i + 3] == symbol && cellsContent[i + 6] == symbol)
            return true;
    
    // Check horizontal wins
    for(let i = 0; i < 3; i++)
        if(cellsContent[i*3] == symbol && cellsContent[i*3 + 1] == symbol && cellsContent[i*3 + 2] == symbol)
            return true;
    
    // Check diagonal wins
    // ->
    if(cellsContent[0] == symbol && cellsContent[4] == symbol && cellsContent[8] == symbol)
        return true;
    
    // <-
    if(cellsContent[2] == symbol && cellsContent[4] == symbol && cellsContent[6] == symbol)
        return true;
    
    return false;

}

function IAVSIAGameLoop(){

    // Needed variables
    let victory = false;
    let gameboardFull = false;
    let winner = " ";

    do{

        // Make X random move
        $("#gameScreenText").text("Es el turno de IA_1 [X]");
        $("#gameScreenText").css({"color": "aqua"});
        makeMove(getRandomFreeCell(), "X");

        // Check X victory
        victory = checkVictory("X");
        if(victory)
            winner = "X";
        
        // Check board is full
        gameboardFull = checkGameboardIsFull();

        // If we dont have win or full board we make the same with O
        if(!victory && !gameboardFull){

            $("#gameScreenText").text("Es el turno de IA_2 [X]");
            $("#gameScreenText").css({"color": "greenyellow"});
            makeMove(getRandomFreeCell(), 'O');

            victory = checkVictory("O");
            if(victory)
                winner = "O"
            
            gameboardFull = checkGameboardIsFull();

        }

    }while(!victory && !gameboardFull);

    $("#gameScreenText").text("Juego finalizado, compruebe resultados...");
    $("#gameScreenText").css({"color": "orange"});

    if(victory && winner == "X"){

        $("#gameResultsText").text("Ganador: IA_1 [X]");
        $("#gameResultsText").css({"color": "aqua"});
        firstPlayerScore++;
        $("#scoreboardFirstPlayerScore").text("IA_1 [X]: " + firstPlayerScore);

    }
    
    if(victory && winner == "O"){

        $("#gameResultsText").text("Ganador: IA_2 [O]");
        $("#gameResultsText").css({"color": "greenyellow"});
        secondPlayerScore++;
        $("#scoreboardSecondPlayerScore").text("IA_2 [O]: " + secondPlayerScore);

    }

    if(!victory){

        $("#gameResultsText").text("Ganador: EMPATE");
        $("#gameResultsText").css({"color": "orange"});

    }
    
    $(".game-results").show();
    $(".game-end-buttons").show();

}