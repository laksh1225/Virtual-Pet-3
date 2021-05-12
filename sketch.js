//For creating variables
var dog , dogImg , happyDog , database , foodS , foodStock;
var milkBottle;
var feed , addFood;
var fedTime , lastFed;
var foodObj;
var bedroomImg , gardenImg , washroomImg;
var sadDog;
var readState , gameState;
var currentTime

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
  createCanvas(700,500);
  
  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value" , readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

    //read game state from database
    readState = database.ref('gameState');
    readState.on("value",function(data){
      gameState = data.val();
    });

  dog = createSprite(250,250,10,10);
  dog.addImage("Image for dog",dogImg);
  dog.scale = 0.15;


  feed = createButton("Feed The Dog");
  feed.position(800,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(900,95);
  addFood.mousePressed(addFoods);

}


function draw() {  
  currentTime = hour();
  if(currentTime === (lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime === (lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime > (lastFed+2) && currentTime <= (lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
   else {
     update("Hungry");
     foodObj.display();
   }

   if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
 else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog);
 }

    drawSprites();

 
  
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
    FeedTime : hour(),
    gameState : "Hungry"
  })
}


function addFoods(){
  foodS ++;
  database.ref('/').update({
    Food : foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState : state
  })
}