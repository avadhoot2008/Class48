var boy, boyDead, boyIdle, boyJump, boyRun, boySlide;
var ground, groundImg;
var gameState = "serve";
var playBtn, playImg, retryImg, retryBtn;
var playBtnImg, playImgImg, retryImgImg, retryBtnImg;
var score = 0;
var barrel, box, saw, spike1, spike2, spike3, boxGroup, sawGroup, spikeGroup;

function preload() {
    boyDead = loadAnimation("animations/Dead__000.png", "animations/Dead__001.png",
        "animations/Dead__002.png", "animations/Dead__003.png",
        "animations/Dead__004.png", "animations/Dead__005.png",
        "animations/Dead__006.png", "animations/Dead__007.png",
        "animations/Dead__008.png", "animations/Dead__009.png");

    boyIdle = loadAnimation("animations/Idle__000.png", "animations/Idle__001.png",
        "animations/Idle__002.png", "animations/Idle__003.png",
        "animations/Idle__004.png", "animations/Idle__005.png",
        "animations/Idle__006.png", "animations/Idle__007.png",
        "animations/Idle__008.png", "animations/Idle__009.png");

    boyJump = loadAnimation("animations/Jump__000.png", "animations/Jump__001.png",
        "animations/Jump__002.png", "animations/Jump__003.png",
        "animations/Jump__004.png", "animations/Jump__005.png",
        "animations/Jump__006.png", "animations/Jump__007.png",
        "animations/Jump__008.png", "animations/Jump__009.png");

    boyRun = loadAnimation("animations/Run__000.png", "animations/Run__001.png",
        "animations/Run__002.png", "animations/Run__003.png",
        "animations/Run__004.png", "animations/Run__005.png",
        "animations/Run__006.png", "animations/Run__007.png",
        "animations/Run__008.png", "animations/Run__009.png");

    boySlide = loadAnimation("animations/Slide__000.png", "animations/Slide__001.png",
        "animations/Slide__002.png", "animations/Slide__003.png",
        "animations/Slide__004.png", "animations/Slide__005.png",
        "animations/Slide__006.png", "animations/Slide__007.png",
        "animations/Slide__008.png", "animations/Slide__009.png");

    barrel = loadImage("Obstacles/Barrel.png");
    box = loadImage("Obstacles/Box.png");
    saw = loadImage("Obstacles/Saw.png");
    spike1 = loadImage("Obstacles/spike1.png");
    spike2 = loadImage("Obstacles/spike2.png");
    spike3 = loadImage("Obstacles/spike3.png");

    groundImg = loadImage("Floor/ground2.png");

    playImgImg = loadImage("Buttons/PlayImage.png");
    retryBtnImg = loadImage("Buttons/RetryButton.png");

}

function setup() {
    createCanvas(800, 300);

    boy = createSprite(50, 207, 20, 50);
    boy.addAnimation("stopped", boyIdle);
    boy.addAnimation("running", boyRun);
    boy.addAnimation("died", boyDead);
    boy.addAnimation("slideing", boySlide);
    boy.addAnimation("jumping", boyJump);
    boy.scale = 0.3;

    boyJump.frameDelay = 200;

    ground = createSprite(200, 290, 400, 20);
    ground.addImage("ground", groundImg);
    ground.x = ground.width / 2;
    //ground.velocityX = -(6 + 3 * score / 100);

    playImg = createSprite(400, 150);
    playImg.addImage("playImg", playImgImg);
    playImg.scale = 1;

    retryBtn = createSprite(400, 150);
    retryBtn.addImage("retryButton", retryBtnImg);
    retryBtn.scale = 0.9;
    retryBtn.visible = false;

    /*retryBtn = createImg('Buttons/RetryButton.png');
    retryBtn.position = (500, 250);
    retryBtn.size = (50, 50);
    retryBtn.mouseClicked(reset);*/

    boxGroup = new Group();
    sawGroup = new Group();
    spikeGroup = new Group();

    score = 0;
}

function draw() {
    background(0);
    if (mousePressedOver(playImg) || keyDown("enter")) {
        gameState = "play";
    }

    if (gameState === "play") {
        playImg.visible = false;

        score = score + Math.round(getFrameRate() / 60);
        ground.velocityX = -(6 + 3 * score / 100);

        boy.changeAnimation("running", boyRun);

        if (keyIsDown(UP_ARROW)) {
            boy.velocityY = -12;
            boy.changeAnimation("jumping", boyJump);
        }

        boy.velocityY = boy.velocityY + 0.8;

        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }

        if (keyIsDown(DOWN_ARROW)) {
            boy.changeAnimation("slideing", boySlide);
            boy.y = 225;
        } else {
            boy.y = 207;
        }
        spawnBoxes();
        spawnSpikes();

        if (boxGroup.isTouching(boy) || sawGroup.isTouching(boy) || spikeGroup.isTouching(boy)) {
            gameState = "end";
        }
    }

    if (gameState === "end") {
        retryBtn.visible = true;

        //set velcity of each game object to 0
        ground.velocityX = 0;
        boy.velocityY = 0;
        boxGroup.setVelocityXEach(0);
        sawGroup.setVelocityXEach(0);
        spikeGroup.setVelocityXEach(0);

        //change the boy animation
        boy.changeAnimation("died", boyDead);

        //set lifetime of the game objects so that they are never destroyed
        boxGroup.setLifetimeEach(-1);
        sawGroup.setLifetimeEach(-1);
        spikeGroup.setLifetimeEach(-1);

        if (mousePressedOver(retryBtn)) {
            reset();
        }
    }

    drawSprites();
}

function spawnBoxes() {
    if (frameCount % 100 === 0) {
        var boxy = createSprite(600, 260, 10, 40);
        boxy.velocityX = -5;

        var rand = Math.round(random(1, 2));
        switch (rand) {
            case 1:
                boxy.addImage(barrel);
                break;
            case 2:
                boxy.addImage(box);
                break;
            case 3:
            default:
                break;
        }

        boxy.scale = 0.2;
        boxy.lifetime = 160;

        boxGroup.add(boxy);
    }
}

function spawnSpikes() {
    if (frameCount % 200 === 0) {
        var spikey = createSprite(600, 260, 10, 40);
        spikey.velocityX = -5;

        var rand = Math.round(random(1, 3));
        switch (rand) {
            case 1:
                spikey.addImage(spike1);
                break;
            case 2:
                spikey.addImage(spike2);
                break;
            case 3:
                spikey.addImage(spike3);
                break;
            default:
                break;
        }

        spikey.scale = 0.5;
        spikey.lifetime = 160;

        spikeGroup.add(spikey);
    }
}

function reset() {
    gameState = "play";
    retryBtn.visible = false;

    boxGroup.destroyEach();
    sawGroup.destroyEach();
    spikeGroup.destroyEach();

    boy.changeAnimation("running", boyRun);

    score = 0;

}