const levelName = process.argv[2]
console.log('Level ready '+levelName)

const level = require('./level/'+levelName)
const fs = require('fs')
const newLevel = {}
newLevel.h = level.height
newLevel.w = level.width

// simplify triggers
let triggers = level.layers[2].objects
newLevel.tr = triggers.map((trigger) => {
    return {
        x : trigger.x,
        y : trigger.y,
        w : trigger.width,
        h : trigger.height,
        p : trigger.properties,
        t : trigger.type
    }
})

//remap map tiles
let tilechain = '' 
let tiles = level.layers[0].data
for(let i = 0; i < level.height; i++) {
    for(let j = 0; j < level.width;j++) {
        let tile = tiles[i*level.width+j]
        
        if(tile !== 0) {
            tilechain += String.fromCharCode(j+97) + String.fromCharCode(i+97) + String.fromCharCode(tile+97)
        }
    }
}
newLevel.p = level.properties
newLevel.ti = tilechain
destDescr = fs.openSync('../dist/level/'+levelName+'.js','w+')
fs.writeFileSync(destDescr, `var ${levelName} = ${JSON.stringify(newLevel, null,'')}`)


