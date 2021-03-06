var io = require('socket.io')(process.env.PORT || 52300);
var Globalize = require('globalize');


// Custom classes:
var Player = require('./Classes/Player.js');
const Structure = require('./Classes/Structure.js');
let Prototypes = require('./Classes/Utility/Prototypes') //Brings in all prototype functions for the first time


var players = [];   // All players
var sockets = [];   // All sockets


console.log('Server has started');

io.on('connection', function(socket){   // When new player connects
    console.log('New connection');

    var player = new Player(); 
    var thisPlayerId = player.id;

    players[thisPlayerId] = player; // Add the player to the dictionary
    socket[thisPlayerId] = socket;

    socket.emit('register', {id: thisPlayerId});
    
  

    socket.on('myStructure', function(data){

        console.log("Recieved structure: "+ data.name); // print structure name
      //  console.log(JSON.stringify(data));
      player.structure = data;

        socket.emit('spawn', player);   
        socket.broadcast.emit('spawn', player); // Notify others about my spawn
        for(var playerID in players){   // Tell me about players already in game
            if(playerID != thisPlayerId){
                socket.emit('spawn', players[playerID]);
            }
        }
    })

    // Position data from player
    socket.on('updatePosition', function(data){
        player.position.x = data.position.x;
        player.position.y = data.position.y;
        player.rotation = data.rotation;
        
        player.position.x = new Number(player.position.x).formatNumber();
        player.position.y = new Number(player.position.y).formatNumber();
        player.rotation = new Number(player.rotation).formatNumber();

       // console.log("Sending pos data:"+ player.position.x + ", " + player.position.y);
        socket.broadcast.emit('updatePosition', {"id": player.id, "position": player.position, "rotation": player.rotation});
    });
  
   /* socket.on('changeDirection', function(data){
        // store the new direction and relay it to other players
        console.log("new dir: " + JSON.stringify(data));
        player.direction.x =  data.dirX;
        player.direction.y =  data.dirY;

        socket.broadcast.emit('changeDirection', {"id": player.id, "dirX": new Number(player.direction.x).formatNumber(), "dirY": new Number(player.direction.y).formatNumber()});
    });*/

    socket.on('collision', function(data){
        // decide the player who handles the physics and setup the position relay
     });

    socket.on('disconnect', function(){ // When player disconnects
        console.log("Player disconnected");
        delete players[thisPlayerId];   // Remove the player from database
        delete sockets[thisPlayerId];
        socket.broadcast.emit('disconnected', player);
        });
});