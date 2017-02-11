const Position = require('./engine/components/Position')
const Renderable = require('./engine/components/Renderable')
const RoomObject = require('./engine/components/RoomObject')
const Entity = require('./engine/entities/Entity')
const ScreepsRenderer = require('./ScreepsRenderer')

const TILE_SIZE = 32

class RoomObjectManager {
  constructor(game){
    this.renderer = new ScreepsRenderer()
    this.roomObjects = {}
    this.game = game
    this.cont = new PIXI.Container()
    this.cont.position.x = 0
    this.cont.position.y = 0
    game.stage.addChild(this.cont)
  }
  resize(w,h){
    this.cont.width = w
    this.cont.height = h
  }
  createObject(id,obj){
    if(this.roomObjects[id]) 
      return this.updateObject(id,obj)
    let ent = new Entity(this.game)
    let texture = this.renderer.getTexture(obj)
    let g = new PIXI.Sprite(texture)
    this.cont.addChild(g)
    let ro = new RoomObject({ obj })
    ent.addComponent(ro)
    ent.addComponent(new Renderable(g))
    ent.addComponent(new Position())
    this.game.addEntity(ent)
    this.roomObjects[id] = {id,ent,ro,g}
  }
  destroyObject(id){
    let obj = this.roomObjects[id]
    if(!obj) return
    delete this.roomObjects[id]
    this.cont.removeChild(obj.g)
    this.game.removeEntity(obj.ent)
  }
  updateObject(id,data){
    let obj = this.roomObjects[id]
    if(!obj) return
    Object.assign(obj.ro.obj,data)
    let texture = this.renderer.getTexture(obj.ro.obj)
    if(texture && texture != obj.g.texture)
      obj.g.setTexture(texture)
  }
  destroyAll(){
    let keys = Object.keys(this.roomObjects)
    keys.forEach(key=>this.destroyObject(key))
  }
  setTerrain(data){
    this.destroyObject('terrain')
    let ent = new Entity(game)
    let g = new PIXI.Sprite(this.createTerrainTexture(data))
    g.anchor.x = 0
    g.anchor.y = 0
    this.cont.addChildAt(g,0)
    ent.addComponent(new Renderable(g))
    ent.addComponent(new Position({x:0,y:0}))
    this.game.addEntity(ent)
    this.roomObjects['terrain'] = { id: 'terrain', g, ent }
  }
  createTerrainTexture(data){
    let canvas = document.createElement('canvas')
    canvas.width = TILE_SIZE * 50
    canvas.height = TILE_SIZE * 50
    let ctx = canvas.getContext('2d')
    let colors = ['#2B2B2B','#111111','#292B18']
    for(let i=0;i<data.terrain.length;i++){
      let x = i % 50
      let y = (i - x) / 50
      let val = data.terrain[i]
      ctx.beginPath()
      ctx.fillStyle = colors[parseInt(val)]
      ctx.rect(x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE)    
      ctx.fill()
    }
    return new PIXI.Texture.fromCanvas(canvas)
  }
}

module.exports = RoomObjectManager