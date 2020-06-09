class Scene extends Phaser.Scene
{
    constructor()
    {
        super("playGame");
        this.leftSlotContainer = 142;
        this.topSlotContainer = 174;
        this.potionHeight = 140;
        this.potionWidth = 140;
        this.numOfRowsInPotionsArray = 3;
        this.numOfcolsInPotionsArray = 5;
        this.sprites = [];
    }

    preload()
    {
        this.load.image("slotContainer","assets/images/slotContainer.png");
        this.load.image("potion1","assets/images/potion1.png");
        this.load.image("potion2","assets/images/potion2.png");
        this.load.image("potion3","assets/images/potion3.png");
        this.load.image("potion4","assets/images/potion4.png");
        // this.load.spritesheet("potionsRow", "assets/images/potionsRow.png",140,140);

        this.load.image("button_spin","assets/images/button_spin.png");
        this.load.image("button_stop","assets/images/button_stop.png");
        
    }

    create()
    {
        this.background = this.add.image(0,0,"slotContainer");
        this.background.setOrigin(0,0);
        
        // var buttonPositionX = 870;
        // var buttonPositionY = 110;
        // this.spinButtonImage = this.add.image(buttonPositionX ,buttonPositionY, "button_spin");
        // this.spinAndStopButton = new Button(this.spinButtonImage, buttonPositionX, buttonPositionY, "button_spin");

        var deltaX = 0;
        var deltaY = 0;
        
        var potionsStr = ["potion1","potion2","potion3","potion4"];
        var randomIndex = 0;

        // for(var row = 0; row < this.numOfRowsInPotionsArray; row++)
        // {
        //     for(var col = 0; col < this.numOfcolsInPotionsArray; col++)
        //     {
        //         randomIndex = Math.floor(Math.random() * potionsStr.length); 
        //         deltaX = this.potionWidth * col;
        //         deltaY = this.potionHeight * row;
        //         var positionX = this.leftSlotContainer + deltaX;
        //         var positionY = this.topSlotContainer + deltaY;
        //         this.potionImage = this.add.image(positionX , positionY, potionsStr[randomIndex]);
        //         this.potions[row][col] = new Potion(this.potionImage, positionX, positionY, potionsStr[randomIndex]);
        //     }       
        // }

        
        for(var row = 0; row < this.numOfRowsInPotionsArray; row++)
        {
            for(var col = 0; col < this.numOfcolsInPotionsArray; col++)
            {
                randomIndex = Math.floor(Math.random() * potionsStr.length); 
                deltaX = this.potionWidth * col;
                deltaY = this.potionHeight * row;
                var positionX = this.leftSlotContainer + deltaX;
                var positionY = this.topSlotContainer + deltaY;
                this.add.sprite(positionX , positionY, potionsStr[randomIndex]);
                this.sprites.push(new Potion(PIXI.Texture.from("assets/images/" + potionsStr[randomIndex]+ ".png")));
            }       
        }

    }

    update()
    {
        this.sprites.forEach(sprite => sprite.update())
    }

    spinSlotMachine()
    {

    }

    resetPotionPosition(potion)
    {

    }
}