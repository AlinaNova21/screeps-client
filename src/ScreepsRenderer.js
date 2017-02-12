const COLOR_ENERGY = '#FFE8BC'
const COLOR_EMPTY = '#555555'
const COLOR_ROAD = '#666666'
const COLOR_CREEP = '#444444'
const COLOR_TERMINAL = '#AAAAAA'
const TILE_SIZE = 32

const STRUCTURE_EXTENSION = 'extension'
const STRUCTURE_SPAWN = 'spawn'
const STRUCTURE_LAB = 'lab'
const STRUCTURE_TOWER = 'tower'
const STRUCTURE_LINK = 'link'
const STRUCTURE_TERMINAL = 'terminal'
const STRUCTURE_ROAD = 'road'

// TODO: Find a better way of organizing this.

class ScreepsRenderer {
  constructor(){
    this.textureCache = {}
    this.RoomVisual = RoomVisual
  }

  getCache(cacheKey){
    return this.textureCache[cacheKey]
  }

  renderVisuals(rawvisuals){
    let canvas = document.createElement('canvas')
    canvas.width = TILE_SIZE * 50
    canvas.height = TILE_SIZE * 50
    let rv = new RoomVisual(canvas)
    rv.renderVisuals(rawvisuals)
    return new PIXI.Texture.fromCanvas(canvas)
  }

  getTexture(obj){
    let texture = null
    let textureKey = obj.type
    let suffix = ''
    let canvas = this.getCanvas()
    let ctx = canvas.getContext('2d')
    let rv = new RoomVisual(canvas)
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
    ctx.translate(TILE_SIZE/2,TILE_SIZE/2)
    switch(obj.type){
      case 'creep':
        this.renderCreep(ctx,obj)
        break
      case 'spawn':
        // this.renderSpawn(ctx,obj)
        break
      case 'source':
        this.renderSource(ctx,obj)
        break
      case 'extension':
        this.renderSource(ctx,obj)
        break
      case 'road':
        // this.renderRoad(ctx,obj)
        break
      default:
        // this.renderFallback(ctx,obj)
        break
    }
    ctx.translate(-TILE_SIZE/2,-TILE_SIZE/2)
    rv.structure(1,1,obj.type,obj)
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
    canvas.width = TILE_SIZE * 2
    canvas.height = TILE_SIZE * 2
    return canvas
  }
}

function deg2rad(deg){
  return deg * (Math.PI/180)
}

module.exports = ScreepsRenderer


class RoomVisual {
  constructor(canvas){
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }
  renderVisuals(rawvisuals){
    let visuals = rawvisuals.split("\n").filter(v=>v)

    visuals.forEach(v=>{
      // console.log('v',v)
      v = JSON.parse(v)
      this.renderVisual(v)
    })
  }

  renderVisual(v){
    // console.log('renderVisual',v)
    let ctx = this.ctx
    let ht = TILE_SIZE/2
    ctx.save()
    ctx.translate(ht,ht)
    let {t,x,y,s,text,points} = v
    let map = {
      t: ()=>this.text(text,x,y,s),
      p: ()=>this.poly(points,s),
      c: ()=>this.circle(x,y,s)
    }
    // {"t":"p","points":[[14,16],[13,16],[12,16],[11,17],[10,18],[9,19],[8,20],[8,21]],"s":{"fill":"transparent","stroke":"red","lineStyle":"dashed","strokeWidth":0.15,"opacity":0.4}}↵"
    map[t]()
    ctx.translate(-ht,-ht)
    ctx.restore()
  }

  applyStyle(style){
    let ctx = this.ctx
    ctx.fillStyle = style.color || style.fill || '#ffffff'
    ctx.globalAlpha = style.opacity || 0.5
    ctx.lineWidth = (style.strokeWidth || style.width || 0.1) * TILE_SIZE
    ctx.strokeStyle = style.stroke || '#ffffff'
    ctx.setLineDash([1,0])
    ctx.lineCap = 'butt'
    if(style.lineStyle == 'dashed'){
      ctx.setLineDash([TILE_SIZE/2,TILE_SIZE/2])
    }
    let fs = style.fontSize || 0.5
    ctx.font = `${fs * TILE_SIZE * 2}pt sans-serif`
    console.log(ctx.strokeStyle)
  }

