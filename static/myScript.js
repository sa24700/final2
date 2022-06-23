document.getElementById("txtAreaTraits").value = "";
var imgQuery = "";
var countryQuery = "";
var infoQuery = "";
var flag = false;
var count = 0;
var stat, mod;
var statBonus = Math.floor(((stat - 10)/2)+ mod);
var highStats =  [15,14] ;
var otherStats =  [13,12,10,8] ;
var stats = new Set(["wis","cha","con","int","str","dex"]);
var coordsArray = [{lat: 48.434 , lng: 0 ,offset: 130},{lat: -30.114,lng: 26.89, offset:60}];
var charName = "";
var myMap;
var results;
var tryCall;
const options = {       
        headers: new Headers({'content-type': 'application/json'}),       
    }; 
var modal = document.getElementById("directionModal");
var btn = document.getElementById("modalBtn");


    ////////////////////////////////
    //Modal show and hide
    /////////////////////////////       
    function popUp() {
        modal.style.display = "block";
    }
    
       
    function popDown() {
         modal.style.display = "none";
    }

     ////////////////////////////////
    //Filling race and class select boxes with api info
    /////////////////////////////


async function initForm(){
selRace = document.getElementById("selRace");
selClass = document.getElementById("selClass");

try{
     
    tryCall = await fetch('/dndCall' + '?url=/api/races', options);
    results = await tryCall.json();
    
    var option = document.createElement("option");
    option.text = "";
    selRace.add(option);
    option = document.createElement("option");
    option.text = "";   
    selClass.add(option);
     
    results["results"].forEach((el) =>{
        option = document.createElement("option");
        option.text = el.name;
        selRace.add(option);
    });
 
    tryCall = await fetch('/dndCall' + '?url=/api/classes', options);
    results = await tryCall.json();
     

    results["results"].forEach((el) =>{
        option = document.createElement("option");
        option.text = el.name;
        selClass.add(option);
    });
   

    await fillTable();
     
}
catch(e){

}

}

    ////////////////////////////////
    //Getting race and class from user input or random gen
    /////////////////////////////


async function charGen(){
    $race = document.getElementById("selRace");
        raceVal = $race.value.toLowerCase();
    $class = document.getElementById("selClass");  
        classVal = $class.value.toLowerCase();
  try{ 

    if(classVal == ""){
        infoQuery = "/api/classes"
        tryCall = await fetch('/dndCall' + '?url=' + infoQuery, options);
      console.log("////////////"   );
        //results = await tryCall.json(); 
        results = await tryCall.json();
        count = results["count"];
        var charClass = results["results"][randomNum(count)]["index"];
        
        tryCall = await fetch('/dndCall' + '?url=' + "/api/classes/" + charClass, options);
        results = await tryCall.json();
        console.log("$class value " + results["name"]);
       $class.value =   results["name"];
       
        classSetUp(results);
    

    }
    else{
        infoQuery = "/api/classes/"+ classVal;

       

        tryCall = await fetch('/dndCall' + '?url=' + infoQuery, options);
        results = await tryCall.json();
        classSetUp(results);
        
    }      
    if(raceVal == ""){
        infoQuery = "/api/races"
        tryCall = await fetch('/dndCall' + '?url=' + infoQuery, options);
        results = await tryCall.json();
        console.log("here is the infoQuery" + results["count"]);
        count = results["count"];
        var charRace = results["results"][randomNum(count)]["index"];
        console.log("//////////RACES " + charRace);
        tryCall = await fetch('/dndCall' + '?url=' + "/api/races/" + charRace, options);
        results = await tryCall.json();  

        raceProperties(results);
        addBonusMod( results["ability_bonuses"]);           
    }
    else{
            infoQuery = "/api/races/"+ raceVal;
            tryCall = await fetch('/dndCall' + '?url=' + infoQuery, options);
            results = await tryCall.json();
            raceProperties(results);
            addBonusMod( results["ability_bonuses"]);
    }
   
         
 
    ////////////////////////////////
    //Creating name for map Marker
    /////////////////////////////
     
    if(document.getElementById("name").value == ""){
        charName = document.getElementById("selRace").value;
        charName += " " + document.getElementById("selClass").value;
    }
    else {
        charName = document.getElementById("name").value;
    }
    addMarker(charName);
   
    }
    catch(e){
        console.log(e);
    }

   
}

    ////////////////////////////////
    //function to set up race determined languages, skills, traits, etc
    /////////////////////////////

