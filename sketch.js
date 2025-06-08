let startBlock = [80, 580, 140, 20];
//524
let slappyArray = [106, 524, 64, 55];
let slappyVel = [0,0];

let poles = [
                
                [260, 540, 40, 500],
                [380, 540, 40, 500],
                [500, 540, 40, 500],
                [620, 540, 40, 500],
                [740, 540, 40, 500],
                [860, 540, 40, 500],
                [980, 540, 40, 500],
                [1100, 540, 40, 500],

            ];
                
let spikesArray = [
    
                [poles[0][0] + 60, 750, 40, 700],
                [poles[1][0] + 60, 750, 40, 700],
                [poles[2][0] + 60, 750, 40, 700],
                [poles[3][0] + 60, 750, 40, 700],
                [poles[4][0] + 60, 750, 40, 700],
                [poles[5][0] + 60, 750, 40, 700],
                [poles[6][0] + 60, 750, 40, 700],
                [poles[7][0] + 60, 750, 40, 700],
  
            ];

//ints 
let gravity = 6;
let speed = 3;
let jumpHeight = 0;
let jumpStart = 0;
let speedUp = 0;
let backMovementSpeed = 1;
let previousPole = 0;
let spikeUpNum = 0;
let lives = 5;
let lastBadPoleIndex = 0;
let phaseNum = 1;
let timePassed = 0;

const left = 37;
const right = 39;
const space = 32;

//strings
let startMove = "no";
let jumpString = "no";
let collideMarker = "fall";
let noDoubleJump = "on";
let phase = "title";
let spikePresent = "no";
let spikeUp = "stop";
let subtractOnce = "no";
let thinnerPoles = "yes";
let redScreen = "off";
let gameLevel = "none";

let grass;
let myOrange;
let slappy;

function setup()
{
    grass = color(0, 215, 107);
    myOrange = color(255, 115, 0);
    slappy = color(252, 223, 116);
    createCanvas(800, 600);
    angleMode(DEGREES);
}

