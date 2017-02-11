# screeps-client

to setup
  `npm install`

create src/auth.js, make sure to have an email and password field. For PS, add `prefix: 'http://IP:PORT'`

to rebuild game:
  `browserify src/main.js -o src/game.js`

use watchify for easier auto-rebuilds

to run in PS, you can either add the path to mod.js to your PS mods, or run via electron

  `node_modules/.bin/electron src`