function raceProperties(passResults){
    $race = document.getElementById("selRace");
    document.getElementById("speed").value = passResults["speed"];
    document.getElementById("size").value = passResults["size"];
 
    if(passResults.hasOwnProperty("starting_proficiencies")){
        if(passResults["starting_proficiencies"].length >= 1){ 
    
            passResults["starting_proficiencies"].forEach((element) => {
            
            var tempProf = element["name"];
            var tempString = "";
           if(tempProf.includes("Skill") ){
               var tempString = tempProf.split(" ");
               tempString[1] = tempString[1].toLowerCase() ;
               
               document.getElementById(tempString[1] + "Prof").checked = true;
           }
           else{
               document.getElementById("txtAreaTraits").value += tempProf + "\n";
           }
        });
        

        }

    }

    if(passResults.hasOwnProperty("starting_proficiency_options")){
        count = Number(passResults["starting_proficiency_options"].choose) ;
          
        var tempResults = passResults["starting_proficiency_options"]["from"];
        for(let i = 0; i < count; i++) {
            var tempProf = tempResults[randomNum(tempResults.length - 1)]["name"];
            var tempString = "";
            if(tempProf.includes("Skill") ){
                  tempString = tempProf.split(" ");
                tempString[1] = tempString[1].toLowerCase() ;
                var newSkillString = "";
                for(var a = 1; a < tempString.length; a++){
                   if((a + 1) !== tempString.length){
                    newSkillString += tempString[a].toLocaleLowerCase() + "-";
                   }
                   else{
                    newSkillString += tempString[a].toLocaleLowerCase();
                   }

                }
                console.log("newSkillString " + newSkillString);
                document.getElementById(newSkillString + "Prof").checked = true;
            }
            else{
                document.getElementById("txtAreaTraits").value += "(+)" + tempProf + "\n";
            }
            
            tempResults.push(tempResults.splice(tempResults.indexOf(document.getElementById("txtAreaTraits").value), 1)[0]);
            tempResults.pop();
        } 
        document.getElementById("txtAreaTraits").value += "--------------------\n";
    }
    else{
        document.getElementById("txtAreaTraits").value += "--------------------\n";
    }


    if(passResults.hasOwnProperty("traits")){
        if(passResults["traits"] > 0){
            document.getElementById("txtAreaTraits").value += "TRAITS:\n\n";
            passResults["traits"].forEach((element) => {
                document.getElementById("txtAreaTraits").value += element["name"] + "\n";
    
            });
            document.getElementById("txtAreaTraits").value += "--------------------\n";
        }
    }

    if(passResults.hasOwnProperty("languages")){
        if(passResults["languages"].length >= 1){
            document.getElementById("txtAreaTraits").value += "LANGUAGES:\n\n";
            passResults["languages"].forEach((element) => {
                document.getElementById("txtAreaTraits").value += element["name"] + "\n";
        
            });
        }
    }

    if(passResults.hasOwnProperty("language_options")){
        count = Number(passResults["language_options"].choose) ;
        console.log("choose " + passResults["language_options"]["from"][0]);
        for(let i = 0; i < count; i++) {
            document.getElementById("txtAreaTraits").value += "(+)" +passResults["language_options"]["from"][randomNum(passResults["language_options"]["from"].length)]["name"] + "\n";
            passResults["language_options"]["from"].push(passResults["language_options"]["from"].splice(passResults["language_options"]["from"].indexOf(document.getElementById("txtAreaTraits").value), 1)[0]);
            passResults["language_options"]["from"].pop();
        } 
        document.getElementById("txtAreaTraits").value += "--------------------\n";
    }
    else{
        document.getElementById("txtAreaTraits").value += "--------------------\n";
    }
    $race.value = passResults["name"];
}

    ////////////////////////////////
    //function to determine starting class based skills and starting equipment
    /////////////////////////////

