require('./ui')

// const angular = require('angular')

const Game = require('./engine/Game')
const RoomObjectSystem = require('./engine/systems/RoomObjectSystem')

const Position = require('./engine/components/Position')
const Renderable = require('./engine/components/Renderable')
const RoomObject = require('./engine/components/RoomObject')
const Entity = require('./engine/entities/Entity')
const RoomObjectManager = require('./RoomObjectManager')

const TILE_SIZE = 32

// const ROOM = location.hash.slice(1) || 'W8N3'
const ROOM = location.hash.slice(1) || 'E3N31'
let currentRoom = ''

const _ = require('lodash')

let game = window.game = new Game()
let ros = window.ros = new RoomObjectSystem(game)
game.systems.push(ros)
let rom = window.rom = new RoomObjectManager(game)



game.renderer.resize(50*TILE_SIZE,50*TILE_SIZE)

// let SockJS = require('sockjs-client')
// let ScreepsAPI = require('./api')
let ScreepsAPI = require('screeps-api')


// const app = angular.module('game',[])

// app.factory('game',function(){
//   return new GameManager()
// })

class GameManager {
  constructor(){

  }
  connect(config){
    window.api = new ScreepsAPI(require('./auth'))

  }
  startGame(){
    this.roomObjects = {}
    
  }
}
let api = window.api = new ScreepsAPI()
/* auth.js
module.exports = {
  prefix: location.origin, // Leave out for Private Server
  email: 'userOrEmail',
  password: 'password'
}
*/

let socketEvents = ['connected','disconnected','message','auth','time','protocol','package','subscribe','unsubscribe','console']
socketEvents.forEach(ev=>{
  api.socket.on(ev,(data)=>{
    console.log(ev,data)
  })
})

let auth = require('./auth')
console.log(auth)
api.auth(auth.email,auth.password)
api.on('auth',()=>{
  api.socket.connect()
})

api.socket.on('auth',(event)=>{
  if(event.data.status == 'ok'){
    console.log('authed')
    startRoom(ROOM)
  }
})

api.socket.on('room',(event)=>{
  console.log('room',event)
  if(event.id != currentRoom) return
  _.each(event.data.objects,(v,k)=>{
    if(v === null) return rom.destroyObject(k)
    if(v.x) v.x *= TILE_SIZE
    if(v.y) v.y *= TILE_SIZE
    // console.log(v.x,v.y)
    rom.createObject(k,v)
  })
  rom.setVisual(event.data.visual || '')
})

window.setRoom = startRoom

let size = Math.min(window.innerWidth,window.innerHeight)
rom.resize(size,size)

function startRoom(room){
  location.hash = '#'+room
  rom.destroyAll()
  api.socket.unsubscribe(`room:${currentRoom}`)
  currentRoom = room
  api.socket.subscribe(`room:${room}`)
  api.raw.game.roomTerrain(currentRoom,true)
    .then(data=>data.terrain)
    .then(terrain=>{
      let room = terrain.find(t=>t.room == currentRoom)
      rom.setTerrain(room)
    })
}

function stopRoom(room){

}
