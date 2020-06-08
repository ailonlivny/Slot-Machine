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
        this.potions = Array.from(Array(3), () => new Array(5));
    }

    preload()
    {
        this.load.image("slotContainer","assets/images/slotContainer.png");
        this.load.image("potion1","assets/images/potion1.png");
        this.load.image("potion2","assets/images/potion2.png");
        this.load.image("potion3","assets/images/potion3.png");
        this.load.image("potion4","assets/images/potion4.png");
    }

    create()
    {
        this.background = this.add.image(0,0,"slotContainer");
        this.background.setOrigin(0,0);

        var deltaCol = 0;
        var deltaRow = 0;
        
        var potionsStr = ["potion1","potion2","potion3","potion4"];
        var randomIndex = 0;

        for(var row = 0; row < this.numOfRowsInPotionsArray; row++)
        {
            for(var col = 0; col < this.numOfcolsInPotionsArray; col++)
            {
                randomIndex = Math.floor(Math.random() * potionsStr.length); 
                deltaCol = this.potionWidth * col;
                deltaRow = this.potionHeight * row;
                this.potionImage = this.add.image(this.leftSlotContainer + deltaCol, this.topSlotContainer + deltaRow, potionsStr[randomIndex]);
                this.potions[row][col] = new Potion(this.potionImage);
            }       
        }
    }
}