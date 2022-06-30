var mainBody = document.getElementById("mainBody");
var map1;
var monsterArray = ['giant-crab','goblin',"ancient-red-dragon"];
var titleArray = ['Crab Battle', 'Goblin in the Woods', 'The Dragon is Found!'];
var coordsArray = [{lat: 45.188012, lng:5.796268  },{lat: 45.183584, lng:5.831589},{lat: 45.164146, lng: 5.924668}];
var playerCoordsArray  = [{lat: 45.188512, lng:5.796268  },{lat: 45.183584, lng:5.831089},{lat: 45.164146, lng: 5.924168}];

var tryCall;
var results;

var monsterApiUrl = '/api/monsters/';

var playerMarker;
var enemyMarker;
var options = {       
    headers: new Headers({'content-type': 'application/json'}),       
}; 

document.getElementById('finishBtn').addEventListener('click', campaignMaker);


var i = 0;
var coords = coordsArray[0];
var playerCoords = playerCoordsArray[0];
async function campaignMaker(){

    if(i < monsterArray.length){
        await articleBuilder(monsterArray[i]);
        
        document.getElementById('battleTitle').innerHTML =  titleArray[i];
    removeMarker();
      newCenter( coordsArray[i], monsterArray[i],playerCoordsArray[i])  ;
     i += 1;       
     
    }
    else if(i == monsterArray.length){
        i = 0;
    }

}

async function articleBuilder(monsterName){
    tryCall = await fetch('/dndCall?url=' + monsterApiUrl + monsterName, options);
    results = await tryCall.json();
   
    infoBuilder(results);
     
}

async function infoBuilder(enemyInfo){
    document.getElementById("enemyPic").innerHTML = `<img src="${await getEnemyPic(results['name'])}" alt=${enemyInfo["name"]} class="enemyPic"/>`;
    document.getElementById('hp1').innerHTML = enemyInfo['hit_points'];
    document.getElementById('cr1').innerHTML = enemyInfo['armor_class'];
    document.getElementById('enemyNum').innerHTML = battleOdds(enemyInfo['challenge_rating'],1);
       
                   
   

}

function battleOdds(cr,charLvl){
    var amount = 0;

    if(cr <= charLvl/4){
        amount = 1;
    }
    if(cr <= charLvl/10){
        amount = 2;
    }
    if(cr > charLvl/4){
        amount = 0;
    }
    return amount;
}

function removeMarker(){
    if(enemyMarker !== undefined && playerMarker !== undefined){
        console.log(enemyMarker);
        enemyMarker.setMap(null);
        playerMarker.setMap(null);
    }
}

function initMap(){

  
    mapOptions = {
        zoom: 17,
        center: {lat: 45.188012, lng:5.796268  },
        mapTypeId: 'satellite',
        disableDefaultUI: true
    }

map1 = new google.maps.Map(document.getElementById(`art1Map`),mapOptions);


} 
 
function newCenter(coords, enemyName,playCoordinates){  


 
    map1.setCenter({lat:coords.lat , lng:coords.lng});
 
      enemyMarker = new google.maps.Marker({
        position: {lat:coords.lat , lng:coords.lng},
        map:map1
      });

      var infoWindow = new google.maps.InfoWindow({
        content:enemyName,
      
    });

    enemyMarker.addListener('click',function(){
       infoWindow.open(map1,enemyMarker);
   });
 
   playerMarker = new google.maps.Marker({
    position: {lat:playCoordinates.lat , lng:playCoordinates.lng},
    map:map1
  });

  var playerWindow = new google.maps.InfoWindow({
    content:"player",
  
});

playerMarker.addListener('click',function(){
    playerWindow.open(map1,playerMarker);
});
}




async function getEnemyPic(enemyName){

    try{
      
            
        tryCall = await fetch('/addPic' + '?choice=' + enemyName, options);
        results = await tryCall.json();
       
            
            if(results["results"].length >= 1){
                    results = results["results"];
        
                     return results[0];
            }
         
    }
    catch(e){
        console.log(e);
    }
}
  