function draw()
{
    background(0);
    if (phase === "title")
    {
        background(0)
        textSize(80)
        fill(255)
        text("SLAPPY BIRD", 135, 125);
        textSize(20)
        text("press space to continue", 295, 500);
        slappyArray[0] = 370;
        slappyArray[1] = 270;
        drawPlayer(slappyArray);
        slappyArray[0] = 106;
        slappyArray[1] = 524;
    
    }
    else if(phase === "start screen")
    {
        fill(0)
        rect(0, 0, 800, 600)
        fill(255)
        text("✦ Use space bar to jump", 100, 200)
        text("✦ Arrow keys to move", 100, 240)
        text("✦ Don't hit the spikes!", 100, 280)
        text("✦ Make it to the end", 100, 320)
        text("choose your level: ", 480, 160)
        rect(420, 220, 100, 40);
        rect(600, 220, 100, 40);
        fill(0)
        text("beginner", 435, 245);
        text("advanced", 610, 245);

    }
    else if(phase === "start")
    {
        poleGen();
        phase = "first world";
    }
    else if(phase === "first world")
    {
        //drawing
        fill(grass);
        rect(startBlock[0], startBlock[1], startBlock[2], startBlock[3]);
        drawPlayer(slappyArray);
        poleDraw();
        drawTopBar();
        
        //boundaries, falling
        gravityMod();
        stopFall(slappyArray, startBlock);
        for(let i = 0; i < poles.length; i++)
        {
            stopFall(slappyArray, poles[i]);
        }
        for(let i = 0; i < spikesArray.length; i++)
        {
            stopFall(slappyArray, spikesArray[i]);
        }
        
        for(let i = 0; i < poles.length; i++)
        {
            exceedBoundaries(slappyArray, poles[i]);
        }
        for(let i = 0; i < spikesArray.length; i++)
        {
            exceedBoundaries(slappyArray, spikesArray[i]);
        }
        exceedBoundaries(slappyArray, startBlock);
        
        for(let i = 0; i < poles.length; i++)
        {
            noWallPass(slappyArray, poles[i]);
        }
        for(let i = 0; i < spikesArray.length; i++)
        {
            noWallPass(slappyArray, spikesArray[i]);
        }
        noWallPass(slappyArray, startBlock);
        
        
        slappyOnPole();
        movement();
        poleLoop();
        spikesRandomUp();
        spikeCollision();
        loseCheck();
        winCheck();
        thinPoles();
        phaseChecker();
        
        
        //movement
        jump();
        moveX();
        
    }
    else if (phase === "lose")
    {
        fill(0);
        rect(0, 0, 800, 600);
        textSize(100)
        fill(255);
        text("YOU LOST", 150, 125);
        textSize(20)
        text("press 'y' to play again", 310, 160);
        
        textSize(17)
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 120, 180);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠟⠉⠀⠙⢷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 120, 200);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠇⠀⠀⠀⠀⠀⠹⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 120, 220);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡟⠀⠀⠀⠀⠀⠀⠀⢹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 120, 240);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣁⣤⣤⡤⠤⠤⠤⢤⣼⣷⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 120, 260);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡞⠉⠉⠀⢀⣀⣀⣀⣀⡀⠀⠀⠀⠙⢷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 120, 280);
        text("⠀⠀⠀⢠⡴⠒⢶⣄⣤⣀⣀⣀⡀⠀⠀⠀⣸⣧⠶⠞⠛⠉⠉⠉⠉⠉⠙⠛⠳⢦⣤⣼⠃⠀⠀⠀⠀⢀⣀⠀⢀⣀⡀⠀⠀⠀", 120, 300);
        text("⠀⠀⢠⡟⠀⠀⠀⠉⠉⠙⠉⠉⢻⢀⣤⠞⠋⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠈⠙⢷⣄⠀⠀⢰⡟⠙⣿⠟⠉⠻⣆⠀⠀", 120, 320);
        text("⠀⣠⠾⢷⡄⠀⠀⠀⠀⠀⠀⠀⣸⡟⠁⠀⢠⠋⢧⡀⠀⠀⠀⠀⠀⠀⠀⣰⠋⢳⡀⠀⠀⠙⣷⡴⠟⠃⠀⠀⠀⠀⢀⣿⠀⠀", 120, 340);
        text("⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⣴⠟⠋⠁⠀⠀⠘⢂⣈⣁⠀⠀⠀⠀⠀⠀⠀⣋⣉⣛⢃⠀⠀⠀⣿⡄⠀⠀⠀⠀⠀⠀⠛⠛⢻⣄", 120, 360);
        text("⠸⣧⣀⠀⠀⠀⠀⠀⠀⢠⣿⠀⠀⠀⠀⠀⢾⢻⣷⡟⢳⠀⠀⠀⠀⠀⣼⢻⣿⠟⡟⠀⠀⠀⢹⡷⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿", 120, 380);
        text("⠀⢸⡃⠀⠀⠀⠀⠀⠀⠀⢹⣧⠖⠚⠒⢄⠘⢷⣤⡴⠟⣣⡤⠤⣤⣄⠿⢦⣥⡴⢣⠖⠉⠑⢺⡷⣦⡄⠀⠀⠀⠀⢀⣠⡾⠃", 120, 400);
        text("⠀⠈⠛⣶⠆⠀⠀⠀⠀⠰⣿⡇⠀⠀⠀⢈⠀⠀⠀⡴⠋⠁⠀⠀⠀⠈⠻⣦⠀⠀⢦⠀⠀⠀⠀⣿⣟⠀⠀⠀⠀⠀⠀⠈⣿⠀", 120, 420);
        text("⠀⠀⠀⢻⣄⣠⡀⠀⠀⢀⣾⠙⠦⠤⢤⣮⣤⣄⢰⠁⠀⠀⠀⠀⠀⠀⠀⢸⡆⢀⣈⣶⣤⠤⠊⠀⢹⡇⠀⠀⢀⣀⣠⡴⠟⠀", 120, 440);
        text("⠀⠀⠀⠀⠈⠙⠳⠦⠶⠿⣇⠀⠀⠀⡞⣡⠀⠈⠻⡄⠀⠀⠀⠀⠀⠀⠀⢸⡷⠛⢱⣄⠹⡆⠀⠀⠈⣿⠶⠶⠛⠉⠉⠀⠀⠀", 120, 460);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄⠀⠀⣇⠘⢧⡀⠀⠳⣄⡀⠀⠀⠀⢀⣴⠏⠀⣠⠞⠁⢸⠇⠀⠀⢰⠏⠀⠀⠀⠀⠀⠀⠀⠀", 120, 480);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⡄⠀⠙⣦⡀⠻⢦⣀⠀⠉⠓⠒⠛⠉⢀⣠⠞⠁⠀⣰⠏⠀⠀⣠⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀", 120, 500);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣆⠀⠈⠳⣤⡀⠈⠙⠓⠒⠒⠒⠚⠉⠀⢀⣴⠞⠁⠀⢀⣴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 120, 520);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣦⡀⠀⠙⠳⢤⣀⣀⣀⣀⣠⡴⠞⠋⠀⠀⣀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 120, 540);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠳⢦⣤⣀⣀⣉⠉⠁⣀⣀⣀⣤⡶⠞⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 120, 560);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠙⠛⠛⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 120, 580);
    }
    else if (phase === "win")
    {
        fill(0);
        rect(0, 0, 800, 600);
        textSize(100);
        fill(255);
        text("YOU WIN", 180, 125);
        textSize(20);
        text("press 'y' to play again", 305, 160);
        textSize(17);

        text("⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠀⠀", 220, 200);
        text("⢠⣤⣤⣤⣼⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣄⣤⣤⣠", 220, 220);
        text("⢸⠀⡶⠶⠾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡷⠶⠶⡆⡼", 220, 240);
        text("⠈⡇⢷⠀⠀⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠇⠀⢸⢁⡗", 220, 260);
        text("⠀⢹⡘⡆⠀⢹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡸⠀⢀⡏⡼⠀", 220, 280);
        text("⠀⠀⢳⡙⣆⠈⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠇⢀⠞⡼⠁⠀", 220, 300);
        text("⠀⠀⠀⠙⣌⠳⣼⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣞⡴⣫⠞⠀⠀⠀", 220, 320);
        text("⠀⠀⠀⠀⠈⠓⢮⣻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⣩⠞⠉⠀⠀⠀⠀", 220, 340);
        text("⠀⠀⠀⠀⠀⠀⠀⠉⠛⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠞⠋⠁⠀⠀⠀⠀⠀⠀", 220, 360);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⢤⣀⠀⠀⠀⠀⢀⣠⠖⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀", 220, 380);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⡇⢸⡏⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 220, 400);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 220, 420);
        text("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠖⠒⠓⠚⠓⠒⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", 220, 440);
        text("⠀⠀⠀⠀⠀⠀⠀⣀⣠⣞⣉⣉⣉⣉⣉⣉⣉⣉⣉⣉⣙⣆⣀⡀⠀⠀⠀⠀⠀⠀", 220, 460);
        text("⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀", 220, 480);
        text("⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀", 220, 500);
        text("⠀⠀⠀⠀⠀⠀⠀⠓⠲⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠖⠃⠀⠀⠀⠀⠀⠀", 220, 520);
    }
    else if (phase === "level screen")
    {
        fill(0);
        rect(0,0, 800, 600);
        fill(255);
        textSize(20)
        text("choose your level: ", 320, 160);
        rect(260, 220, 100, 40);
        rect(440, 220, 100, 40);
        fill(0);
        textSize(18)
        text("beginner", 275, 245);
        text("advanced", 450, 245);
        
    }
}


