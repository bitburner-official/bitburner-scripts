  const OPPONENT = "Netburners" || ns.args[0]
  const SIZE = 5 || ns.args[1]


/** @param {NS} ns */
const defendMove = (board, validMoves, liberties, ) => {

  const SIZE = board[0].length;
  
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {

      const isValidMove = validMoves[x][y] === true;

      if (isValidMove) {
        
        let north = board[x-1]?.[y] 
        let south = board[x+1]?.[y]
        let east = board[x]?.[y-1]
        let west = board[x]?.[y+1]
        let threatNorth = north == "X" && liberties[[x-1]?.[y]] == 1
        let threatSouth = south == "X" && liberties[x+1]?.[y] == 1
        let threatEast = east == "X" && liberties[x][y-1] == 1
        let threatWest = west == "X" && liberties[x][y+1] == 1

        if (threatNorth || threatSouth || threatEast || threatWest){
          let openCount = 0
          if (north == '.') {openCount+=1}
          if (south == '.') {openCount+=1}
          if (east == '.') {openCount+=1}
          if (west == '.') {openCount+=1}

          north = north == 'X' && liberties[x-1]?.[y] >= 3
          south = south == 'X' && liberties[x-1]?.[y] >= 3
          east = east == 'X' && liberties[x-1]?.[y] >= 3
          west = west == 'X' && liberties[x-1]?.[y] >= 3

          if (openCount >= 2 || north || south || east || west){
            return [x, y]

          }     
        }
      }
    }
  }

  return []
}

const captureMove = (board, validMoves, liberties) => {

  const SIZE = board[0].length;
  
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {

      const isValidMove = validMoves[x][y] === true;


      if (isValidMove) {
        
        let north = board[x-1]?.[y] == "O" && liberties[[x-1]?.[y]] == 1
        let south = board[x+1]?.[y] == "O" && liberties[x+1]?.[y] == 1
        let east = board[x][y-1] == "O" && liberties[x][y-1] == 1
        let west = board[x][y+1] == "O" && liberties[x][y+1] == 1

        if (north || south || east || west){
          return [x, y]
        }
      }
    }
  }

  return []
}

const expansionMove = (board, validMoves) => {

  const SIZE = board[0].length;
  
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {

      const isValidMove = validMoves[x][y] === true;

      const isNotReservedSpace = x % 2 === 1 || y % 2 === 1;
      



      if (isValidMove && isNotReservedSpace ) {

        let north = board[x-1]?.[y] == "X"
        let south = board[x+1]?.[y] == "X"
        let east = board[x][y-1] == "X"
        let west = board[x][y+1] == "X"

        if (north || south || east || west){

          return [x, y]
        }
      }
    }
  }

  return []
}

const randomMove = (board, validMoves) => {
  const moveOptions = [];
  const SIZE = board[0].length;


  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {

      const isValidMove = validMoves[x][y] === true;

      const isNotReservedSpace = x % 2 === 1 || y % 2 === 1;

      if (isValidMove && isNotReservedSpace) {
        moveOptions.push([x, y]);
      }
    }
  }


  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[randomIndex] ?? [];
};

/** @param {NS} ns */
export async function main(ns) {

  const reset = true
  ns.ui.openTail()
  ns.disableLog("ALL")
  let result, x, y;
  let wins = 0, losses = 0
  
  while (true){
    
    if (reset){
      ns.go.resetBoardState(OPPONENT, SIZE)
    }

    do {
      let board = ns.go.getBoardState();
      let liberties = ns.go.analysis.getLiberties()
      let validMoves = ns.go.analysis.getValidMoves();

      let moves = defendMove(board, validMoves, liberties);
      x = moves[0]
      y = moves[1]
      if (x) ns.print("Defend")


      if(x === undefined){
        moves = captureMove(board, validMoves, liberties);
        x = moves[0]
        y = moves[1]
        if (x) { 
          ns.print("Capture")
        }
      }

      if(x === undefined){
        moves = expansionMove(board, validMoves, liberties);
        x = moves[0]
        y = moves[1]
        if (x) ns.print("Expansion")
      }

      if(x === undefined){
        moves = randomMove(board, validMoves);
        x = moves[0]
        y = moves[1]
        if (x) ns.print("Random")

      }
      
      if (x === undefined) {

        ns.print("Pass")
        result = await ns.go.passTurn();
      } else {

        result = await ns.go.makeMove(x, y);
      }

      await ns.go.opponentNextTurn();

      let gameState = ns.go.getGameState()
      if (result?.type == "pass" && gameState.blackScore > gameState.whiteScore)
        result = await ns.go.passTurn();


    } while (result?.type !== "gameOver");
    
    let gameState = ns.go.getGameState()
    if (gameState.blackScore > gameState.whiteScore){
      ns.print("You won!")
      wins +=1
      ns.print("Wins: " + wins)
      ns.print("Losses: " + losses)
      ns.print("--------------------------------")
    }
    else if (gameState.blackScore < gameState.whiteScore){
      ns.print("You lost.")
      losses += 1
      ns.print("Wins: " + wins)
      ns.print("Losses: " + losses)
      ns.print("--------------------------------")
    }
    else{
      ns.print("You tied")
    
    }
    
  }

}
