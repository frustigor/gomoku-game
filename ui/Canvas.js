import './Canvas.scss'
import Events from '../core/Events'

export default class Canvas extends Events {
  constructor() {
    super()
    this.callback = () => {}
    this.createDOM()
  }
  createDOM() {
    let createLattice = (x, y, className) => {
      let el = document.createElement('div')
      el.className = 'lattice' + (className ? ' ' + className : '')
      el.innerHTML = `
        <div class="particle left-top"></div>
        <div class="particle right-bottom"></div>
      `
      el.addEventListener('click', e => {
        this.callback(x, y)
      })
      return el
    }
    let createPoint = () => {
      let el = document.createElement('div')
      el.className = 'point'
      return el
    }

    let grid = document.createElement('div')
    grid.className = 'gomoku-game-canvas'

    for (let x = 0; x < 15; x ++) {
      for (let y = 0; y < 15; y ++) {
        let classNames = []
        if (x === 0) {
          classNames.push('top')
        }
        else if (x === 14) {
          classNames.push('bottom')
        }
        if (y === 0) {
          classNames.push('left')
        }
        else if (y === 14) {
          classNames.push('right')
        }
        let lattice = createLattice(x, y, classNames.join(' '))
        grid.appendChild(lattice)
        if (
          (x === 3 && y === 3)
          || (x === 3 && y === 7)
          || (x === 3 && y === 11)
          || (x === 7 && y === 3)
          || (x === 7 && y === 7)
          || (x === 7 && y === 11)
          || (x === 11 && y === 3)
          || (x === 11 && y === 7)
          || (x === 11 && y === 11)
        ) {
          let point = createPoint()
          lattice.appendChild(point)
        }
      }
    }

    this.dom = grid
  }
  handle(callback) {
    this.callback = callback
  }
  draw(x, y, isBlack) {
    let lattice = this.dom.children[15*x + y]
    if (lattice.querySelector('.chess')) {
      this.trigger('error', 'You can not put chess here, chess exists.')
      return
    }
    let chess = document.createElement('div')
    chess.className = 'chess' + (isBlack ? ' black' : ' white')
    lattice.appendChild(chess)
  }
  remove(x, y) {
    let lattice = this.dom.children[15*x + y]
    let chess = lattice.querySelector('.chess')
    lattice.removeChild(chess)
  }
  clean() {
    let chesses = this.dom.querySelectorAll('.chess')
    chesses.forEach(el => {
      el.parentNode.removeChild(el)
    })
  }
}