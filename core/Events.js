/**
 * @desc wrap e object with isPropagationStopped and isImmediatePropagationStopped
 * @param {object} e 
 * @return {object} e
 */
function EventData(e) {
  let isPropagationStopped = false
  let isImmediatePropagationStopped = false
  let scope = e || this || {}

  scope.stopPropagation = function() {
    if (e && e.stopPropagation) {
      e.stopPropagation.call(e)
    }
    isPropagationStopped = true
  }

  scope.isPropagationStopped = function() {
    return isPropagationStopped
  }

  scope.stopImmediatePropagation = function() {
    if (e && e.stopImmediatePropagation) {
      e.stopImmediatePropagation.call(e)
    }
    isImmediatePropagationStopped = true
  };

  scope.isImmediatePropagationStopped = function() {
    return isImmediatePropagationStopped
  }

  return scope
}

export default class Events {
  constructor() {
    this.handlers = []
  }
  on(event, handler, priority = 10) {
    this.handlers.push({
      event,
      handler,
      priority,
    })
    return this
  }
  off(event, handler) {
    // remove all subscribes
    if (event === undefined) {
      this.handlers = []
      return this
    }

    this.handlers = this.handlers.filter(hdl => {
      if (hdl.event === event && (hdl.handler === handler || handler === undefined)) {
        return false
      }
      else {
        return true
      }
    })

    return this
  }
  trigger(event, args, e, scope) {
    let hdls = this.handlers.filter(hdl => hdl.event === event)

    if (!hdls.length) {
      return
    }

    e = new EventData(e)
    scope = scope || this
    
    hdls.sort((a, b) => {
      if (a.priority > b.priority) {
        return -1
      }
      else if (a.priority < b.priority) {
        return 1
      }
      else {
        return 0
      }
    })
    
    let result
    hdls.forEach(hdl => {
      if (e.isPropagationStopped() || e.isImmediatePropagationStopped()) {
        return
      }
      result = hdl.handler.call(scope, e, args)
    })

    return result
  }
}