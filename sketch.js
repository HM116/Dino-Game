var PLAY = 1;
var END = 0;

var restart,gameover;
var restartimg,gameoverimg;

var checkpointsound,diesound,jumpsound;

var gamestate = PLAY;
var  trex, trex_running, trex_collided,cloudImage,cloudgroup;
var ground, invisibleGround, groundImage;
var obstacle1, obstacle2, obstacle3, obstacle4,obstacle5,obstacle6,obstaclegroup;
var score = 0;
var obstacle;




function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage=loadImage("cloud.png")
 obstacle1=loadImage("obstacle1.png");
 obstacle2=loadImage("obstacle2.png");
 obstacle3=loadImage("obstacle3.png");
 obstacle4=loadImage("obstacle4.png");
 obstacle5=loadImage("obstacle5.png");
 obstacle6=loadImage("obstacle6.png");
  
 restartimg=loadImage("restart.png");
 gameoverimg=loadImage("gameOver.png");

 checkpointsound=loadSound("checkpoint.mp3");
 diesound=loadSound("die.mp3");
 jumpsound=loadSound("jump.mp3");

}

function setup() {

  createCanvas(windowWidth,windowHeight)
  
  //create a trex sprite
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  //create a ground sprite
  ground = createSprite(width/2,height-50,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  //creating invisible ground
  invisibleGround = createSprite(width/2,height-40,width,10);
  invisibleGround.visible = false;

  gameover = createSprite(width/2,height/2);
  gameover.scale=3;
  gameover.addImage(gameoverimg)
  restart = createSprite(width/2,height/2+50);
  restart.scale=0.5;
  restart.addImage(restartimg);
  
  obstaclegroup = createGroup();
  cloudgroup = createGroup();
   
  trex.setCollider("circle",0,0,40);
  trex.debug = true
}

function draw() {
  //set background color
  background(180);


  text("Score :  "+ score,500,50);

  if(gamestate === PLAY){
    console.log(frameCount);

    restart.visible=false;
    gameover.visible=false;
    ground.velocityX = -(6 + 3*score/100);
  
   score = score + Math.round(getFrameRate()/60);

   if(score > 0 && score%100 === 0){
    
    checkpointsound.play();

   }
  
    if(keyDown("space")&& trex.y >= height-120 || touches.length > 0) {
      trex.velocityY = -10;
      touches = []; 
      jumpsound.play();
    }
    
    trex.velocityY = trex.velocityY + 0.8
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    
    
    
    spawnClouds();
    
    spawnObst();

    if(obstaclegroup.isTouching(trex)){

    gamestate = END;

    diesound.play();

    }

   
  }

  
  else if(gamestate === END){
    trex.changeAnimation("collided",trex_collided);

    ground.velocityX=0;
   
    obstaclegroup.setLifetimeEach(-1);
    cloudgroup.setLifetimeEach(-1);

   cloudgroup.setVelocityXEach(0);
   obstaclegroup.setVelocityXEach(0);
   restart.visible=true;
   gameover.visible=true;


   if(mousePressedOver(restart) || touches.length > 0){
    reset();
    touches = [];
   }


  }
  
  drawSprites();

  trex.collide(invisibleGround);

}

//function to spawn the clouds
function spawnClouds(){
 // write your code here 
 if(frameCount%60===0){
  
  cloud=createSprite(width,height-700,40,10);
  cloud.y=Math.round(random(250,300));
 cloud.velocityX=-3;
 cloud.scale=0.5;
 cloud.addImage(cloudImage);
 cloud.lifeTime=100;
 cloud.depth=trex.depth;
 trex.depth=trex.depth + 1;
 cloudgroup.add(cloud);
 }
}

function spawnObst(){
if(frameCount%60===0){
 obstacle = createSprite(width,height-60,20,30);
obstacle.velocityX=-(6 + 3*score/100);
var num=Math.round(random(1,6))
switch(num){
  case 1:obstacle.addImage(obstacle1);
      break;
  case 2:obstacle.addImage(obstacle2);
      break;
  case 3:obstacle.addImage(obstacle3);
      break;
  case 4:obstacle.addImage(obstacle4);
      break;
  case 5:obstacle.addImage(obstacle5);
      break;
  case 6:obstacle.addImage(obstacle6);
      break;
  default:break;


}
obstacle.scale=0.5;
obstacle.lifeTime=300;
obstaclegroup.add(obstacle);

}
}

function reset(){
  gamestate = PLAY;
  gameover.visible = false;
  restart.visible = false;
  obstaclegroup.destroyEach();
  cloudgroup.destroyEach();
  score = 0;
  
}