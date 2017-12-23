import './index.scss'
import GomokuGame from './GomokuGame'

const game = new GomokuGame
const bind = (el, event, callback) => {
  el.addEventListener(event, callback)
}
const show = (el) => {
  el.className = el.className.replace(/\shidden/g, '')
}
const hide = (el) => {
  el.className += ' hidden'
}
const $ = (selector) => {
  let el = document.querySelector(selector)
  el.on = (event, callback) => {
    bind(el, event, callback)
  }
  el.show = () => {
    show(el)
  }
  el.hide = () => {
    hide(el)
  }
  return el
}
const notify = (msg) => {
  $('#message-text').innerHTML = msg
  $('#message').show()
}

game.mount('#game')

$('#message-close').on('click', e => {
  $('#message').hide()
})

$('#createPlayer button').on('click', e => {
  let name = $('#createPlayer input').value
  if (!name.trim()) {
    return
  }
  game.createPlayer(name)
  $('#createPlayer').hide()
  $('#firstHand').show()
})

$('#yes').on('click', e => {
  game.pickSide(true)
  $('#firstHand').hide()
  game.start()
})

$('#no').on('click', e => {
  game.pickSide(false)
  $('#firstHand').hide()
  game.start()
})

$('#regret').on('click', e => {
  game.regret()
})
$('#redo').on('click', e => {
  game.redo()
})

game.on('gamestart', () => {
  $('#restart').disabled = false
})

game.on('gameover', (e, args) => {
  if (args) {
    notify('You win!')
  }
  else {
    notify('You fail!')
  }
})
game.on('error', (e, args) => {
  notify(args)
})

$('#restart').on('click', e => {
  game.restart()
  $('#firstHand').show()
})