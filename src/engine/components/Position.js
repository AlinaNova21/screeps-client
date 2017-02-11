const Component = require('./Component')

class Position extends Component{
  constructor(opts = {}){    
    super()
    this.x = opts.x || 0
    this.y = opts.y || 0
  }
  update(){}
}

module.exports = Position