function classSetUp(classResults){
    document.getElementById("hp").value = classResults["hit_die"];
   
     
    setStats(  classResults["index"]);

    document.getElementById("txtAreaTraits").value += "STARTING PROFICIENCIES:\n\n";
    if(classResults.hasOwnProperty("proficiency_choices")){
        count = Number(classResults["proficiency_choices"][0].choose) ;
        var firstFromArray = classResults["proficiency_choices"][0]["from"];
        var fromArray = [];
        firstFromArray.forEach((el) =>{
             fromArray.push(el["index"]);
        });
        console.log("Class choose " +  fromArray[1] );
        for(let i = 0; i < count; i++) {
            var fullSkill = fromArray[randomNum(fromArray.length - 1)];
            var skill = fullSkill.substring(6);
            console.log("here is the fromArray.length " + fullSkill);

            if(document.getElementById( skill.toLowerCase() +"Prof") !== null){
                document.getElementById( skill.toLowerCase() +"Prof").checked = true;  
            }
            else{
                document.getElementById("txtAreaTraits").value += fullSkill + "\n";
            }
            fromArray.push(fromArray.splice(fromArray.indexOf(fullSkill), 1)[0]);
            fromArray.pop();
        } 
       
    }
    
    if(classResults.hasOwnProperty("proficiencies")){
        if(classResults["proficiencies"].length > 0){
           

            classResults["proficiencies"].forEach((el)=>{
                document.getElementById("txtAreaTraits").value += el.name + "\n";
            });

           
        }
    }
   
    if(classResults.hasOwnProperty("starting_equipment")){

        if(classResults["starting_equipment"].length > 0){
            
            classResults["starting_equipment"].forEach((el) =>{

                addRowArgs(el["quantity"],el["equipment"]["name"],0);

                console.log("starting equp length " + classResults["starting_equipment"] );
                 console.log("starting equipment name " +classResults["starting_equipment"][0]["equipment"]["name"] );    

            });
        }

    }
       
    if(classResults.hasOwnProperty("starting_equipment_options")){
        var tempName = "";
        var tempQuant = 0;
        count = classResults["starting_equipment_options"][0]["choose"];
   
        var firstFromArray = classResults["starting_equipment_options"][0]["from"];
        var fromArray = [];
        firstFromArray.forEach((el) =>{
             fromArray.push( el );
            
        });
        var numArray = ["Warlock","Paladin","Sorcerer"];
        for(let i = 0; i < count; i++) {
            var num = randomNum(fromArray.length - 1);
            var temp =  fromArray[num]  ;
             if(numArray.includes(document.getElementById("selClass").value) ){
                tempName = temp[num]["equipment"]["name"];
                tempQuant = temp[num]["quantity"]
             } 
             else{
                tempName = temp["equipment"]["name"];
                tempQuant = temp["quantity"]
             }            
            addRowArgs("(+)" + tempQuant,"(+)" + tempName,0);

        } 
       
    }
    
}

    ////////////////////////////////
    //Setting stats by Class
    /////////////////////////////

async function setStats(passClass){
        switch(passClass) {
            case "barbarian":
                setStatsByClass("str", "con");
             
                break;
            case "bard":
                setStatsByClass("cha","int"); 
                 break;
            case "cleric":
                setStatsByClass("wis","cha"); 
                break;
            case "druid":
                setStatsByClass("wis","dex");
                break;
            case "fighter":
                setStatsByClass("str","con"); 
                break;
            case "monk":
                setStatsByClass("dex","wis"); 
                break;
            case "paladin":
                setStatsByClass("cha","str"); 
                break;
            case "ranger":
                setStatsByClass("str","dex"); 
                break;
            case "rogue":
                setStatsByClass("dex","cha");  
                break;
            case "sorcerer":
                setStatsByClass("con","int"); 
                break;
            case "warlock":
                setStatsByClass("int","con"); 
                break;
            case "wizard":
                setStatsByClass("int","wis");
                break;
        default:
          console.log("Something weird happened in the switch.");
      }
   
   try{
    await leftPicBuilder(passClass);
   }
   catch(e){

   }
}


    ////////////////////////////////
    //Randomly creating stats 
    /////////////////////////////

function setStatsByClass(highStat, nextHighStat){

    stats.delete(highStat);
    stats.delete(nextHighStat);


    var number = randomNum(100);
     
    if(number % 2  == 0){
        document.getElementById(highStat).value = highStats[0];
        document.getElementById(nextHighStat).value = highStats[1]; 

    }
    else{
        document.getElementById(highStat).value = highStats[1];
        document.getElementById(nextHighStat).value = highStats[0]; 
    }
    
 
    
    var i = 0;
    stats.forEach(element => {
  
     document.getElementById(element).value = otherStats[i];
     i += 1;
        
    });

    stats.add(highStat);
    stats.add(nextHighStat);
}


    ////////////////////////////////
    //Creating stat modifiers
    /////////////////////////////


 function addBonusMod(charBonusArray){
    
    stats.forEach((val) => {
        console.log("Here is the val " + val);
        document.getElementsByName(val+"Bonus").forEach((el)=>{
                     el.value = Math.floor((document.getElementById(val).value - 10) / 2);
  
 
        });
    });
            charBonusArray.forEach((charBonus) => {

                var numberBonus = Number(charBonus["bonus"]);                
                document.getElementsByName(charBonus["ability_score"]["index"] +"Bonus").forEach((el) => {
                var elementVal = Number(el.value);
 
                    el.value  = numberBonus + elementVal; 
    
                    });
            });

}


    ////////////////////////////////
    //Add empty rows to equipment table
    /////////////////////////////


