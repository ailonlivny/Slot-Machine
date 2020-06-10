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
        this.numOfReels = 5;
        this.potionsArray = [];
        this.spinButtonWasClicked = false;
        this.stopButtonWasClicked = false;
        this.lastTimeSpinButtonWasClicked = 0;
        this.oneSecond = 1;
        this.twoSeconds = 2;
        this.prevTimeTotalSeconds = 0;
        this.velocity = 100;
        this.isAllReelsInSlotMachineSpinning = false;
        this.isAllReelsStoppingInSlotMachine = false;
        this.isReelsStopingOneByOneInSlotMachine = false;
        this.originTilePositionY = this.topSlotContainer + this.potionHeight;
        this.stopReelsOneByOneStartTime = 0;
        this.isReelsStopped = [false,false,false,false,false]; 
    }

    preload()
    {
        this.load.image("slotContainer","assets/images/slotContainer.png");
        this.load.spritesheet("potionsCol", "assets/images/potionsCol.png",{ frameWidth: 142, frameHeight: 550});
        this.load.image("button_spin","assets/images/button_spin.png");
        this.load.image("button_stop","assets/images/button_stop.png");
        this.load.audio('bg_sound', ['assets/BG_Music.wav']);
        this.load.audio('spin_sound', ['assets/Spin.wav']);      
    }

    create()
    {
        this.background = this.add.image(0,0,"slotContainer");
        this.background.setOrigin(0,0);
           
        this.text = this.add.text(290, 0, "Welcome to the slot Machine!", {color: "Yellow"});

        var buttonPositionX = 870;
        var buttonPositionY = 110;
        this.spinButton = this.add.sprite(buttonPositionX, buttonPositionY, 'button_spin').setInteractive();
        this.stopButton = this.add.sprite(buttonPositionX, buttonPositionY, 'button_stop')
        this.stopButton.setVisible(false);

        this.spinButton.on('pointerdown', () => {this.spinButtonOnClick()})
        this.stopButton.on('pointerdown',  () => {this.stopButtonOnClick()})

        var deltaX = 0;

        for(var col = 0; col < this.numOfReels; col++)
        {
            deltaX = this.potionWidth * col;
            var positionX = this.leftSlotContainer + deltaX;
            var positionY = this.topSlotContainer + this.potionHeight;
            var potionTileSprite = this.add.tileSprite(positionX, positionY, 140, 415, 'potionsCol');
            this.potionsArray.push(potionTileSprite);
        }
        
        this.bgSound = this.sound.add("bg_sound", { loop: "true" });
        this.spinSound = this.sound.add("spin_sound", {loop: "false"}); 
        this.bgSound.play();
    }

    update()
    {
        var timeNow = (this.time.now * 0.001);

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
            this.stopReelsOneByOne(timeNow);
        }

        if(this.spinButtonWasClicked && (this.time.now * 0.001) < this.lastTimeSpinButtonWasClicked + this.oneSecond) // spin button was press, stop button set opacity 50%
        {
            this.stopButton.setAlpha(0.5);
        }
        else if(this.spinButtonWasClicked && (this.time.now * 0.001) >= this.lastTimeSpinButtonWasClicked + this.twoSeconds && this.isAllReelsInSlotMachineSpinning) // The spin is automatic stop (reel by reel)
        {
            this.spinButton.setVisible(true);
            this.stopButton.setVisible(false);
            this.isAllReelsInSlotMachineSpinning = false;
            this.isReelsStopingOneByOneInSlotMachine = true;
            this.stopReelsOneByOneStartTime = (this.time.now * 0.001);
        }
        else if(this.stopButtonWasClicked && (this.time.now * 0.001) >= this.lastTimeSpinButtonWasClicked + this.oneSecond) // The spin is stopping by pressed stop button
        {
            this.isAllReelsInSlotMachineSpinning = false;
            this.isAllReelsStoppingInSlotMachine = true;
            this.stopButtonWasClicked = false;
        }
        else if(this.spinButtonWasClicked && !this.stopButtonWasClicked && (this.time.now * 0.001) >= this.lastTimeSpinButtonWasClicked + this.oneSecond) // spin button was press before 1 sec, stop button set opacity 100% and return pressd.
        {
            this.stopButton.setAlpha(1);
            this.stopButton.setInteractive();
        }

        this.prevTimeTotalSeconds = timeNow;
    }
    
    spinButtonOnClick()
    {
        this.spinButton.setVisible(false);
        this.stopButton.setVisible(true);
        this.spinButtonWasClicked = true;
        this.stopButtonWasClicked = false;
        this.isAllReelsInSlotMachineSpinning = true;
        this.stopButton.disableInteractive();
        this.lastTimeSpinButtonWasClicked = this.time.now * 0.001;
        this.spinSound.play();
    }

    stopButtonOnClick()
    {
        this.stopButtonWasClicked = true;
        this.spinButtonWasClicked = false;
        this.spinButton.disableInteractive();
    }

    spinReels()
    {
        var elapsedGameTime = (this.time.now * 0.001) - this.prevTimeTotalSeconds;

        for(var potion of this.potionsArray)
        {  
            potion.tilePositionY += 1200 * elapsedGameTime;          
        }
    }

    stopReelsTogether()
    {
        var elapsedGameTime = (this.time.now * 0.001) - this.prevTimeTotalSeconds;

        for(var potion of this.potionsArray)
        {  
            if((1200 * elapsedGameTime) + (potion.tilePositionY % 1090) > 1090)
            {
                potion.tilePositionY = 1090;
                this.isAllReelsStoppingInSlotMachine = false;
                this.spinButton.setInteractive();
                this.spinButton.setVisible(true);
                this.stopButton.setVisible(false);
                this.spinSound.stop();
            }
            else
            {
                potion.tilePositionY += 1200 * elapsedGameTime;
            }                   
        }
    }

    stopReelsOneByOne(timeNowTotalSeconds)
    {     
        var elapsedGameTime = timeNowTotalSeconds - this.prevTimeTotalSeconds;
       
        for(var idx = 0; idx < this.potionsArray.length; idx++)
        {
            if(timeNowTotalSeconds - this.stopReelsOneByOneStartTime >= idx*1 && !this.isReelsStopped[idx])
            {
                this.stopReel(this.potionsArray[idx],idx, elapsedGameTime);
                
            }
            else if(!this.isReelsStopped[idx])
            {
                this.potionsArray[idx].tilePositionY += 1200 * elapsedGameTime;   
            }
        }

        if(this.isReelsStopped.every(elem=> elem == true))
        {
            this.isReelsStopingOneByOneInSlotMachine = false;
            this.isReelsStopped = this.isReelsStopped.map(elem => !elem);
            this.spinSound.stop();
        }
    }

    stopReel(potion,idx,elapsedGameTime)
    {
        if((1200 * elapsedGameTime) + (potion.tilePositionY % 1090) > 1090)
        {
            potion.tilePositionY = 1090;
            this.isReelsStopped[idx] = true;
        }
        else
        {
            potion.tilePositionY += 1200 * elapsedGameTime;
        }   
    }
}