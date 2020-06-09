// import * as PIXI from 'pixi.js'

// const app = new PIXI.Application();

window.onload = function()
{
    var config = 
    {
        width:1366,
        height:768,
        backgroundColor:0x000000,
        scene:[Scene],
        physics:{
            default:"arcade",
            arcade:{
                debug:false
            }
        }
    }

    var game = new Phaser.Game(config);
}