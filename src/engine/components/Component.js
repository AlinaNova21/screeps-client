class Component {
  constructor(){
    this.type = this.constructor.name.toLowerCase()
    this.enabled = true
  }
  attachTo(entity){
    entity.addComponent(this)
  }
  detach(){
    this.entity.removeComponent(this)
  }
  onAttach(entity){
    this.entity = entity
  }
  onDetach(){
    this.entity = null
  }
  update(){}
}

module.exports = Component