  text(text,x,y,style){
    let ctx = this.ctx
    ctx.save()
    this.applyStyle(style)
    ctx.fillText(text,x * TILE_SIZE,y * TILE_SIZE)
    ctx.restore()
  }
  circle(x,y,style){
    let ctx = this.ctx
    ctx.save()
    this.applyStyle(style)
    let r = style.radius || 0.15
    ctx.beginPath()
    ctx.arc(x * TILE_SIZE,y * TILE_SIZE,r * TILE_SIZE, 0, 2 * Math.PI)
    ctx.fill()
    if(style.stroke)
      ctx.stroke()
    ctx.restore() 
  }
  poly(points,style){
    let ctx = this.ctx
    ctx.save()
    this.applyStyle(style)
    ctx.beginPath()
    ctx.moveTo(points[0][0] * TILE_SIZE,points[0][1] * TILE_SIZE)
    for(let i=1;i<points.length;i++)
      ctx.lineTo(points[i][0] * TILE_SIZE,points[i][1] * TILE_SIZE)
    ctx.fill()
    if(style.stroke)
      ctx.stroke()
    ctx.restore() 
  }
  rect(x,y,w,h,style){
    let ctx = this.ctx
    ctx.save()
    this.applyStyle(style)
    let r = style.radius || 0.15
    ctx.beginPath()
    ctx.rect(x * TILE_SIZE,y * TILE_SIZE,w * TILE_SIZE,h * TILE_SIZE)
    ctx.fill()
    if(style.stroke)
      ctx.stroke()
    ctx.restore() 
  }
}

const colors = {
  gray: '#555555',
  light: '#AAAAAA',
  road: '#666', // >:D
  dark: '#181818',
  outline: '#8FBB93'
}