function keyPressed() 
{
    if (phase === "title" && keyCode === space) 
    {
        phase = "start screen";
    }

    if ((phase === "lose" || phase === "win") && keyCode === 89)
    {
        phase = "level screen";
        lives = 5;
        originalVals();
    }
    if(phase === "first world" && keyCode === space && jumpString === "no" && noDoubleJump === "off")
    {
        jumpString = "yes";
        gravity *= -1;
        jumpStart = slappyArray[1] + slappyArray[3];
        jumpHeight = jumpStart + 150;
        collideMarker = "fall";
        noDoubleJump = "on";
    }
}

function mousePressed()
{
    if(phase === "start screen")
    {
        if ((mouseX > 420 && mouseX < 520 && mouseY > 220 && mouseY < 260))
        {
            gameLevel = "beginner";
            phase = "start";
        }
        else if (mouseX > 600 && mouseX < 700 && mouseY > 220 && mouseY < 260)
        {
            gameLevel = "advanced";
            phase = "start";
        }

    }
    else if (phase === "level screen")
    {
        if (mouseX > 260 && mouseX < 360 && mouseY > 220 && mouseY < 260)
        {
            gameLevel = "beginner";
            phase = "start";
        }
        else if (mouseX > 440 && mouseX < 540 && mouseY > 220 && mouseY < 260)
        {
            gameLevel = "advanced";
            phase = "start";
        }
    }
}

