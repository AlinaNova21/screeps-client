const express = require('express')

let app = express()

app.use('/node_modules', express.static('./node_modules/'))
app.use(express.static('./public'))
app.use(express.static('./src'))

app.use('/client/node_modules', express.static('./node_modules/'))
app.use('/client',express.static('./public'))
app.use('/client',express.static('./src'))

app.get('/tile/:z/:x/:y.png',(req,res)=>{
  let {x,y,z} = req.params
  if(z != -5) return res.status(404).end()
  let ret = '';
  ret += x<0?'W':'E'
  ret += x<0?(-x-1):x
  ret += y<0?'N':'S'
  ret += y<0?(-y-1):y
  res.redirect(`http://server7.ags131.com:21025/assets/map/${ret}.png`)
})

app.listen(process.env.PORT || 8080, () => {
  console.log('listening')
})