RoomVisual.prototype.structure = function(x,y,type,opts={}){
  opts = Object.assign({
    opacity: 1
  },opts)
  console.log('STRUCTURE',x,y,type,opts)
  switch(type){
    case STRUCTURE_EXTENSION:
      this.circle(x,y,{
        radius: 0.5,
        fill: colors.dark,
        stroke: colors.outline,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      this.circle(x,y,{
        radius: 0.35,
        fill: colors.gray,
        opacity: opts.opacity
      })
      break
    case STRUCTURE_SPAWN:
      this.circle(x,y,{
        radius: 0.70,
        fill: colors.dark,
        stroke: '#CCCCCC',
        strokeWidth: 0.10,
        opacity: opts.opacity
      })
      break;
    case STRUCTURE_LINK:
    {
      let osize = 0.3
      let isize = 0.2
      let outer = [
        [0.0,-0.5],
        [0.4,0.0],
        [0.0,0.5],
        [-0.4,0.0]
      ]
      let inner = [
        [0.0,-0.3],
        [0.25,0.0],
        [0.0,0.3],
        [-0.25,0.0]
      ]
      outer = relPoly(x,y,outer)
      inner = relPoly(x,y,inner)
      outer.push(outer[0])
      inner.push(inner[0])
      this.poly(outer,{
        fill: colors.dark,
        stroke: colors.outline,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      this.poly(inner,{
        fill: colors.gray,
        stroke: false,
        opacity: opts.opacity
      })
      break;
    }
    case STRUCTURE_TERMINAL:
    {
      let outer = [
        [0.0,-0.8],
        [0.55,-0.55],
        [0.8,0.0],
        [0.55,0.55],
        [0.0,0.8],
        [-0.55,0.55],
        [-0.8,0.0],
        [-0.55,-0.55],
      ]
      let inner = [
        [0.0,-0.65],
        [0.45,-0.45],
        [0.65,0.0],
        [0.45,0.45],
        [0.0,0.65],
        [-0.45,0.45],
        [-0.65,0.0],
        [-0.45,-0.45],
      ]
      outer = relPoly(x,y,outer)
      inner = relPoly(x,y,inner)
      outer.push(outer[0])
      inner.push(inner[0])
      this.poly(outer,{
        fill: colors.dark,
        stroke: colors.outline,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      this.poly(inner,{
        fill: colors.light,
        stroke: false,
        opacity: opts.opacity
      })
      this.rect(x-0.45,y-0.45,0.9,0.9,{
        fill: colors.gray,
        stroke: colors.dark,
        strokeWidth: 0.1,
        opacity: opts.opacity
      })
      break;
    }
    case STRUCTURE_LAB:
      this.circle(x,y-0.025,{
        radius: 0.55,
        fill: colors.dark,
        stroke: colors.outline,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      this.circle(x,y-0.025,{
        radius: 0.40,
        fill: colors.gray,
        opacity: opts.opacity
      })
      this.rect(x-0.45,y+0.3,0.9,0.25,{
        fill: colors.dark,
        stroke: false,
        opacity: opts.opacity
      })
      {
        let box = [
          [-0.45,0.3],
          [-0.45,0.55],
          [0.45,0.55],
          [0.45,0.3],
        ]
        box = relPoly(x,y,box)
        this.poly(box,{
          stroke: colors.outline,
          strokeWidth: 0.05,
          opacity: opts.opacity
        })
      }
      break
    case STRUCTURE_TOWER:
      this.circle(x,y,{
        radius: 0.6,
        fill: colors.dark,
        // fill: 'transparent',
        stroke: colors.outline,
        strokeWidth: 0.05,
        opacity: opts.opacity
      })
      this.rect(x-0.4,y-0.3,0.8,0.6,{
        fill: colors.gray,
        opacity: opts.opacity
      })
      this.rect(x-0.2,y-0.9,0.4,0.5,{
        fill: colors.light,
        stroke: colors.dark,
        strokeWidth: 0.07,
        opacity: opts.opacity
      })
      break;
    case STRUCTURE_ROAD:
      this.circle(x,y,{
        radius: 0.175,
        fill: colors.road,
        stroke: false,
        opacity: opts.opacity
      })
      if(!this.roads) this.roads = []
      this.roads.push([x,y])
      break;
  }
}

const dirs = [
  [],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1]
]

RoomVisual.prototype.connectRoads = function(opts={}){
  let color = opts.color || colors.road || 'white'
  if(!this.roads) return
  // this.text(this.roads.map(r=>r.join(',')).join(' '),25,23)  
  this.roads.forEach(r=>{
    // this.text(`${r[0]},${r[1]}`,r[0],r[1],{ size: 0.2 })
    for(let i=1;i<=4;i++){
      let d = dirs[i]
      let c = [r[0]+d[0],r[1]+d[1]]
      let rd = _.some(this.roads,r=>r[0] == c[0] && r[1] == c[1])
      // this.text(`${c[0]},${c[1]}`,c[0],c[1],{ size: 0.2, color: rd?'green':'red' })
      if(rd){
        this.line(r[0],r[1],c[0],c[1],{
          color: color,
          width: 0.35,
          opacity: opts.opacity || 1
        })
      }
    }
  })
}

function relPoly(x,y,poly){
  return poly.map(p=>{
    p[0] += x
    p[1] += y
    return p
  })
}

RoomVisual.prototype.test = function test(){
  let demopos = [19,24]
  let start = Game.cpu.getUsed()
  this.clear()
  this.structure(demopos[0]+0,demopos[1]+0,STRUCTURE_LAB)
  this.structure(demopos[0]+1,demopos[1]+1,STRUCTURE_TOWER)
  this.structure(demopos[0]+2,demopos[1]+0,STRUCTURE_LINK)
  this.structure(demopos[0]+3,demopos[1]+1,STRUCTURE_TERMINAL)
  this.structure(demopos[0]+4,demopos[1]+0,STRUCTURE_EXTENSION)
  this.structure(demopos[0]+5,demopos[1]+1,STRUCTURE_SPAWN)

  let stage = (Game.time % 3) + 1
  Game.rooms.E3N31.buildFlower({ x:28, y:28 },stage)
  this.connectRoads()
  let end = Game.cpu.getUsed()
  this.text(this.getSize()+'B',demopos[0]+3,demopos[1]+4)
  this.text(Math.round((end-start)*100)/100,demopos[0]+3,demopos[1]+5)
  // this.structure(20,5,STRUCTURE_TOWER)
  // this.structure(20,3,STRUCTURE_TOWER)
  // this.structure(16,5,STRUCTURE_LAB)
  // this.structure(16,4,STRUCTURE_LAB)
}