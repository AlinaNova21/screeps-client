class System {
  constructor(game){
    this.game = game
    this.type = 'System'
  }
  update(dt){
    this.components.forEach(c=>c.update(dt))
  }
}

module.exports = System