class Game extends Phaser.Scene {

    preload() {
        this.load.image("bgc", "bg.png");
        this.load.image("paper", "question.png");

        // Header assets
        this.load.image("header", "blueheader.png");
        this.load.image("logo", "logo.png");
        this.load.image("logout", "logout.webp");
    }

    create() {
        // HEADER
        var header = this.add.image(0, 0, "header").setOrigin(0).setDisplaySize(1400, 150);
        var logo = this.add.image(0, 0, "logo").setOrigin(0).setDisplaySize(135, 50);
        var logout = this.add.image(1288, 8, "logout").setOrigin(0).setDisplaySize(80, 50);

        // BACKGROUND
        var bgc = this.add.image(0, 50, "bgc").setOrigin(0, 0).setDisplaySize(1400, 650).setVisible(true);
        var bgc2 = this.add.image(0, 86, "bgc").setOrigin(0, 0).setDisplaySize(1400, 650).setVisible(false);

        // QUESTION PAPER & TEXT
        var paper = this.add.image(700, 400, "paper").setDisplaySize(1000, 520).setVisible(true);
        var text = this.add.text(700, 300, 'Find names of 5 colours', {
            font: '24px Arial',
            color: '#000',
            align: 'center'
        }).setOrigin(0.5);

        // START BUTTON
        var button = this.add.graphics();
        button.fillStyle(0xd3d3d3, 1);
        button.fillRoundedRect(700 - 63, 450 - 35, 125, 65, 30);

        var buttonZone = this.add.zone(700, 450, 125, 65).setInteractive({ useHandCursor: true });
        var buttonText = this.add.text(700, 450, "Let's Start", {
            font: '20px Arial',
            color: '#000'
        }).setOrigin(0.5);

        // HEADER 2
        var header2 = this.add.rectangle(0, 50, 1400, 30, 0x002244).setInteractive().setOrigin(0).setVisible(false);
        var header2Text = this.add.text(700, 65, 'Find The name of 5 Colours', {
            font: '20px Arial',
            color: '#fff'
        }).setOrigin(0.5).setVisible(false);

        // FOOTER
        var footer = this.add.rectangle(740, 600, 1100, 100, 0xf2e9e4).setVisible(false);
        var answerBoxes = [];
        var selectedBox = null;

        // CREATE 5 BOXES
        const startX = 340;
        for (let i = 0; i < 5; i++) {
            const box = this.add.rectangle(startX + i * 150, 600, 120, 80, 0xffffff)
                .setStrokeStyle(2, 0x000000)
                .setInteractive()
                .setVisible(false);
            answerBoxes.push(box);
        }

        // SUBMIT BUTTON
        var submitBtn = this.add.rectangle(1180, 600, 120, 80, 0xffb703)
            .setInteractive()
            .setStrokeStyle(2, 0x000000)
            .setVisible(false);
        var submitText = this.add.text(1150, 590, 'Submit', {
            fontSize: '20px',
            color: '#000'
        }).setVisible(false);

        // SPOTLIGHT
        let spotlightGraphics = this.add.graphics();
        let spotlightRadius = 100;
        let spotlightCircle = new Phaser.Geom.Circle(700, 400, spotlightRadius);
        let spotlightMask = spotlightGraphics.createGeometryMask();
        spotlightGraphics.fillStyle(0x000000, 0.7);
        spotlightGraphics.fillRect(0, 0, 1480, 650);
        spotlightGraphics.setVisible(false);
        bgc2.setMask(spotlightMask);

        let spotlightActive = false;

        // START BUTTON LOGIC
        buttonZone.on('pointerdown', () => {
            text.setVisible(false);
            paper.setVisible(false);
            button.clear();
            buttonText.setVisible(false);

            bgc2.setVisible(true);
            bgc.setVisible(false);
            header2.setVisible(true);
            header2Text.setVisible(true);
            footer.setVisible(true);

            answerBoxes.forEach(box => box.setVisible(true));
            submitBtn.setVisible(true);
            submitText.setVisible(true);

            // Activate spotlight
            spotlightGraphics.setVisible(true);
            spotlightActive = true;
        });

        // CLICK TO MOVE SPOTLIGHT & SELECT BOX INSIDE
        this.input.on('pointerdown', (pointer) => {
            if (spotlightActive) {
                // Move spotlight to clicked position
                spotlightCircle.setPosition(pointer.x, pointer.y);

                // Redraw spotlight
                spotlightGraphics.clear();
                spotlightGraphics.fillStyle(0x000000, 0.7);
                spotlightGraphics.beginPath();
                spotlightGraphics.arc(pointer.x, pointer.y, spotlightRadius, 0, Math.PI * 2);
                spotlightGraphics.fillPath();

                // Check for selection inside spotlight
                answerBoxes.forEach(box => {
                    if (Phaser.Geom.Intersects.CircleToRectangle(spotlightCircle, box.getBounds())) {
                        if (selectedBox) selectedBox.setFillStyle(0xffffff);
                        selectedBox = box;
                        box.setFillStyle(0xa0e7e5);
                        console.log("Box selected inside spotlight!");
                    }
                });
            }
        });

        // SUBMIT BUTTON LOGIC
        submitBtn.on('pointerdown', () => {
            if (selectedBox) {
                console.log("You submitted! Selected Box:", selectedBox);
            } else {
                console.log("No box selected yet.");
            }
        });
    }
}

// CONFIG
var config = {
    type: Phaser.AUTO,
    width: 1480,
    height: 650,
    scene: [Game],
    parent: 'game_container'
};

var game = new Phaser.Game(config);
