const Component = require('./Component')

class Renderable extends Component {
  constructor(graphics){
    super()
    this.graphics = graphics
  }
  update(){
    let pos = this.entity.findComponent('position')
    this.graphics.x = pos.x
    this.graphics.y = pos.y
  }
}

module.exports = Renderable