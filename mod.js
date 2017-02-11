const express = require('express')

let router = new express.Router()

router.use('/node_modules', express.static(`${__dirname}/node_modules/`))
router.use(express.static(`${__dirname}/public`))
router.use(express.static(`${__dirname}/src`))

router.use('/client/node_modules', express.static(`${__dirname}/node_modules/`))
router.use('/client',express.static(`${__dirname}/public`))
router.use('/client',express.static(`${__dirname}/src`))

router.get('/tile/:z/:x/:y.png',(req,res)=>{
  let {x,y,z} = req.params
  if(z != -5) return res.status(404).end()
  let ret = '';
  ret += x<0?'W':'E'
  ret += x<0?(-x-1):x
  ret += y<0?'N':'S'
  ret += y<0?(-y-1):y
  res.redirect(`http://server7.ags131.com:21025/assets/map/${ret}.png`)
})

module.exports = function(config){
  if(config.backend){
    config.backend.socketUpdateThrottle = 10
    console.log('Adding Event Handler')
    config.backend.on('expressPreConfig',app=>{
      console.log('Registering router')
      app.get('/',(req,res)=>res.redirect('/client/'))
      app.use('/client',router)
    })
  }
}