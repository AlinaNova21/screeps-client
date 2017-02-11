const Game = require('./engine/Game')
const RoomObjectSystem = require('./engine/systems/RoomObjectSystem')

const Position = require('./engine/components/Position')
const Renderable = require('./engine/components/Renderable')
const RoomObject = require('./engine/components/RoomObject')
const Entity = require('./engine/entities/Entity')
const RoomObjectManager = require('./RoomObjectManager')

const TILE_SIZE = 32

const ROOM = location.hash.slice(1) || 'W8N3'
// const ROOM = location.hash.slice(1) || 'W3N35'
let currentRoom = ''

const _ = require('lodash')

let game = window.game = new Game()
let ros = window.ros = new RoomObjectSystem(game)
game.systems.push(ros)
let rom = window.rom = new RoomObjectManager(game)



game.renderer.resize(50*TILE_SIZE,50*TILE_SIZE)

// let SockJS = require('sockjs-client')
let roomObjects = {}
let ScreepsAPI = require('./api')

let api = window.api = new ScreepsAPI(require('./auth'))
/* auth.js
module.exports = {
  prefix: location.origin, // Leave out for Private Server
  email: 'userOrEmail',
  password: 'password'
}
*/

api.socket(()=>{})

api.on('auth',()=>{
  console.log('authed')
  startRoom(ROOM)
})

api.on('message',(msg)=>{
  console.log('msg',msg)
})

api.on('room',(msg)=>{
  // console.log('room',msg)
  let [room,data] = msg
  if(room != `room:${currentRoom}`) return
  _.each(data.objects,(v,k)=>{
    if(v === null) return rom.destroyObject(k)
    if(v.x) v.x *= TILE_SIZE
    if(v.y) v.y *= TILE_SIZE
    // console.log(v.x,v.y)
    rom.createObject(k,v)
  })
})

window.setRoom = startRoom

let size = Math.min(window.innerWidth,window.innerHeight)
rom.resize(size,size)

function startRoom(room){
  location.hash = '#'+room
  rom.destroyAll()
  api.unsubscribe(`room:${currentRoom}`)
  currentRoom = room
  api.subscribe(`room:${room}`)
  api.req('GET','/api/game/room-terrain',{ encoded: 'true', room: currentRoom })
    .then(data=>data.body)
    .then(data=>data.terrain)
    .then(terrain=>{
      let room = terrain.find(t=>t.room == currentRoom)
      rom.setTerrain(room)
    })
}

function stopRoom(room){

}
