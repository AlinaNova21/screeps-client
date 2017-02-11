const System = require('./System')
class RoomObjectSystem extends System {
  get components(){
    return this.game.findComponents('roomobject')
  }
  constructor(game,renderer){
    super(game)
    this.renderer = renderer
  }
  update(dt){
    this.components.forEach(c=>c.update(dt))    
  }
}
module.exports = RoomObjectSystem