function originalVals()
{
    startBlock = [80, 580, 140, 20];
    //524
    slappyArray = [106, 524, 64, 55];
    slappyVel = [0,0];

    poles = [
            
            [260, 540, 40, 500],
            [380, 540, 40, 500],
            [500, 540, 40, 500],
            [620, 540, 40, 500],
            [740, 540, 40, 500],
            [860, 540, 40, 500],
            [980, 540, 40, 500],
            [1100, 540, 40, 500],

        ];
                    
    spikesArray = [

            [poles[0][0] + 60, 750, 40, 700],
            [poles[1][0] + 60, 750, 40, 700],
            [poles[2][0] + 60, 750, 40, 700],
            [poles[3][0] + 60, 750, 40, 700],
            [poles[4][0] + 60, 750, 40, 700],
            [poles[5][0] + 60, 750, 40, 700],
            [poles[6][0] + 60, 750, 40, 700],
            [poles[7][0] + 60, 750, 40, 700],

        ];

    //ints 
    gravity = 6;
    speed = 3;
    jumpHeight = 0;
    jumpStart = 0;
    speedUp = 0;
    backMovementSpeed = 1;
    previousPole = 0;
    spikeUpNum = 0;
    lives = 5;
    lastBadPoleIndex = 0;
    phaseNum = 1;
    timePassed = 0;

    //strings
    startMove = "no";
    jumpString = "no";
    collideMarker = "fall";
    noDoubleJump = "on";
    phase = "title";
    spikePresent = "no";
    spikeUp = "stop";
    subtractOnce = "no";
    thinnerPoles = "yes";
    redScreen = "off";
    gameLevel = "none";

}

function drawPlayer(arr)
{
    push(); // Save current drawing state

  fill(myOrange);
  strokeWeight(2);
  line(arr[0] + 24, arr[1] + 48, arr[0] + 24, arr[1] + 55);
  line(arr[0] + 37, arr[1] + 48, arr[0] + 37, arr[1] + 55);

  fill(slappy);
  ellipse(arr[0] + 14, arr[1] + 8, 40, 40);

  push();
  translate(arr[0] + 34, arr[1] + 28);
  rotate(radians(60));
  ellipse(1, 22, 20, 10);
  pop();

  push();
  translate(arr[0] + 34, arr[1] + 28);
  rotate(radians(20));
  ellipse(1, 18, 20, 10);
  pop();

  push();
  translate(arr[0] + 34, arr[1] + 28);
  rotate(radians(0));
  ellipse(1, 21, 20, 10);
  ellipse(1, 31, 20, 10);
  pop();

  push();
  translate(arr[0] + 34, arr[1] + 28);
  rotate(radians(-20));
  ellipse(3, 34, 20, 10);
  pop();

  push();
  translate(arr[0] + 34, arr[1] + 28);
  rotate(radians(20));
  fill(255);
  ellipse(-8, -14, 20, 20); // white of eye
  fill(0);
  ellipse(-1, -7, 6, 6); // pupil
  pop();

  fill(myOrange);
  ellipse(arr[0] + 46, arr[1] + 25, 18, 8); // beak

  pop(); // Restore drawing state

}

