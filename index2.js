//canvas variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//player
var playerHeight = 10;
var playerWidth = 10;
var playerX = (canvas.width-playerWidth)/2;
//enemies
var enemies = [];
var ey = 3; //enemy base speed
var spawnRate = 50;
var spawnTick = 0;
var ryan = new Object;
var bossIntro = true;
//bullets
var fireRateMax = 10;
var fireNum = 0;
var bulletRadius = 3;
var bullets = [];
var by = -4; //bullet base speed

//game 
var score = 0;
var level = 1;
var levelUp = 2;


var imageObj = new Image();
var imageRyan = new Image();

//UI
var rightPressed = false;
var leftPressed = false;
var spacebarPressed = false;

//event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//key handlers
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    } else if (e.keyCode == 32) {
        spacebarPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    } else if(e.keyCode == 37) {
        leftPressed = false;
    } else if (e.keyCode == 32) {
        spacebarPressed = false;
    }
}

//canvas drawing handlers
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"
    ctx.fillText("Score: "+score, 8,20);
}

function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"
    ctx.fillText("Level: "+level, 8,40);
}

function drawBullet(x,y) {
    ctx.beginPath();
    ctx.arc(x, y, bulletRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawEnemy(x,y,rad, color) {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// function drawPlayer() {
//     ctx.beginPath();
//     ctx.arc(playerX, canvas.height-playerHeight, playerWidth/2, 0, Math.PI*2);
   
//     ctx.fillStyle = "#0095DD";
//     ctx.fill();
//     ctx.closePath();
// }

function drawPlayer() {
    ctx.beginPath();
    ctx.drawImage(imageObj, playerX, canvas.height-playerHeight);
    ctx.closePath();
}

//object creation functions
function createBullet() {
    var bb = new Object();
    bb.x = playerX+(playerWidth/1.2);
    bb.y = canvas.height - 5;
    bullets.push(bb)
}

function createEnemy() {
    var enemy = new Object();
    enemy.x = Math.random()*canvas.width;
    enemy.rad = parseInt(Math.random()*50)+10;
    enemy.y = 0-(enemy.rad*2);
    enemy.speed = parseInt(Math.random()*10)+1
    enemy.pan = parseInt(Math.random()*6)-3
    if(Math.random()<0.2) {
        enemy.health = 100;
        enemy.color = "#990000"
    } else {
        enemy.health = parseInt(Math.sqrt(enemy.rad));
        enemy.color = "#0095DD"
    }
    enemies.push(enemy)
}
function createRyan() {
    ryan.x = 100;
    ryan.rad = 140;
    ryan.y = 0-280;
    ryan.speed = 1;
    console.log('ryan created')
    
}
function drawRyan() {
    ctx.beginPath();
    ctx.drawImage(imageRyan, ryan.x, ryan.y);
    ctx.closePath();
}

function collisionDetection() {
    enemies.forEach(function(en, enI) {
        bullets.forEach(function(bb,bbI){    
            var dx = bb.x - en.x;
            var dy = bb.y - en.y;
            var distance = Math.sqrt(dx * dx + dy * dy);  
            if (distance < bulletRadius + en.rad) {
                en.health -= 1;
                if(en.health === 0) {
                    score++;
                    if(score > (level*levelUp)) {
                        level += 1;
                    }    
                    enemies.splice(enI,1);
                }
                bullets.splice(bbI,1);                
            }
        })
        var dx = playerX - en.x;
        var dy = canvas.height-playerWidth/2 - en.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (en.rad + (playerWidth/2))) {
            alert("GAME OVER");
            document.location.reload();
        }
    })
}

//game loop
function draw() {
    //clears canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //moves bullets
    bullets.forEach(function(bb,index) {
        drawBullet(bb.x,bb.y);
        if(bb.y<-3) {
            bullets.splice(index,1)
        } else {
            bb.y += by;
        }
    })
    //moves enemies
    if(level % 3 === 0) {
        if(bossIntro === true) {
            startBossOne();
            bossIntro = false;
        }
        drawRyan();
        ryan.y += ryan.speed;
        if(ryan.y > 10) {
            ryan.speed = 0;
        }
    } else {
        enemies.forEach(function(en, index) {
            drawEnemy(en.x,en.y,en.rad,en.color);
            if(en.y>canvas.height+(en.rad*2)) {
                enemies.splice(index,1)
            } else {
                en.y += en.speed+level;
                en.x += en.pan;
            }
        })
    }
    //draws game objects
    drawPlayer();
    drawScore();
    drawLevel();

    //checks collisions
    collisionDetection();

    //sets boundaries and firing trigger
    if(rightPressed && playerX < canvas.width-playerWidth) {
        playerX += 7;
    }
    else if(leftPressed && playerX > 0) {
        playerX -= 7;
    }
    if (spacebarPressed) {
        fireNum += 1;
        if(fireNum === fireRateMax) {
            createBullet();
            fireNum = 0;
        }
    }
    //spawns of enemies
    if(spawnTick >= spawnRate) {
        createEnemy();
        spawnTick = 0+level;
    }
    spawnTick += 1;

    //recalls draw function for loop
    requestAnimationFrame(draw);
}

function startBossOne() {
    imageRyan.onload = function() {
        ctx.drawImage(imageObj, 69, 50);
    };
    imageRyan.src = 'RYAN-280.png';
    console.log('ryan')
    createRyan();
}
//starts loop
function startGame() {
    

    imageObj.onload = function() {
        ctx.drawImage(imageObj, 69, 50);
    };
    imageObj.src = 'tri.png';
    document.getElementById("btn-wrapper").style.display = "none";
    draw();
}


