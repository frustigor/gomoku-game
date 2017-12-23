import Events from './core/Events'
import Gomoku from './core/Gomoku'
import Robot from './core/Robot'
import Player from './core/Player'
import Canvas from './ui/Canvas'

export default class GomokuGame extends Events {
  constructor() {
    super()
    this.canvas = new Canvas()
    this.robot = new Robot()
    this.winner = null
    this.regretedProcess = null
  }
  mount(selector) {
    let container = document.querySelector(selector)
    container.innerHTML = ''
    container.appendChild(this.canvas.dom)
  }
  createPlayer(name) {
    this.player = new Player({ name })
    // when user click on canvas, it means he/she want to put chess here
    this.canvas.handle((x, y) => {
      this.player.put({ x, y })
    })
    this.canvas.on('error', (e, args) => {
      this.trigger('error', args, e)
    })
  }
  pickSide(firstHand) {
    let players = [ this.robot ]
    if (firstHand) {
      players.unshift(this.player)
    }
    else {
      players.push(this.player)
    }
    this.gomoku = new Gomoku(...players)
    this.gomoku.on('error', (e, args) => {
      this.trigger('error', args, e)
    })
  }
  start() {
    this.gomoku.start()
    this.trigger('gamestart')
    this.process()
  }
  process() {
    let player = this.gomoku.nextPlayer
    let chessboard = this.gomoku.chessboard
    player.think(chessboard).then(({ x, y }) => {
      this.regretedProcess = null // can not undo regret any more
      this.gomoku.put(x, y, player)
      let isBlack = player === this.gomoku.players[0]
      this.canvas.draw(x, y, isBlack)

      if (this.gomoku.gameover) {
        this.winner = player
        this.end()
      }
      else {
        this.trigger('gameforward', { x, y, player })
        this.process()
      }
    })
  }
  end() {
    this.trigger('gameover', this.winner === this.player)
  }
  regret() {
    if (this.gomoku.nextPlayer !== this.player) {
      this.trigger('error', 'It is not your turn, you can not regret now.')
      return
    }

    let process = this.gomoku.process

    if (process.length < 4) {
      this.trigger('error', 'There is no need to regret.')
      return
    }

    let passedStep1 = process[process.length - 1]
    let passedStep2 = process[process.length - 2]
    let back = ({ x, y }) => {
      this.gomoku.chessboard[x][y] = undefined
      this.canvas.remove(x, y)
    }

    this.player.stopThinking()
    back(passedStep1)
    back(passedStep2)
    this.gomoku.process = process.filter(item => item !== passedStep1 && item !== passedStep2)
    this.regretedProcess = process
    this.process()
  }
  redo() {
    if (this.gomoku.nextPlayer !== this.player) {
      this.trigger('error', 'It is not your turn, you can not undo regret now.')
      return
    }
    if (!this.regretedProcess) {
      this.trigger('error', 'There is no recovery.')
      return
    }

    let player = this.player
    let process = this.regretedProcess
    let passedStep1 = process[process.length - 1]
    let passedStep2 = process[process.length - 2]
    let go = ({ x, y, player }) => {
      this.gomoku.chessboard[x][y] = player
      let isBlack = player === this.gomoku.players[0]
      this.canvas.draw(x, y, isBlack)
    }

    player.stopThinking()
    go(passedStep1)
    go(passedStep2)
    this.gomoku.process = process
    this.regretedProcess = null
    this.process()
  }
  restart() {
    if (this.player) {
      this.player.stopThinking()
    }
    this.canvas.clean()
    this.gomoku.reset()
  }
}