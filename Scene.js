class Scene extends Phaser.Scene
{
    constructor()
    {
        super("playGame");
        this.leftSlotContainer = 143;
        this.topSlotContainer = 173;
        this.potionHeight = 140;
        this.potionWidth = 138;
        this.bottomSlotContainer = this.topSlotContainer + this.potionHeight * 3;
        this.numOfRowsInPotionsArray = 3;
        this.numOfcolsInPotionsArray = 5;
        this.potionsArray = [];
        this.spinButtonWasClicked = false;
        this.stopButtonWasClicked = false;
        this.lastTimeSpinButtonWasClicked = 0;
        this.oneSecond = 1;
        this.twoSeconds = 2;
        this.prevTimeTotalSeconds = 0;
        this.velocity = 100;
        this.potionsStr = ["potion1","potion2","potion3","potion4"];
        this.randomIndex = 0;
        this.isAllReelsInSlotMachineSpinning = false;
        this.countPositionY = 0;
    }

    preload()
    {
        this.load.image("slotContainer","assets/images/slotContainer.png");
        this.load.spritesheet("potionsCol", "assets/images/potionsCol.png",{ frameWidth: 142, frameHeight: 415, endFrame: 830 });
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

        for(var col = 0; col < this.numOfcolsInPotionsArray; col++)
        {
            deltaX = this.potionWidth * col;
            var positionX = this.leftSlotContainer + deltaX;
            var positionY = this.topSlotContainer + this.potionHeight;
            var potionTileSprite = this.add.tileSprite(positionX, positionY, 140, 415, 'potionsCol');
            this.potionsArray.push(potionTileSprite);
        }       
    }

    update()
    {
        if(this.isAllReelsInSlotMachineSpinning)
        {
            for(var potion of this.potionsArray)
            {
                potion.tilePositionY += 24;
                this.countPositionY += 24;
            }
        }

        if(this.spinButtonWasClicked && (this.time.now * 0.001) < this.lastTimeSpinButtonWasClicked + this.oneSecond) 
        {
            this.stopButton.setAlpha(0.5);
        }
        else if(this.spinButtonWasClicked && (this.time.now * 0.001) >= this.lastTimeSpinButtonWasClicked + this.twoSeconds) // Automatic stop spin, stop reel by reel.
        {
            this.isAllReelsInSlotMachineSpinning = false;
        }
        else if(this.spinButtonWasClicked && (this.time.now * 0.001) >= this.lastTimeSpinButtonWasClicked + this.oneSecond)
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
        this.isAllReelsInSlotMachineSpinning = true;
        this.stopButton.disableInteractive();
        this.lastTimeSpinButtonWasClicked = this.time.now * 0.001;
    }

    stopButtonOnClick()
    {
        this.stopButtonWasClicked = true;
        //Stop all reels together
        this.spinButton.setVisible(true);
        this.stopButton.setVisible(false);
        this.isAllReelsInSlotMachineSpinning = false;
     
    }
}