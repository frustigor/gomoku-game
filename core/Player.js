export default class Player {
  constructor({ name }) {
    this.name = name
    this.put = () => {}
    this.stopThinking = () => {}
  }
  think() {
    return new Promise((resovle, reject) => {
      this.put = resovle
      this.stopThinking = reject
    })
  }
}