function drawTopBar()
{
    textSize(20)
    fill(255)
    if (gameLevel === "beginner")
        {
            text("Phase: " + phaseNum + "/4", 40, 60); 
        }
        else if(gameLevel === "advanced")
        {
            text("Phase: " + phaseNum + "/5", 40, 60); 
        }
        text("♥ " + lives, 40, 90);
}

function gravityMod()
{
    slappyArray[1] += slappyVel[1];
}

function moveX()
{
    slappyVel[0] = speed;
    if(keyIsDown(right))
    {
        slappyArray[0] += slappyVel[0];
    }
    if (keyIsDown(left))
    {
        slappyArray[0] -= slappyVel[0];
    }

}

function jump()
{
    if(jumpStart > jumpHeight)
    {
        gravity *= -1;
        jumpHeight = 0;
        jumpStart = 0;
        jumpString = "no";
    }
    if(jumpString === "yes")
    {
        jumpStart += 10;
    }
    if (collideMarker === "fall")
    {
        slappyVel[1] = gravity;
    }
}

function poleDraw()
{
    fill(grass);
    for(let i = 0; i < poles.length; i++)
    {
        rect(poles[i][0], poles[i][1], poles[i][2], poles[i][3]);
    }
    fill('red');
    for (let i = 0; i < spikesArray.length; i++)
    {
        rect(spikesArray[i][0], spikesArray[i][1], spikesArray[i][2], spikesArray[i][3]);
        
        beginShape();
        vertex(spikesArray[i][0], spikesArray[i][1]);
        vertex(spikesArray[i][0], spikesArray[i][1] - 20);
        vertex(spikesArray[i][0] + 10, spikesArray[i][1]);
        vertex(spikesArray[i][0] + 20, spikesArray[i][1] - 20);
        vertex(spikesArray[i][0] + 30, spikesArray[i][1]);
        vertex(spikesArray[i][0] + 40, spikesArray[i][1] - 20);
        vertex(spikesArray[i][0] + 40, spikesArray[i][1]);
        endShape();
    }

}

function poleGen()
{
    for(let i = 0; i < poles.length; i++)
    {
        if(i == 0)
        {
            previousPole = 580;
        }
        else
        {
            previousPole = poles[i-1][1];
        }
        let highOrLow = floor(random(1, 4));
        if((highOrLow == 1  || highOrLow == 2)&& poles[i][1] > 100)
        {
            poles[i][1] = (previousPole - 40);

            if (poles[i][1] <= 100)
            {
                poles[i][1] = (previousPole + 40);
            }
        }
        else if((highOrLow == 3) && poles[i][1] < 580)
        {
            poles[i][1] = (previousPole + 40);
                
            if (poles[i][1] >= 560)
            {
                poles[i][1] = (previousPole - 40);
            }
        }
    }
}

function poleLoop()
{
for(let i = 0; i < poles.length; i++)
    {
        if(poles[i][0] + poles[i][2] < 0)
        {
            if(i == 0)
            {
                previousPole = poles[poles.length-1][1];
            }
            else
            {
                previousPole = poles[i-1][1];
            }
            poles[i][0] = 919;
            speedUp += 1;
            let highOrLow = floor(random(1, 4));
            if((highOrLow == 1  || highOrLow == 2)&& poles[i][1] > 100)
            {
                poles[i][1] = (previousPole - 40);
                if (poles[i][1] <= 100)
                {
                    poles[i][1] = (previousPole + 40);
                }
            }
            else if((highOrLow == 3) && poles[i][1] < 580)
            {
                poles[i][1] = (previousPole + 40);
                if (poles[i][1] >= 560)
                {
                    poles[i][1] = (previousPole - 40);
                }
            }
        }
    }
    for(let i = 0; i < spikesArray.length; i++)
    {            
        if(spikesArray[i][0] + spikesArray[i][2] < 0)
        {
            if(gameLevel === "beginner")
            {
                if(speedUp > 8)
                {
                    spikesArray[i][0] = 909;
                }
                else
                {
                    spikesArray[i][0] = 919;
                }
            }
            else if(gameLevel === "advanced")
            {
                if(speedUp > 20)
                {
                    spikesArray[i][0] = 899;
                }
                else
                {
                    spikesArray[i][0] = 919;
                }
            }
        }
    }
}

