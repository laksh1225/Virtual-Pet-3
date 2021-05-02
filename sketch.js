//For creating variables
var dog , dogImg , happyDog , database , foodS , foodStock;
var milkBottle;
var feed , addFood;
var fedTime , lastFed;
var foodObj;
var changegs , readgs;
var bedroomImg , gardenImg , washroomImg;
var sadDog;
var gameState;

function preload()
{
  //load images here
  dogImg = loadImage("images/Dog.png");
  happyDog = loadImage("images/Happy.png");
  sadDog = loadImage("images/deadDog.png");
  
  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(500,500);
  
  foodObj = new Food();

  dog = createSprite(250,250,10,10);
  dog.addImage("Image for dog",dogImg);
  dog.scale = 0.15;
  foodStock = database.ref('Food');
  foodStock.on("value" , readStock);
  textSize(20);

  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  //read game state from database
  gameState = database.ref('gameState');
  gameState.on("value",function(data){
    gameState = data.val();
  });
}


function draw() {  
  background(46,139,87);
  foodObj.display();
  /*if(keyDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(happyDog);
  }*/


  //add styles here
 /* fill(255);
  stroke("black");
  text("Food Remaining : " + foodS,150,150);
  textSize(13);
  text("Note : Press arrow key to feed the dog and make it happy" , 20 , 480);

  fill(255,255,245);
  textSize(15);*/

  fedTime = database.ref('Fed Time');
  fedTime.on("value" , function(data){
    lastFed = data.val();
  })
  if(lastFed >= 12){
    text("Last Feed : " + lastFed % 12 + " PM" , 350 , 30);
  }
    else if (lastFed == 0){
      text("Last Feed = 12 AM" , 350 , 30);
    }
    else{
      text("Last Feed : " + lastFed + " AM" , 350 , 30);
    }
    drawSprites();

    if(gameState != "Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }
   else{
     feed.show();
     addFood.show();
     dog.addImage(sadDo);
   }

   currentTime = hour();
   if(currentTime === lastFed+1){
     update("Playing");
     foodObj.garden();
   }
   else if(currentTime === lastFed+2){
     update("Sleeping");
     foodObj.bedroom();
   }
   else if(currentTime>lastFed+2 && currentTime <= lastFed+4){
     update("Bathing");
     foodObj.washroom();
   }
    else {
      update("Hungry");
      foodObj.display();
    }
  }



function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


/*function writeStock(x){
   if(x <= 0){
     x = 0;
   }
   else{
     x = x-1;
   }

   database.ref('/').update({
     Food : x
   })
}*/


function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}


function addFoods(){
  foodS ++;
  database.ref('/').update({
    Food : foodS
  })
}