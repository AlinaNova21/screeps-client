const System = require('./System')
class RenderableSystem extends System {
  get components(){
    return this.game.findComponents('renderable')
  }
  constructor(game,renderer){
    super(game)
    this.renderer = renderer
  }
  setStage(stage){
    this.activeStage = stage
  }
  update(dt){
    this.components.forEach(c=>c.update(dt))
    if(this.activeStage)
      this.renderer.render(this.activeStage)
  }
}
module.exports = RenderableSystem