const COLOR_ENERGY = '#FFE8BC'
const COLOR_EMPTY = '#555555'
const COLOR_ROAD = '#666666'
const COLOR_CREEP = '#444444'
const COLOR_TERMINAL = '#AAAAAA'
const TILE_SIZE = 32

// TODO: Find a better way of organizing this.

class ScreepsRenderer {
  constructor(){
    this.textureCache = {}
  }

  getCache(cacheKey){
    return this.textureCache[cacheKey]
  }

  getTexture(obj){
    let texture = null
    let textureKey = obj.type
    let suffix = ''
    let canvas = this.getCanvas()
    let ctx = canvas.getContext('2d')
    switch(obj.type){
      case 'creep':
        suffix = obj._id
        break
        
      case 'spawn':
        suffix += '_'+obj.ticksToSpawn
      case 'source':
      case 'extension':
        let perc = Math.round((obj.energy/obj.energyCapacity) * 100)
        suffix += '_'+perc
        break
    }
    textureKey += suffix
    if(this.getCache(textureKey))
      return this.getCache(textureKey)
    switch(obj.type){
      case 'creep':
        this.renderCreep(ctx,obj)
        break
      case 'spawn':
        this.renderSpawn(ctx,obj)
        break
      case 'source':
        this.renderSource(ctx,obj)
        break
      case 'extension':
        this.renderSource(ctx,obj)
        break
      case 'road':
        this.renderRoad(ctx,obj)
        break
      default:
        this.renderFallback(ctx,obj)
        break
    }
    texture = new PIXI.Texture.fromCanvas(canvas)
    this.textureCache[textureKey] = texture
    return texture
  }

  renderFallback(ctx,obj){
    ctx.beginPath()
    ctx.lineStyle = '2px solid #FF0000'
    ctx.rect(0,0,8,8)
    ctx.fill()
  }

  renderSource(ctx,obj){
    let perc = Math.round((obj.energy/obj.energyCapacity) * 100)/100
    let ht = TILE_SIZE/2
    ctx.beginPath()
    ctx.arc(ht,ht,ht-1,0,deg2rad(360))
    ctx.fillStyle = '#000000'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(ht,ht,ht-2,0,deg2rad(360))
    ctx.fillStyle = COLOR_EMPTY
    ctx.fill()
    ctx.beginPath()
    ctx.arc(ht,ht,ht-2,0,deg2rad(Math.ceil(perc * 360)))
    ctx.fillStyle = COLOR_ENERGY
    ctx.fill()
  }

  renderSpawn(ctx,obj){
    let perc = Math.round((obj.energy/obj.energyCapacity) * 100)/100
    let ht = TILE_SIZE/2
    ctx.beginPath()
    ctx.arc(ht,ht,ht,0,deg2rad(360))
    ctx.fillStyle = '#000000'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(ht,ht,ht-2,0,deg2rad(360))
    ctx.fillStyle = COLOR_EMPTY
    ctx.fill()
    ctx.beginPath()
    ctx.arc(ht,ht,ht-2,0,deg2rad(Math.ceil(perc * 360)))
    ctx.fillStyle = COLOR_ENERGY
    ctx.fill()
  }

  renderCreep(ctx,obj){
    let ht = TILE_SIZE/2
    ctx.beginPath()
    ctx.arc(ht,ht,ht-1,0,deg2rad(360))
    ctx.fillStyle = COLOR_CREEP
    ctx.fill()
    ctx.lineStyle = '1px solid #000000'
    ctx.stroke()
  }

  renderRoad(ctx,obj){
    let ht = TILE_SIZE/2
    ctx.beginPath()
    ctx.arc(ht,ht,ht-3,0,deg2rad(360))
    ctx.fillStyle = COLOR_ROAD
    ctx.fill()    
  }

  getCanvas(){
    let canvas = document.createElement('canvas')
    canvas.width = TILE_SIZE
    canvas.height = TILE_SIZE
    return canvas
  }
}

function deg2rad(deg){
  return deg * (Math.PI/180)
}

module.exports = ScreepsRenderer