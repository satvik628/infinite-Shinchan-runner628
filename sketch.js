var PLAY = 1;
var END = 0;
var gameState = PLAY;



var shinchan, shinchan_running, shinchan_collided,shinchan_swimming;
var bg1, invisibleGround, bg2 ,bg3,bg4,bg5;
var bg;
var b_low,b_full;


var cloudsGroup, cloudImage;
var  obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4,obstacle5;
var backgroundImg
var score;
var jumpSound, collidedSound;
var coin;
var coin_image;
var chocochip;
var points;
var explo_music , back_music , wave_music;
var won;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")
  
  /*backgroundImg = loadImage("assets/backgroundImg.png")
  sunAnimation = loadImage("assets/sun.png");*/
  
  shinchan_running = loadImage("images/3d left shinchan.png");
  shinchan_collided = loadImage("images/explosion.png");
  bg5=loadImage("images/welcome.jpg")
  shinchan_swimming=loadImage("images/swimming shinchan.png");

  back_music = loadSound("sound/music back.mp3");
  explo_music = loadSound("sound/Explosion.mp3")
  wave_music = loadSound("sound/waves.mp3");
  b_full = loadSound("sound/Battery Charged.mp3");
  b_low = loadSound("sound/low-battery-sound.mp3");
  
  bg1 = loadImage("images/city.jpg");
  bg2=loadImage("images/desert.jpg")
  bg3=loadImage("images/pool.jpg");
  bg4=loadImage("images/1 (1).jpg");
  won=loadImage("images/won.jpg");

  
  cloudImage = loadImage("assets/cloud.png");
  
  obstacle1 = loadImage("images/villian.png");
 
 obstacle2 = loadImage("images/evil.png");
  obstacle3 = loadImage("images/bomb.png");
  
  obstacle4 = loadImage("images/cactus.png");
  obstacle5=loadImage("images/crocodile.png")
  coin_image=loadImage("images/chocochips.png");
   
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
 /* sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1*/
  
 
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  bg = createSprite(0,0,width,height);
  bg.x = width/2;
  bg.scale=2.5;
   bg.velocityX = -3;
  
  shinchan = createSprite(100,height-70,20,50);
  
  
  shinchan.addImage("running", shinchan_running);
  //shinchan.addAnimation("collided", shinchan_collided);
  shinchan.setCollider('circle',-50,0,150)
  shinchan.scale = 0.5;
  shinchan.debug=true
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
   invisibleGround.visible =false

  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  coinsGroup = new Group();
  
  score = 0;
  chocochip=0;
}

function draw() {
  //shinchan.debug = true;
  background(255);
 
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    if(score>=0&& score<1000) {
    //  console.log("if 1")
    bg.addImage("ground",bg1);
    back_music.play()
 
     } else if(score>=1000&& score<3000){
    // console.log("if 2")
      bg.addImage("ground",bg2);
      bg.scale=4;
      back_music.play()
     } else if(score>=3000&&score<5000){
     // console.log("if3")
      bg.addImage("ground",bg3);
      back_music.play()
    
      
     }else if(score>=5000){
    //  console.log("if3")
          bg.addImage("ground",bg4);
          shinchan.addImage("running",shinchan_swimming);
         }
  
    
    if(keyDown("SPACE") && shinchan.y>530) {
      jumpSound.play( )
      shinchan.velocityY = -20;
       touches = [];
    }
    
    shinchan.velocityY = shinchan.velocityY + 0.8
  
    if (bg.x < 0){
      bg.x = bg.width/2;
    }
  
    shinchan.collide(invisibleGround);
   spawnClouds();
    spawnObstacles();
    spawnChocochips();
    if(coinsGroup.isTouching(shinchan)){
     b_full.play()
     chocochip+=1;
     coinsGroup.destroyEach();
  }
  if(score%400===0&&score>0){
   chocochip-=1;
   b_low.play(); 


  }
  if(chocochip===-1){
    gameState=END;

  }

  if(obstaclesGroup.isTouching(shinchan)){
        explo_music.play()
        gameState = END;
    }
  }
 else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    bg.velocityX = 0;
    shinchan.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    shinchan.addImage("running",shinchan_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
  textSize(20);
  fill("black")
 text("Score: "+ score,30,50);
 textSize(20);
 fill("Green")
 text("CHOCOCHIPS : "+chocochip,30,70);

}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = shinchan.depth;
    shinchan.depth = shinchan.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(600,height-175,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
     case 2: obstacle.addImage(obstacle2);
              break;
     
    }
    if(score>=3000&&score<5000){
      // console.log("if3")
       bg.addImage("ground",bg2);
       obstacle.addImage(obstacle4);
      
       
      }
      if(score>=5000){
        //  console.log("if3")
              bg.addImage("ground",bg4);
              shinchan.addImage("running",shinchan_swimming);
              obstacle.addImage(obstacle5);
              wave_music.play();

             }
      
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 500;
    obstacle.depth = shinchan.depth;
    shinchan.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnChocochips() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0) {
    var coins = createSprite(width+20,height-70,40,10);
    coins.y = Math.round(random(displayHeight/2-100,displayHeight/2+100));
    coins.addImage(coin_image);
    coins .scale = 0.11;
    coins.velocityX = -6;
    
     //assign lifetime to the variable
     coins.lifetime = 700;
    
    //adjust the depth
    coins.depth = shinchan.depth;
    shinchan.depth = shinchan.depth+1;
    
    //add each cloud to the group
    coinsGroup.add(coins);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  bg.velocityX=-3;
  bg.scale=2.5;
  
  shinchan.addImage("running",shinchan_running);
  
  score = 0;
  chocochip=0;
  
}
