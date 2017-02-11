const Component = require('./Component')

class RoomObject extends Component{
  constructor(opts = {}){    
    super()
    this.obj = opts.obj || {}
    this.sprite = opts.sprite || null
  }
  update(){
    let pos = this.entity.findComponent('position')
    pos.x = this.obj.x || 0
    pos.y = this.obj.y || 0
    // console.log('Update')
  }
}

module.exports = RoomObject