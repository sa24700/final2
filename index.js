const express = require('express')
app = express()

//const {MongoClient} = require('mongodb'); 
//const fetch = require('node-fetch');
//const uri = "mongodb+srv://user:ic86szGxuR4fW3cP@cluster0.udqar.mongodb.net/?retryWrites=true&w=majority";
//var client = new MongoClient(uri);

var url = require('url');
var dt = require('./date-time');

const port = process.env.PORT || 3000
const majorVersion = 1
const minorVersion = 2

// Use Express to publish static HTML, CSS, and JavaScript files that run in the browser. 
app.use(express.static(__dirname + '/static'))

// The app.get functions below are being processed in Node.js running on the server.
// Implement a custom About page.
app.get('/about', (request, response) => {
	console.log('Calling "/about" on the Node.js server.')
	response.type('text/plain')
	response.send('About Node.js on Azure Template.')
})

app.get('/version', (request, response) => {
	console.log('Calling "/version" on the Node.js server.')
	response.type('text/plain')
	response.send('Version: '+majorVersion+'.'+minorVersion)
})

// Return the value of 2 plus 2.
app.get('/2plus2', (request, response) => {
	console.log('Calling "/2plus2" on the Node.js server.')
	response.type('text/plain')
	response.send('4')
})

// Add x and y which are both passed in on the URL. 
app.get('/add-two-integers', (request, response) => {
	console.log('Calling "/add-two-integers" on the Node.js server.')
	var inputs = url.parse(request.url, true).query
	let x = parseInt(inputs.x)
	let y = parseInt(inputs.y)
	let sum = x + y
	response.type('text/plain')
	response.send(sum.toString())
})

// Template for calculating BMI using height in feet/inches and weight in pounds.
app.get('/calculate-bmi', (request, response) => {
	console.log('Calling "/calculate-bmi" on the Node.js server.')
	var inputs = url.parse(request.url, true).query
	const heightFeet = parseInt(inputs.feet)
	const heightInches = parseInt(inputs.inches)
	const weight = parseInt(inputs.lbs)

	console.log('Height:' + heightFeet + '\'' + heightInches + '\"')
	console.log('Weight:' + weight + ' lbs.')

	// Todo: Implement unit conversions and BMI calculations.
	// Todo: Return BMI instead of Todo message.

	response.type('text/plain')
	response.send('Todo: Implement "/calculate-bmi"')
})

// Test a variety of functions.
app.get('/test', (request, response) => {
    // Write the request to the log. 
    console.log(request);

    // Return HTML.
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<h3>Testing Function</h3>')

    // Access function from a separate JavaScript module.
    response.write("The date and time are currently: " + dt.myDateTime() + "<br><br>");

    // Show the full url from the request. 
    response.write("req.url="+request.url+"<br><br>");

    // Suggest adding something tl the url so that we can parse it. 
    response.write("Consider adding '/test?year=2017&month=July' to the URL.<br><br>");
    
	// Parse the query string for values that are being passed on the URL.
	var q = url.parse(request.url, true).query;
    var txt = q.year + " " + q.month;
    response.write("txt="+txt);

    // Close the response
    response.end('<h3>The End.</h3>');
})

// Return Batman as JSON.
var spiderMan = {
	"firstName":"Bruce",
	"lastName":"Wayne",
	"preferredName":"Batman",
	"email":"darkknight@lewisu.edu",
	"phoneNumber":"800-bat-mann",
	"city":"Gotham",
	"state":"NJ",
	"zip":"07101",
	"lat":"40.73",
	"lng":"-74.17",
	"favoriteHobby":"Flying",
	"class":"cpsc-24700-001",
	"room":"AS-104-A",
	"startTime":"2 PM CT",
	"seatNumber":"",
	"inPerson":[
		"Monday",
		"Wednesday"
	],
	"virtual":[
		"Friday"
	]
}

app.get('/batman', (request, response) => {
	console.log('Calling "/batman" on the Node.js server.')
	response.type('application/json')
	response.send(JSON.stringify(spiderMan, null, 4))
})


   /*  
app.get('/dndCall', async function(req,res){
   
    var results = await dndAPI(req.query.url)
    
    res.end( JSON.stringify(results) );
});
 
 

app.get('/photoCall', async function(req,res){
     
    var results = await photoAPI(req.query.className)
     
    res.end( JSON.stringify(results) );
});
 
app.get('/submitChar',  async function(req,res){
 
     try{
        const result = await   client.db("Characters").collection("beginner").updateOne({name:req.query.name,},{$set: req.query},{upsert: true});
        res.redirect('index.html');
         
     }
     catch(e){
        console.log(e);
     }
      
});

app.get('/displayAll',  async function(req,res){
     
     try{
        const results = await    client.db("Characters").collection("beginner").find( ).toArray() ;
         
        res.end(JSON.stringify(results));
     }
     catch(e){
        console.log(e);
     }
});



app.get('/delChar',  async function(req,res){
 
     try{
         const delResult = await client.db("Characters").collection("beginner").deleteOne({name: req.query.charName} );
         console.log(`The query has ${delResult.deletedCount} matches`);
         res.redirect('index.html');
     }
     catch(e){
        console.log(e);
     }
});


async function photoAPI(queryString){
    const heroApiUrl = "https://imsea.herokuapp.com/api/1?q=dnd";
    try{
        const imgInfo = await fetch(heroApiUrl+queryString);
        const imgResults = await imgInfo.json();
        var picArray = imgResults["results"]; 
        return picArray;
    }
    catch(e){
        console.log(e);
    }
} 

async function dndAPI(myString ){
    var baseApiUrl = "https://www.dnd5eapi.co";
    try{
    const call = await fetch(baseApiUrl + myString);
    const res = await call.json();
    return res;
    }
    catch(e){

    }
}
*/

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
