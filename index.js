const express = require('express')
app = express()
const path = require('path');
var url = require('url');
var dt = require('./date-time');

const port = process.env.PORT || 3000
const majorVersion = 1
const minorVersion = 2

// Use Express to publish static HTML, CSS, and JavaScript files that run in the browser. 
app.use(express.static(__dirname + '/static'));



     ////////////////////////////////
    //Database functions
    /////////////////////////////
const mongoose = require('mongoose');

 

const axios = require('axios');
const mongooseUri = "mongodb+srv://user:ic86szGxuR4fW3cP@cluster0.udqar.mongodb.net/Characters";
mongoose.connect(mongooseUri,{useNewUrlParser: true},{useUnifiedTopology: true});
const charSchema = {
	name: String,
	race: String,
	class: String,
  hp: Number,
  speed: Number,
  size: String,
  str: Number,
  wis: Number,
  dex: Number,
  con: Number,
  int: Number,
  cha: Number,
  strBonus: Array ,
  wisBonus: Array ,
  dexBonus: Array ,
  conBonus: Array ,
  intBonus: Array ,
  chaBonus: Array ,
  txtAreaTraits: String,
  txtAreaClassTraits: String,
  quantity: Array,
  item: Array,
  weight: Array,
  skills: Array
}
const beginner = mongoose.model("beginner", charSchema);
mongoose.connection.on("connected", () =>{
  console.log("Mongoose has connected.");
});

app.get('/submitChar',  async function(req,res){
    console.log("char " + req.query.equipItem);
     try{
 

        let newChar =  new beginner({
          name: req.query.name,
          race: req.query.race,
          class: req.query.class,
          hp: req.query.hp,
          speed: req.query.speed,
          size: req.query.size,
          str: req.query.str,
          wis: req.query.wis,
          dex: req.query.dex,
          con: req.query.con,
          int: req.query.int,
          cha: req.query.cha,
          strBonus: req.query.strBonus,
          wisBonus: req.query.wisBonus,
          dexBonus: req.query.dexBonus,
          conBonus: req.query.conBonus,
          intBonus: req.query.intBonus,
          chaBonus: req.query.chaBonus,
          txtAreaTraits: req.query.txtAreaTraits,
          skills: req.query.skill,
          txtAreaClassTraits: req.query.txtAreaClassTraits
          
        });

          
          await beginner.findOneAndUpdate({name: req.query.name},{          
            
            name: req.query.name,
            race: req.query.race,
            class: req.query.class,
            hp: req.query.hp,
            speed: req.query.speed,
            size: req.query.size,
            str: req.query.str,
            wis: req.query.wis,
            dex: req.query.dex,
            con: req.query.con,
            int: req.query.int,
            cha: req.query.cha,
            strBonus: req.query.strBonus,
            wisBonus: req.query.wisBonus,
            dexBonus: req.query.dexBonus,
            conBonus: req.query.conBonus,
            intBonus: req.query.intBonus,
            chaBonus: req.query.chaBonus,
            txtAreaTraits: req.query.txtAreaTraits,
            txtAreaClassTraits: req.query.txtAreaClassTraits,
            quantity: req.query.equipQuant,
            item: req.query.equipItem,
            weight: req.query.equipwght,
            skills: req.query.skill},{upsert:true});
          
            res.redirect('/');
         
     }
     catch(e){
        console.log(e);
     }
      
});

 

app.get('/displayAll',  async function(req,res){
     
    try{
      
      const char = await beginner.find({});

      
       res.end(JSON.stringify(char));
    }
    catch(e){
      console.log(e);
    }
});



app.get('/delChar',   function(req,res){

    try{
      
      beginner.deleteOne({name: req.query.charName}).then(function(){
      
      res.redirect('/');
      });

    }
    catch(e){
      console.log(e);
    }
});


app.get('/viewChar',  async function(req,res){
    try{
        
      const char = await beginner.findOne({name: req.query.charName});
       res.end(JSON.stringify(char));
     
    }
    catch(e){
      console.log(e);
    }
});


    ////////////////////////////////
    //request handlers 
    /////////////////////////////


app.get('/dndCall', async function(req,res){
   
    var results = await dndAPI(req.query.url)
    
 
    res.send(JSON.stringify( results.data));
});
 
 


app.get('/photoCall', async function(req,res){
   var results;
   var heroApiUrl;

  try{

    heroApiUrl = "https://imsea.herokuapp.com/api/1?q=dnd";
    results = await axios.get(heroApiUrl+req.query.className);
    res.end(JSON.stringify( results.data));
  }
   catch(e){
    console.log(e);
   }
  
});

app.get('/addPic',async function(req,res){

  try{
    heroApiUrl = "https://imsea.herokuapp.com/api/1?q=";
    var results = await axios.get(heroApiUrl+req.query.choice);
    res.end(JSON.stringify( results.data));
  }
  catch(e){
    console.log(e);
  }

});

    ////////////////////////////////
    //API calls
    /////////////////////////////


async function photoAPI(queryString){
        const heroApiUrl = "https://imsea.herokuapp.com/api/1?q=dnd";
    try{
        const imgInfo = await axios.get(heroApiUrl+queryString);
 
        return imgInfo;
    }
    catch(e){
        console.log(e);
    }
}  

async function anyPhoto(queryString){
  
try{

  const heroApiUrl = "https://imsea.herokuapp.com/api/1?q=";
  const imgInfo = await axios.get(heroApiUrl+queryString);

  return imgInfo;
}
catch(e){
  console.log(e);
}
} 

async function dndAPI(myString ){
    var baseApiUrl = "https://www.dnd5eapi.co";
    try{		 
      const call = await axios.get(baseApiUrl + myString);
      return call;
    }
    catch(e){

    }
}







// Custom 404 page.
app.use((request, response) => {
  response.type('text/plain')
  response.status(404)
  response.send('404 - Not Found')
})

// Custom 500 page.
app.use((err, request, response, next) => {
  console.error(err.message)
  response.type('text/plain')
  response.status(500)
  response.send('500 - Server Error')
})

app.listen(port, () => console.log(
  `Express started at \"http://localhost:${port}\"\n` +
  `press Ctrl-C to terminate.`)
)
