// class Potion extends PIXI.Sprite
// {
//     constructor(i_ImageURL, i_Sprite)
//     {
//         super(i_ImageURL);
//         this.prevTimeTotalSeconds = 0;
//         this.velocity = 20;
//         this.sprite = i_Sprite;
//     }

//     update(i_Scene)
//     {
//         var elapsedGameTime = i_Scene.time.now * 0.001 - this.prevTimeTotalSeconds;
//         this.sprite.y += this.velocity * elapsedGameTime;
//         // this.y += 2;
//         // this.x += 1;
//         this.prevTimeTotalSeconds = i_Scene.time.now * 0.001;
//         // return elapsedGameTime;
//     }
// }