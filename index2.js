var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var playerHeight = 10;
var playerWidth = 10;
var playerX = (canvas.width-playerWidth)/2;
var enemyRadius = 25;
var fireRateMax = 10;
var fireNum = 0;
var spawnRate = 50;
var spawnTick = 0;
var score = 0;

var rightPressed = false;
var leftPressed = false;
var spacebarPressed = false;
var bulletRadius = 3;
var bullets = [];
var enemies = [];
var by = -4;
var ey = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.getElementById('myCanvas').style.background = "none"
document.getElementById('myCanvas').style.zIndex = 100;

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"
    ctx.fillText("Score: "+score, 8,20);
}
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
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    } else if (e.keyCode == 32) {
        spacebarPressed = false;
    }
}

function createBullet() {
    
    var bb = new Object();
    bb.x = playerX;
    bb.y = canvas.height - 5;
    bullets.push(bb)
}

function drawBullet(x,y) {
    ctx.beginPath();
    ctx.arc(x, y, bulletRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function createEnemy() {
    
    var enemy = new Object();
    enemy.x = Math.random()*canvas.width;
    
    enemy.rad = parseInt(Math.random()*50)+10;
    enemy.y = 0-(enemy.rad*2);
    enemy.health = 4;
    enemies.push(enemy)
}

function drawEnemy(x,y,rad) {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(playerX, canvas.height-playerHeight, playerWidth/2, 0, Math.PI*2);
   
    ctx.fillStyle = "#0095DD";
    ctx.fill();
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
                    enemies.splice(enI,1);
                }
                bullets.splice(bbI,1);                
            }
        })
        var dx = playerX - en.x;
        var dy = canvas.height-playerWidth/2 - en.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (en.rad + (playerWidth/2))) {
            console.log("dx:"+dx+", dy:"+dy+", enY:"+en.y+", dist:"+distance+", enR:"+en.rad+", pR:"+(playerWidth/2));
            alert("GAME OVER");
            document.location.reload();
        }
    })
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bullets.forEach(function(bb,index) {
        drawBullet(bb.x,bb.y);
        if(bb.y<-3) {
            bullets.splice(index,1)
        } else {
            bb.y += by;
        }
    })
    enemies.forEach(function(en, index) {
        drawEnemy(en.x,en.y,en.rad);
        if(en.y>canvas.height+(en.rad*2)) {
            enemies.splice(index,1)
        } else {
            en.y += ey;
        }
    })
    
    // console.log(bullets.length)

    // if(rightPressed && playerX < canvas.width-playerWidth) {
    //     playerX += 7;
    // }
    // else if(leftPressed && playerX > 0) {
    //     playerX -= 7;
    // } 
    drawPlayer();
    drawScore();
    collisionDetection();
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
    if(spawnTick >= spawnRate) {
        createEnemy();
        spawnTick = 0;
    }
    spawnTick += 1;
    requestAnimationFrame(draw);
}

draw();

