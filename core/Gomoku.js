import Events from './Events'
import { createMatrix } from '../utils/createArray'

export default class Gomoku extends Events {
  constructor(playerA, playerB) {
    super()
    this.chessboard = createMatrix(15, 15)
    this.process = []
    this.players = [ playerA, playerB ]
  }
  start() {
    this.gamestart = true
    this.trigger('gamestart')
    this.process.push({ time: Date.now() })
    this.nextPlayer = this.players[0]
  }
  put(x, y, player) {
    if (this.nextPlayer !== player) {
      this.trigger('error', `It's not your turn.`)
      return
    }
    if (x < 0 || x > 14 || y < 0 || y > 14) {
      this.trigger('error', 'You can not put chess outside!')
      return
    }

    this.chessboard[x][y] = player
    let step = { x, y, player, time: Date.now() }
    this.process.push(step)
    this.trigger('gameforward', step)

    this.nextPlayer = this.players.find(item => item !== player)

    if (this.judge(player, x, y)) {
      this.end()
    }
  }
  skip(palyer) {
    let step = { player, time: Date.now() }
    this.process.push(step)
    this.trigger('gameforward', step)

    this.nextPlayer = this.players.find(item => item !== player)
  }
  judge(player, currentX, currentY) {
    let count = 0
    let chessboard = this.chessboard
    let x = currentX
    let y = currentY
    // case 1: x  --
    while (x >= 0 && chessboard[x][y] === player) {
      count ++
      x --
    }
    x = currentX + 1
    while (x < 15 && chessboard[x][y] === player) {
      count ++
      x ++
    }
    if (count >= 5) {
      return true
    }
    count = 0
    x = currentX
    // case 2: y |
    while (y >= 0 && chessboard[x][y] === player) {
      count ++
      y --
    }
    y = currentY + 1
    while (y < 15 && chessboard[x][y] === player) {
      count ++
      y ++
    }
    if (count >= 5) {
      return true
    }
    count = 0
    y = currentY
    // case 3: rise up /
    while (x >= 0 && y >= 0 && chessboard[x][y] === player) {
      count ++
      x --
      y --
    }
    x = currentX + 1
    y = currentY + 1
    while (x < 15 && y < 15 && chessboard[x][y] === player) {
      count ++
      x ++
      y ++
    }
    if (count >= 5) {
      return true
    }
    count = 0
    x = currentX
    y = currentY
    // case 4: fall down \
    while (x >= 0 && y < 15 && chessboard[x][y] === player) {
      count ++
      x --
      y ++
    }
    x = currentX + 1
    y = currentY - 1
    while (x < 15 && y >= 0 && chessboard[x][y] === player) {
      count ++
      x ++
      y --
    }
    if (count >= 5) {
      return true
    }
    return false
  }
  end() {
    this.gameover = true
    this.nextPlayer = null
    this.trigger('gameover')
    this.process.push({ time: Date.now() })
  }
  reset() {
    this.chessboard = createMatrix(15, 15)
    this.process = []
  }
}