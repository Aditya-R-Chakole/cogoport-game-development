let canvasSize = [800, 600];

class Ball{
    constructor(){
        this.x = 400;
        this.y = 400;
        this.r = 10;
        this.maxSpeed = 7.5;
        this.minSpeed = 2.5;
        this.vx = Math.floor(Math.random()*this.maxSpeed) + this.minSpeed; 
        this.vy = Math.floor(Math.random()*this.maxSpeed) + this.minSpeed; 
        this.lives = 3;
        this.score = 0;
    }

    move(){
        this.x += this.vx;
        this.y += this.vy;

        if( (this.y+this.r) >= canvasSize[1] ) this.lives--;

        if( (this.x+this.r)>=canvasSize[0] || (this.x-this.r)<=0 ) this.vx *= (-1);
        if( (this.y+this.r)>=canvasSize[1] || (this.y-this.r)<=0 ) this.vy *= (-1);
    }

    show(){
        circle(this.x, this.y, this.r);
    }
}

class Brick{
    constructor(){
        this.width = 150;
        this.height = 15;
        this.marginBottom = 50;
        this.x = (canvasSize[0] - this.width)/2;
        this.y = canvasSize[1] - this.height - this.marginBottom;
        this.vx = 10;
    }

    hitByBall(ball){
        if( (ball.x>=this.x) && (ball.x<=(this.x+this.width)) && 
            ((ball.y-ball.r)<=(this.y+this.height) && (ball.y+ball.r)>=this.y) ) ball.vy *= -1;
    
        if( (ball.y>=this.y) && (ball.y<=(this.y+this.height)) &&
            ((ball.x-ball.r)<=(this.x+this.width) && (ball.x+ball.r)>=this.x) ) ball.vx *= -1;
    }

    move(dir){
        this.x += (dir*this.vx);
        if(this.x <= 0) this.x=0;
        if((this.x+this.width)>=canvasSize[0]) this.x = canvasSize[0]-this.width;
    }

    show(){
        rect(this.x, this.y, this.width, this.height );
    }
}

class Obstacle{
    constructor(x, y){
        this.width = 25;
        this.height = 25;
        this.x = x;
        this.y = y;
        this.opacity = 1;
        this.paddingX = 5.2;
        this.paddingY = 5;
        this.NextBoxX = this.x + this.width  + this.paddingX;
        this.NextBoxY = this.y + this.height + this.paddingY
    }

    hitByBall(ball){
        if(!this.opacity) return ;
        if( (ball.x>=this.x) && (ball.x<=(this.x+this.width)) && 
            ((ball.y-ball.r)<=(this.y+this.height) && (ball.y+ball.r)>=this.y) ) {
                ball.vy *= -1;
                ball.score++;
                this.opacity = 0;
        }
    
        if( (ball.y>=this.y) && (ball.y<=(this.y+this.height)) &&
            ((ball.x-ball.r)<=(this.x+this.width) && (ball.x+ball.r)>=this.x) ) {
                ball.vx *= -1;
                ball.score++;
                this.opacity = 0;
        }
    }

    show(){
        if(this.opacity) rect(this.x, this.y, this.width, this.height );
    }
}

// App
let ball  = new Ball();
let brick = new Brick();
let obstacles = [[]];

function setup(){
    createCanvas(canvasSize[0], canvasSize[1]);

    let obstacle = new Obstacle(25, 25);
    obstacles[0].push(obstacle);
    for(let i=1; i<25; i++){
        let newObstacle = new Obstacle(obstacles[0][i-1].NextBoxX, obstacles[0][i-1].y);
        obstacles[0].push(newObstacle);
    }
    
    for(let j=1; j<8; j++){
        let newObstacle = new Obstacle(obstacles[j-1][0].x, obstacles[j-1][0].NextBoxY);
        let newRow = [newObstacle];
        obstacles.push(newRow);
        for(let i=1; i<25; i++){
            let newObstacle = new Obstacle(obstacles[j][i-1].NextBoxX, obstacles[j][i-1].y);
            obstacles[j].push(newObstacle);
        }
    }
}

function draw(){
    if(keyIsDown(LEFT_ARROW)) brick.move(-1);
    if(keyIsDown(RIGHT_ARROW)) brick.move(1);

    if( ball.lives <= 0 ){
        ball.lives = 3;
        ball.score = 0;
        for(let i=0; i<obstacles.length; i++){
            for(let j=0; j<obstacles[i].length; j++){
                obstacles[i][j].opacity = 1;
            }
        }
        window.alert('Game Over !!! \nRestarting the game...');
    }

    background(100);
    for(let i=0; i<obstacles.length; i++){
        for(let j=0; j<obstacles[i].length; j++){
            obstacles[i][j].hitByBall(ball);
            obstacles[i][j].show();
        }
    }

    brick.hitByBall(ball);
    brick.show();
    ball.move();
    ball.show();

    fill(255);
    textSize(25);
    text('Lives Left => ' + ball.lives, 10, canvasSize[1]-10);
    text('Score => ' + ball.score, canvasSize[0]-140, canvasSize[1]-10);
}