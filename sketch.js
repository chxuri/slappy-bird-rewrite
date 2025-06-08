const startBlock = [80, 580, 140, 20];
//524
const slappyArray = [106, 524, 64, 55];
const slappyVel = [0,0];

const poles = [
                
                [260, 540, 40, 500],
                [380, 540, 40, 500],
                [500, 540, 40, 500],
                [620, 540, 40, 500],
                [740, 540, 40, 500],
                [860, 540, 40, 500],
                [980, 540, 40, 500],
                [1100, 540, 40, 500],

            ];
                
const spikesArray = [
    
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
let jump = "no";
let collideMarker = "fall";
let noDoubleJump = "on";
let phase = "title";
let spikePresent = "no";
let spikeUp = "stop";
let subtractOnce = "no";
let thinnerPoles = "yes";
let redScreen = "off";
let gameLevel = "none";

//colors
let grass = color(0, 215, 107);
let orange1 = color(255, 115, 0);
let slappy = color(252, 223, 116);

function draw()
{
    if (phase === "title")
    {
        createCanvas(800, 600)
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


function keyPressed() {
  if (phase === "title" && keyCode == space) {
    phase = "start screen";
  }
  if ((phase === "lose" || phase === "win") && keyCode == 89)
  {
    phase = "level screen";
    lives = 5;
    originalVals();
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
    if (phase === "level screen")
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
