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
        this.spinButtonWasClicked = false;
        this.lastTimeSpinButtonWasClicked = 0;
        this.oneSecond = 1;
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
           
        this.text = this.add.text(290, 0, "Welcome to the slot Machine!", {color: "Yellow"});

        var buttonPositionX = 870;
        var buttonPositionY = 110;
        this.spinButton = this.add.sprite(buttonPositionX, buttonPositionY, 'button_spin').setInteractive();
        this.stopButton = this.add.sprite(buttonPositionX, buttonPositionY, 'button_stop').setInteractive();
        this.stopButton.setVisible(false);

        this.spinButton.on('pointerdown', () => {this.spinButtonOnClick()})
        this.stopButton.on('pointerdown',  () => {this.stopButtonOnClick()})

        var deltaX = 0;
        var deltaY = 0;
        
        var potionsStr = ["potion1","potion2","potion3","potion4"];
        var randomIndex = 0;
  
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
        this.text.setText(this.time.now * 0.001);
        this.sprites.forEach(sprite => sprite.update())

        if(this.spinButtonWasClicked && this.lastTimeSpinButtonWasClicked + this.oneSecond > this.time.now * 0.001)
        {
            this.stopButton.setAlpha(0.5);
        }
        else if(this.spinButtonWasClicked && this.lastTimeSpinButtonWasClicked + this.oneSecond <= this.time.now * 0.001)
        {
            this.stopButton.setAlpha(1);
            this.stopButton.setInteractive();
        }
    }
    
    spinButtonOnClick()
    {
        this.spinButton.setVisible(false);
        this.stopButton.setVisible(true);
        this.spinButtonWasClicked = true;
        this.stopButton.disableInteractive();
        this.lastTimeSpinButtonWasClicked = this.time.now * 0.001;
    }

    stopButtonOnClick()
    {
        this.spinButton.setVisible(true);
        this.stopButton.setVisible(false);
        this.stopButton.setAlpha(0.5);
    }

    actionOnClick()
    {
    
        
    }

    spinSlotMachine()
    {

    }

    resetPotionPosition(potion)
    {

    }
}

