const levelName = process.argv[2]
console.log('Level ready '+levelName)
const xmlParser = require('xml2js').Parser()

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


//export tileset

const tsx = xmlParser.parseString(fs.readFileSync('./level/sprite.tsx'), function(err, result) {
    console.log(result.tileset.tile[0].objectgroup[0].properties[0].property)
})

//remap map tiles
let tilechain = '' 
let tiles = level.layers[0].data
for(let i = 0; i < level.height; i++) {
    for(let j = 0; j < level.width;j++) {
        let tile = tiles[i*level.width+j]
        
        if(tile !== 0) {
            tilechain += String.fromCharCode(j+20) + String.fromCharCode(i+20) + String.fromCharCode(tile+20)
        }
    }
}
newLevel.p = level.properties
newLevel.ti = tilechain
destDescr = fs.openSync('../dist/level/'+levelName+'.js','w+')
fs.writeFileSync(destDescr, `var ${levelName} = ${JSON.stringify(newLevel, null,'')}`)