function addRow(){

     table =  document.getElementById("equipmentTable");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = " <td><input type='text' id='quantityCell' class='addCellInput'></td>";
    cell2.innerHTML = " <td><input type='text' id='itemCell' class='addCellInput'></td>";
    cell3.innerHTML = " <td><input type='text' id='weightCell' class='addCellInput'></td>";

}

    ////////////////////////////////
    //Adding rows to equipment table with arguments
    /////////////////////////////


function addRowArgs(quant,item,wght){

    table =  document.getElementById("equipmentTable");
   var row = table.insertRow(-1);
   var cell1 = row.insertCell(0);
   var cell2 = row.insertCell(1);
   var cell3 = row.insertCell(2);

   cell1.innerHTML = ` <td><input type='text' id='quantityCell' class='addCellInput' value ="${quant}" >   </td>`;
   cell2.innerHTML = ` <td><input type='text' id='itemCell' class='addCellInput' value ="${item}"></td>`;
   cell3.innerHTML = ` <td><input type='text' id='weightCell' class='addCellInput' value ="${wght}"></td>`;

}


    ////////////////////////////////
    //Creating random numbers
    /////////////////////////////


function randomNum(topNum){
  var randomNum =  Math.floor(Math.random() * topNum);
  return randomNum;
}

    ////////////////////////////////
    //Looping through photo array
    /////////////////////////////


 function picRotate(results, givenClass){
    var passClass;
    try{
        passClass = givenClass;
        var number = 0;
        number = randomNum(results.length - 1);
        var data = results[number]; 
    
        $left = document.getElementById("leftBox");
        $left.innerHTML =  "";
        $left.innerHTML = "<div id='showCase'>" +

        `<img src="${data }" alt="${passClass}" class="classPic" />` +
    
        "</div>";  
    }
    catch(e)
    {

    }
 }

    ////////////////////////////////
    //fetching photo api array from server call
    /////////////////////////////

async function leftPicBuilder(passClass){
    try{
          
    tryCall = await fetch('/photoCall' + '?className=' + passClass, options);
    results = await tryCall.json();
    results = results["results"];
    
    await setInterval(function(){picRotate(results, passClass)}, 3000);
    }
    catch(e){

    }  
}

 
    ////////////////////////////////
    //add map Marker
    /////////////////////////////

function addMarker(passName){

        var coordArrayChoice = randomNum(100);
        var myLat;
        var myLng;

        if(coordArrayChoice % 2 == 0){
            myLat = coordsArray[0].lat;
            myLng = randomNum(coordsArray[0].offset);    
        }
        else{
            myLat = randomNum(coordsArray[1].offset)
            myLng = coordsArray[1].lng;
        }
        var marker = new google.maps.Marker({
            position: {lat:myLat,lng:myLng},
            map: myMap,
            draggable:true
        });
         
        var infoWindow = new google.maps.InfoWindow({
            content: `${passName}'s home` 
        });

        marker.addListener('click',function(){
            infoWindow.open(myMap,marker);
        });

        myMap.setCenter({lat:myLat,lng:myLng});
    }


    ////////////////////////////////
    //Delete character from table and database
    /////////////////////////////


async function charDelete(rowNum){
    try{
        var cell = document.getElementById("charTable").rows[rowNum].cells[0];
        var newString = cell.innerHTML.substring(3,cell.innerHTML.length-4);
        console.log("Here is the cell info " + newString);
    
        tryCall = await fetch('/delChar?charName=' + newString , options);
        window.location.reload();
    }
    catch(e){
        console.log(e);
    }
}

    ////////////////////////////////
    //Get all chars from database and display in table
    /////////////////////////////

async function fillTable(){
    try{
        tryCall = await fetch('/displayAll', options);
        results = await tryCall.json();
    
        var i = 2;
        var charTable = document.getElementById("charTable");
        results.forEach((el) =>{
            var row = charTable.insertRow(-1);
            var cell = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
           var cell4 = row.insertCell(3);
    
            cell.innerHTML = `<td><p>${el.name}</p></td>`;
            cell2.innerHTML = `<td><p>${el.class}</p></td>`;
            cell3.innerHTML = `<td><p>${el.race}</p></td>`;
            cell4.innerHTML = "<td><button onclick=" +
                                `charDelete(${i})`+
                                ">Delete</button";
    
            i++;
        }); 
    }
    catch(e){
        console.log(e);
    }
}

 