function phaseChecker()
{
    if(gameLevel === "beginner")
    {
        if(speedUp < 3)
        {
            phaseNum = 1;
        }
        else if (speedUp < 8)
        {
            phaseNum = 2;
        }
        else if (speedUp < 20)
        {
            phaseNum = 3;
        }
        else if (speedUp < 30)
        {
            phaseNum = 4;
        }
    }
    else if(gameLevel === "advanced")
    {
        if(speedUp < 2)
        {
            phaseNum = 1;
        }
        else if (speedUp < 8)
        {
            phaseNum = 2;
        }
        else if (speedUp < 20)
        {
            phaseNum = 3;
        }
        else if (speedUp < 30)
        {
            phaseNum = 4;
        }
        else if (speedUp < 40)
        {
            phaseNum = 5;
        }
    }
}

function movement()
{
    if(startMove === "yes")
    {
        if(gameLevel === "beginner")
        {
            if (speedUp < 3)
            {
                backMovementSpeed = 1;
            }
            else
            {
                backMovementSpeed = 2;
            }
        }
        if(gameLevel === "advanced")
        {
            if (speedUp < 2)
            {
                backMovementSpeed = 1;
            }
            else if (speedUp < 8)
            {
                backMovementSpeed = 2;  
            }
            else
            {
                backMovementSpeed = 3;
            }
        }
        for(let i = 0; i < poles.length; i++)
        {
            poles[i][0] -= backMovementSpeed;
        }
        for(let i = 0; i < spikesArray.length; i++)
        {
            spikesArray[i][0] -= backMovementSpeed;
        }
        startBlock[0] -= backMovementSpeed;
        
        if(slappyOnPole())
        {
            slappyArray[0] -= backMovementSpeed;
        }
    }
}

function thinPoles()
{
    if(gameLevel === "beginner")
    {
        if(speedUp > 8)
        {
            for(let i = 0; i < poles.length; i++)
            {
                poles[i][2] = 30;
            }
            if (thinnerPoles === "yes")
            {
                for(let k = 0; k < spikesArray.length; k++)
                {
                    spikesArray[k][0] -= 5;
                } 
                thinnerPoles = "no";
            }
        }
    }
    if(gameLevel === "advanced")
    {
        if(speedUp > 20)
        {
            for(let i = 0; i < poles.length; i++)
            {
                poles[i][2] = 20;
            }
            if (thinnerPoles === "yes")
            {
                for(let k = 0; k < spikesArray.length; k++)
                {
                    spikesArray[k][0] -= 10;
                } 
                thinnerPoles = "no";
            }
        }
    }
}

function spikesRandomUp()
{
    if ((gameLevel === "advanced" && speedUp > 30) || (gameLevel === "beginner" && speedUp > 20) && spikeUp === "stop")
    {
        let spikeGen = floor(random(1, 7));
        for(let i = 0; i < poles.length; i++)
        {
            if(poles[i][0] > ((slappyArray[0] + slappyArray[2])-200) && poles[i][0] < 800)
            {
                if(i + 1 == spikeGen)
                {
                    spikeUp = "start";
                    spikeUpNum = i;
                }
            }
        }
    }

    if(spikeUp === "start")
    {
        if(gameLevel === "beginner")
        {
            if(spikesArray[spikeUpNum][1] > 40)
            {
                spikesArray[spikeUpNum][1] -= 10; 
            }
            else 
            {
                spikeUp = "down";
            }
        }
        else if(gameLevel === "advanced")
        {
            if(spikesArray[spikeUpNum][1] > 40)
            {
                spikesArray[spikeUpNum][1] -= 25; 
            }
            else 
            {
                spikeUp = "down";
            }
        }
    }
    else if(spikeUp === "down")
    {
        if(gameLevel === "beginner")
        {
            if(spikesArray[spikeUpNum][1] < 700)
            {
                spikesArray[spikeUpNum][1] += 10; 
            }
            else 
            {
                spikeUp = "stop";
            }
        }
        else if(gameLevel === "advanced")
        {
            if(spikesArray[spikeUpNum][1] < 700)
            {
                spikesArray[spikeUpNum][1] += 25; 
            }
            else 
            {
                spikeUp = "stop";
            }
        }
    }
}

