var shortID = require('shortid');
var Vector2 = require('./Vector2.js');
const Structure = require('./Structure.js');

module.exports = class Player {
    constructor(){
        this.username;
        this.id = shortID.generate();
        this.position = new Vector2();  
        this.structure = new Structure();
    }
}