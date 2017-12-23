import { createArray, createMatrix } from '../utils/createArray'

export default class Robot {
  constructor() {
    this.name = 'robot'
    this.calculateWinWays()
  }
  calculateWinWays() {
    let winWays = []
    let count = 0

    // horizontal line
    for (let x = 0; x < 11; x ++) {
      for (let y = 0; y < 15; y ++) {
        winWays[count] = createMatrix(15, 15)
        for (let z = 0; z < 5; z ++) {
          winWays[count][x + z][y] = true
        }
        count ++
      }
    }

    // vertical line
    for (let x = 0; x < 15; x ++) {
      for (let y = 0; y < 11; y ++) {
        winWays[count] = createMatrix(15, 15)
        for (let z = 0; z < 5; z ++) {
          winWays[count][x][y + z] = true
        }
        count ++
      }
    }

    // rise up
    for (let x = 0; x < 11; x ++) {
      for (let y = 0; y < 11; y ++) {
        winWays[count] = createMatrix(15, 15)
        for (let z = 0; z < 5; z ++) {
          winWays[count][x + z][y + z] = true
        }
        count ++
      }
    }

    // fall down
    for (let x = 0; x < 11; x ++) {
      for (let y = 14; y > 3; y --) {
        winWays[count] = createMatrix(15, 15)
        for (let z = 0; z < 5; z ++) {
          winWays[count][x + z][y - z] = true
        }
        count ++
      }
    }

    this.winWays = winWays
    this.winWaysCount = count
  }
  think(chessboard) {
    return new Promise(resolve => {
      let toX = 0
      let toY = 0
      
      let winWays = this.winWays
      let winWaysCount = this.winWaysCount
      
      let playerWinScore = createArray(winWaysCount, 0)
      let robotWinScore = createArray(winWaysCount, 0)

      let playerPutScore = createMatrix(15, 15, 0)
      let robotPutScore = createMatrix(15, 15, 0)
      
      let max = 0
      let isFirstStep =  true
      
      // calculate current score for palyer and robot of each win way
      for (let x = 0; x < 15; x++) {
        for (let y = 0; y < 15; y++) {
          for (let way = 0; way < winWaysCount; way ++) {
            if (winWays[way][x][y]) {
              if (chessboard[x][y] === this) {
                robotWinScore[way] ++
                isFirstStep = false
              }
              else if (chessboard[x][y] !== undefined) {
                playerWinScore[way] ++
                isFirstStep = false
              }
            }
          }
        }
      }
      
      if (isFirstStep) {
        return resolve({ x: 7, y: 7 })
      }

      // calculate next step score for player and robot
      for (let x = 0; x < 15; x++) {
        for (let y = 0; y < 15; y++) {
          // there is no chess here
          if (chessboard[x][y] === undefined) {
            // calculate score
            for (let way = 0; way < winWaysCount; way++) {
              if (winWays[way][x][y]) {
                // calculate score if player next step put chess at [i][j] 
                if (playerWinScore[way] == 1) {
                  playerPutScore[x][y] += 200
                } 
                else if (playerWinScore[way] == 2) {
                  playerPutScore[x][y] += 400
                } 
                else if (playerWinScore[way] == 3) {
                  playerPutScore[x][y] += 2000
                } 
                else if (playerWinScore[way] == 4) {
                  playerPutScore[x][y] += 10000
                }
                // calculate score if robot next step put chess at [i][j] 
                if (robotWinScore[way] == 1) {
                  robotPutScore[x][y] += 220
                } 
                else if (robotWinScore[way] == 2) {
                  robotPutScore[x][y] += 420
                } 
                else if (robotWinScore[way] == 3) {
                  robotPutScore[x][y] += 2100
                } 
                else if (robotWinScore[way] == 4) {
                  robotPutScore[x][y] += 20000
                }
              }
            }
            // determine use which to defeat player
            if (playerPutScore[x][y] > max) {
              max = playerPutScore[x][y]
              toX = x
              toY = y
            } 
            else if (playerPutScore[x][y] === max) {
              if (robotPutScore[x][y] > robotPutScore[toX][toY]) {
                toX = x
                toY = y
              }
            }
            // determine use which to let robot win
            if (robotPutScore[x][y] > max) {
              max  = robotPutScore[x][y]
              toX = x 
              toY = y 
            } 
            else if (robotPutScore[x][y] == max) {
              if (playerPutScore[x][y] > playerPutScore[toX][toY]) {
                toX = x 
                toY = y 
              }
            }
          }
        }
      }

      resolve({ x: toX, y: toY })
    })
  }
}