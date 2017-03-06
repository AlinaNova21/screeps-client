const {app, BrowserWindow} = require('electron')

let clients = {}

module.exports = {
  createClient(id) {
    if(clients[id]) return clients[id]
    // Create the browser window.
    let win = new BrowserWindow({
      width: 800, 
      height: 600,
      'web-preferences': {
          'web-security': false,
          "webgl": true
      }
    })
    clients[id] = win

    // and load the index.html of the app.
    win.loadURL(`file://${__dirname}/client.html#${id}`)

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      delete clients[config.id]
    })
    return win
  }
}
