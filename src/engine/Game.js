const RenderableSystem = require('./systems/RenderableSystem')
const Position = require('./components/Position')
const Renderable = require('./components/Renderable')
const Entity = require('./entities/Entity')

class Game {
  constructor(){
    this.systems = []
    this.entities = []
    this.components = []
    this.renderer = new PIXI.autoDetectRenderer(800,600,{
      autoResize: true
    });
    document.body.appendChild(this.renderer.view)

    // let resize = ()=>this.renderer.resize(window.innerWidth,window.innerHeight)
    // window.addEventListener('resize',resize)
    // resize()

    this.stage = new PIXI.Container();
    this.renderableSystem = new RenderableSystem(this,this.renderer)
    this.renderableSystem.setStage(this.stage)
    this.systems.push(this.renderableSystem)
    this.start()
  }
  start(){
    this.running = true
    this.loop()
  }
  addComponent(component){
    this.components.push(component)
  }  
  removeComponent(component){
    let ind = this.components.indexOf(component)
    if(ind == -1) return
    this.components.splice(ind,1)
  }
  addEntity(entity){
    this.entities.push(entity)
  }
  removeEntity(entity){
    let ind = this.entities.indexOf(entity)
    if(ind == -1) return
    this.entities.splice(ind,1) 
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
  loop(){
    if(!this.running) return
    requestAnimationFrame(()=>this.loop());
    let now = Date.now()
    let last = this.lastTick || now
    let dt = now - last
    this.update(dt)
  }
  update(dt){
    this.systems.forEach(s=>s.update(dt))
  }
  test(){
    let ent = new Entity(this)
    let g = new PIXI.Graphics()
    g.lineStyle(4,0xFF0000,1)
    g.beginFill(0,0x000000)
    g.drawRect(0,0,32,32)
    g.endFill()
    this.stage.addChild(g)
    ent.addComponent(new Renderable(g))
    ent.addComponent(new Position())
    this.entities.push(ent)
  }
  
}

module.exports = Game