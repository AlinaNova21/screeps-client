class Entity {
  constructor(game){
    this.game = game
    this.components = []
  }
  addComponent(component){
    this.components.push(component)
    this.game.addComponent(component)
    component.onAttach(this)    
  }  
  removeComponent(component){
    this.game.removeComponent(component)
    let ind = this.components.indexOf(component)
    if(ind == -1) return
    this.components.splice(ind,1)
    component.onDetach()
  }
  get enabled(){
    return this.components.filter(c=>c.enabled)
  }
  findComponent(type){
    return this.enabled.find(c=>c.type == type)
  }
  findComponents(type){
    return this.enabled.filter(c=>c.type == type)
  }
  update(){}
}

module.exports = Entity