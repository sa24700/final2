const express = require('express')
app = express()

var url = require('url');
var dt = require('./date-time');

const port = process.env.PORT || 3000
const majorVersion = 1
const minorVersion = 2

// Use Express to publish static HTML, CSS, and JavaScript files that run in the browser. 
app.use(express.static(__dirname + '/static'))



 
const mongoose = require('mongoose');

 

const axios = require('axios');
const mongooseUri = "mongodb+srv://user:ic86szGxuR4fW3cP@cluster0.udqar.mongodb.net/Characters";
mongoose.connect(mongooseUri,{useNewUrlParser: true},{useUnifiedTopology: true});
const charSchema = {
	name: String,
	race: String,
	class: String
}
const beginner = mongoose.model("beginner", charSchema);
mongoose.connection.on("connected", () =>{
  console.log("Mongoose has connected.");
});

app.get('/submitChar',   function(req,res){
 
     try{
		console.log("here ist he subchar " + req.query.name + " " + req.query.race + " " + req.query.class );
		let newChar =  new beginner({
			name: req.query.name,
			race: req.query.race,
			class: req.query.class
		})

    console.log("Here is the newChar " + newChar);
		 newChar.save();
       
        res.redirect('/');
         
     }
     catch(e){
        console.log(e);
     }
      
});


app.get('/displayAll',   function(req,res){
     
	try{
		
		 beginner.find({}).then(char =>{
       
		    
		   res.end(JSON.stringify(char));
		}) 
		
	}
	catch(e){
	   console.log(e);
	}
});



app.get('/delChar',   function(req,res){

	try{
		 
		 beginner.deleteOne({name: req.query.charName}).then(function(){
		console.log(`The query has   matches ` + req.query.charName); 
		res.redirect('/');
		});

	}
	catch(e){
	   console.log(e);
	}
});

app.get('/dndCall', async function(req,res){
   
    var results = await dndAPI(req.query.url)
    
 
    res.send(JSON.stringify( results.data));
});
 
 

app.get('/photoCall', async function(req,res){
     
    var results = await photoAPI(req.query.className)
	 
    res.end(JSON.stringify( results.data));
});
 
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

async function dndAPI(myString ){
    var baseApiUrl = "https://www.dnd5eapi.co";
    try{
		console.log("33333333333333333333333333333");
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