function slappyOnPole()
{
    let yesOrNo = false;
    for(let i = 0; i < poles.length; i++)
    {   
        if(slappyArray[0] + slappyArray[2] >= poles[i][0] && 
        slappyArray[0] < poles[i][0] + poles[i][2]     &&
        slappyArray[1] + slappyArray[3] >= poles[i][1] - 5)
        {
            yesOrNo = true;
        }
    }
    return yesOrNo;
}

function stopFall(thing1, thing2)
{
    if(collide(thing1, thing2))
    {
        thing1[1] -= slappyVel[1];
        slappyVel[1] = 0;
        collideMarker = "stop";
        noDoubleJump = "off";
    }
    else if (jumpString === "no" && collideMarker === "go")
    {
        gravity = 6;
    }
}

function noWallPass(thing1, thing2)
{
    if (collide(thing1, thing2))
    {
        thing1[0] -= 8;
        slappyVel[0] = 0;
    }
}

function exceedBoundaries(thing1, thing2)
{
    if(thing1[0] + thing1[2] < thing2[0] || thing1[0] > thing2[0] + thing2[2])
    {
        collideMarker = "fall";
    }
    if(slappyArray[0] > startBlock[0] + startBlock[2])
    {
        startMove = "yes";
    }
}

function spikeCollision()
{
    for(let k = 0; k < spikesArray.length; k++)
    {
        if(subtractOnce === "no" && collide(slappyArray, spikesArray[k]))
        {
            for(let i = 0; i < spikesArray.length; i++)
            {
                if(!(slappyArray[0] + slappyArray[2] < spikesArray[i][0] || slappyArray[0] > spikesArray[i][0] + spikesArray[i][2]))
                {
                    subtractOnce = "yes";
                    lastBadPoleIndex = i;
                    lives -= 1;
                    redScreen = "on";
                }
            }
        }
    }
    if(subtractOnce === "yes" && (slappyArray[0] + slappyArray[2] < spikesArray[lastBadPoleIndex][0] || slappyArray[0] > spikesArray[lastBadPoleIndex][0] + spikesArray[lastBadPoleIndex][2]))
    {
        subtractOnce = "no";
    } 
    if(redScreen === "on")
    {
        timePassed += 1;
        if (timePassed < 15)
        {
            fill(color(255, 0, 0, 100));
            rect(0, 0, 800, 600);
            fill('red');
            text("♥ " + lives, 40, 90);
        }
        else
        {
            timePassed = 0;
            redScreen = "off";
        }
    }
    if(lives <= 3)
    {
        fill('red');
        text("♥ " + lives, 40, 90);
    }
}

function loseCheck()
{
    if(slappyArray[0] + slappyArray[2] < -20 || lives <= 0 || slappyArray[1] > 610)
    {
        phase = "lose";
    }
}

function winCheck()
{
    if(gameLevel === "beginner")
    {
        if(speedUp >= 50)
        {
            phase = "win";
        }
    }
    else if(gameLevel === "advanced")
    {
        if(speedUp >= 50)
        {
            phase = "win";
        }
    }
}

function noSticking(thing1, thing2)
{
    if (noStickingBool(thing1, thing2))
    {
        slappyVel[1] = 3;
        gravity = 6;
    }
}

function noStickingBool(thing1, thing2)
{
    if( (thing1[0] + thing1[2] < thing2[0] || 
        thing1[1] + thing1[3] < thing2[1] || 
        thing1[0] > thing2[0] + thing2[2] ))
    {
        return false;
    }
    else
    {
        return true;
    }
}

function collide(thing1, thing2)
{
    if(thing1[0]+thing1[2] <= thing2[0]           ||
        thing1[0]           >= thing2[0]+thing2[2] ||
        thing1[1]+thing1[3] <= thing2[1]           ||
        thing1[1]           >= thing2[1]+thing2[3])
    {
        return false;
    }
    else
    {
        return true;
    }
    
}