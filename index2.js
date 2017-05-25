var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var playerHeight = 10;
var playerWidth = 10;
var playerX = (canvas.width-playerWidth)/2;
var bulletRadius = 3;
var fireRateMax = 10;
var fireNum = 0;

var rightPressed = false;
var leftPressed = false;
var spacebarPressed = false;
var bullets = [];
var by = -4;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.getElementById('myCanvas').style.background = "none"
document.getElementById('myCanvas').style.zIndex = 100;

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
    console.log("create bullet")
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

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(playerX, canvas.height-playerHeight, playerWidth, playerHeight);
   
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
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
    // console.log(bullets.length)

    // if(rightPressed && playerX < canvas.width-playerWidth) {
    //     playerX += 7;
    // }
    // else if(leftPressed && playerX > 0) {
    //     playerX -= 7;
    // } 
    drawPlayer();
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
    requestAnimationFrame(draw);
}

draw();

