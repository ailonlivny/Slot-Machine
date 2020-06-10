class Scene extends Phaser.Scene
{
    constructor()
    {
        super("playGame");
        this.leftBoundSlotContainer = 143;
        this.topBoundSlotContainer = 173;
        this.potionHeight = 140;
        this.potionWidth = 138;
        this.threePotionsHeight = 415;
        this.bottomSlotContainer = this.topBoundSlotContainer + this.potionHeight * 3;
        this.numOfReels = 5;
        this.potionsArray = [];
        this.spinButtonWasClicked = false;
        this.stopButtonWasClicked = false;
        this.lastTimeSpinButtonWasClicked = 0;
        this.oneSecond = 1;
        this.twoSeconds = 2;
        this.prevTimeTotalSeconds = 0;
        this.isAllReelsInSlotMachineSpinning = false;
        this.isAllReelsStoppingInSlotMachine = false;
        this.isReelsStopingOneByOneInSlotMachine = false;
        this.stopReelsOneByOneStartTime = 0;
        this.isReelsStopped = [false,false,false,false,false]; 
        this.reelsSpeed = 0;
        this.potionSpritesheetHeight = 1090;
    }

    preload() // Loads game files (images and audio)
    {
        this.load.image("slotContainer","assets/images/slotContainer.png");
        this.load.spritesheet("potionsCol", "assets/images/potionsCol.png",{ frameWidth: 142, frameHeight: 550});
        this.load.image("button_spin","assets/images/button_spin.png");
        this.load.image("button_stop","assets/images/button_stop.png");
        this.load.audio('bg_sound', ['assets/BG_Music.wav']);
        this.load.audio('spin_sound', ['assets/Spin.wav']);      
    }

    create()  // Create sounds, sprites and images objects
    {
        // Init container object in the container.
        this.text = this.add.text(290, 0, "Welcome to Ailon slot Machine! :)", {color: "Yellow"});
        this.slotContainerImage = this.add.image(0,0,"slotContainer");
        this.slotContainerImage.setOrigin(0,0);
        
        // Init buttons objects in the container.
        var buttonPositionX = 870;
        var buttonPositionY = 110;

        this.spinButton = this.add.sprite(buttonPositionX, buttonPositionY, 'button_spin').setInteractive();
        this.stopButton = this.add.sprite(buttonPositionX, buttonPositionY, 'button_stop').setVisible(false);

        this.spinButton.on('pointerdown', () => {this.spinButtonOnClick()})
        this.stopButton.on('pointerdown',  () => {this.stopButtonOnClick()})

        var deltaXfromLeftBoundSlotContainer = 0;

        // Init reels objects in the container.
        for(var col = 0; col < this.numOfReels; col++) 
        {
            deltaXfromLeftBoundSlotContainer = this.potionWidth * col;
            var positionX = this.leftBoundSlotContainer + deltaXfromLeftBoundSlotContainer;
            var positionY = this.topBoundSlotContainer + this.potionHeight;
            var potionTileSprite = this.add.tileSprite(positionX, positionY,  this.potionWidth, this.threePotionsHeight, 'potionsCol');
            this.potionsArray.push(potionTileSprite);
        }   

        // Init sounds objects
        this.bgSound = this.sound.add("bg_sound", { loop: "true" });
        this.spinSound = this.sound.add("spin_sound", {loop: "false"}); 
        this.bgSound.play();
    }

    update()
    {
        var timeNowTotalSeconds = (this.time.now * 0.001);
        var elapsedGameTime = timeNowTotalSeconds - this.prevTimeTotalSeconds;
        this.reelsSpeed =  1200 * elapsedGameTime;

        if(this.isAllReelsInSlotMachineSpinning)
        {
            this.spinReels();
        }

        if(this.isAllReelsStoppingInSlotMachine)
        {
            this.stopReelsTogether();
        }

        if(this.isReelsStopingOneByOneInSlotMachine)
        {
            this.stopReelsOneByOne(timeNowTotalSeconds, elapsedGameTime);
        }

        if(this.spinButtonWasClicked && timeNowTotalSeconds < this.lastTimeSpinButtonWasClicked + this.oneSecond) // spin button was press, stop button set opacity 50% 
        {
            this.stopButton.setAlpha(0.5);
        }
        else if(this.spinButtonWasClicked && timeNowTotalSeconds >= this.lastTimeSpinButtonWasClicked + this.twoSeconds && this.isAllReelsInSlotMachineSpinning) // The spin will stop automatic , reel by reel
        {
            this.spinButton.disableInteractive();
            this.spinButton.setVisible(true);
            this.stopButton.setVisible(false);
            this.isAllReelsInSlotMachineSpinning = false;
            this.isReelsStopingOneByOneInSlotMachine = true;
            this.stopReelsOneByOneStartTime = timeNowTotalSeconds;
        }
        else if(this.stopButtonWasClicked && timeNowTotalSeconds >= this.lastTimeSpinButtonWasClicked + this.oneSecond) // Stop button was pressed, all reels spin need to stop together
        {
            this.isAllReelsInSlotMachineSpinning = false;
            this.isAllReelsStoppingInSlotMachine = true;
            this.stopButtonWasClicked = false;
        }
        else if(this.spinButtonWasClicked && !this.stopButtonWasClicked && timeNowTotalSeconds >= this.lastTimeSpinButtonWasClicked + this.oneSecond) // spin button was pressed 1 sec before, stop button return active
        {
            this.stopButton.setAlpha(1);
            this.stopButton.setInteractive();
        }

        this.prevTimeTotalSeconds = timeNowTotalSeconds;
    }
    
    spinButtonOnClick()
    {
        var timeNowTotalSeconds = (this.time.now * 0.001);
        this.spinButton.setVisible(false);
        this.stopButton.setVisible(true);
        this.spinButtonWasClicked = true;
        this.stopButtonWasClicked = false;
        this.isAllReelsInSlotMachineSpinning = true;
        this.stopButton.disableInteractive();
        this.lastTimeSpinButtonWasClicked = timeNowTotalSeconds;
        this.spinSound.play();
    }

    stopButtonOnClick()
    {
        this.stopButtonWasClicked = true;
        this.spinButtonWasClicked = false;
        this.spinButton.disableInteractive();
    }

    spinReels() // Move positions reels from up to down
    {
        for(var potion of this.potionsArray)
        {  
            potion.tilePositionY += this.reelsSpeed;          
        }
    }

    stopReelsTogether() // Move positions reels from up to down, will stop when a "full round" was finished
    {
        for(var potion of this.potionsArray)
        {  
            if(this.reelsSpeed + (potion.tilePositionY % this.potionSpritesheetHeight) > this.potionSpritesheetHeight) // Calculate if delta distance from positions postion to entry point is smaller than potions speed
            {
                potion.tilePositionY = this.potionSpritesheetHeight; // finish a "full round" to entry point
                this.isAllReelsStoppingInSlotMachine = false;
                this.spinButton.setInteractive();
                this.spinButton.setVisible(true);
                this.stopButton.setVisible(false);
                this.spinSound.stop();
            }
            else
            {
                potion.tilePositionY += this.reelsSpeed;
            }                   
        }
    }

    stopReelsOneByOne(timeNowTotalSeconds, elapsedGameTime) // Move positions reels from up to down, will stop reels from left to right for each second
    {            
        for(var idx = 0; idx < this.potionsArray.length; idx++)
        {
            if(timeNowTotalSeconds - this.stopReelsOneByOneStartTime >= idx && !this.isReelsStopped[idx]) // chacks each potion if stiil spining and his time to stop arrived
            {
                this.stopReel(this.potionsArray[idx], idx, elapsedGameTime);             
            }
            else if(!this.isReelsStopped[idx]) // Move positions reels 
            {
                this.potionsArray[idx].tilePositionY += this.reelsSpeed;   
            }
        }

        if(this.isReelsStopped.every(elem=> elem == true)) // If all reels was stopped
        {
            this.isReelsStopingOneByOneInSlotMachine = false;
            this.isReelsStopped = this.isReelsStopped.map(elem => !elem);
            this.spinSound.stop();
            this.spinButton.setInteractive();
        }
    }

    stopReel(potion, idx)
    {
        if(this.reelsSpeed + (potion.tilePositionY % this.potionSpritesheetHeight) > this.potionSpritesheetHeight) // Calculate if delta distance from positions postion to entry point is smaller than potions speed
        {
            potion.tilePositionY = this.potionSpritesheetHeight; // finish a "full round" to entry point
            this.isReelsStopped[idx] = true;
        }
        else
        {
            potion.tilePositionY += this.reelsSpeed;
        }   
    }
}