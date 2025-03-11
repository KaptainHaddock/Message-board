var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.

let counter = 0;


app.get("/", function(req, res) {
  res.send("Hello")
})

// Test de la route test
app.get("/test/:something", function(req, res) {
  /* Alternative pour récupérer une chaine fixée 
  let response = ["Hello", "World"];
  res.json(response);
  */
  res.json(req.params.something)
});


// Partie 2.3 du TP : Un micro-service avec un état

app.get("/cpt/query", function(req, res) {
  res.json(counter);
});

app.get("/cpt/inc", function(req, res) {

  let increment = req.query.v;
  let incrementValue = parseInt(increment);
  
  if (increment == undefined) {
    counter += 1;
    return res.json({ "code": 0 });
  }
 if (!isNaN(incrementValue)){
    counter += parseInt(increment);
    res.json({ "code": 0 });
  }
  else{
    res.json({ "code": -1 });
  }
});


// Partie 2.4 du TP : Micro-service de gestion de messages

var allMsgs = [
  {user:"Admin",msg:"Hello World",timestamp: new Date().toISOString()},
  {user:"User1",msg:"foobar",timestamp: new Date().toISOString()},
  {user:"CS",msg:"CentraleSupelec Forever",timestamp: new Date().toISOString()}];

app.get("/msg/get/:num", function(req, res){
  let num = req.params.num;
  if (!isNaN(num) && parseInt(num) < allMsgs.length){
    res.json({ code: 1, msg: allMsgs[num] });
  }
  else{
    res.json({ "code": 0 });
  }
});


app.get("/msg/nber", function(req, res){
  res.json(allMsgs.length);
});

app.get("/msg/getAll", function(req, res){
  res.json(allMsgs);
});

app.get("/msg/post/:msg/:user?", function(req, res){
  let user = req.params.user ? unescape (req.params.user) : "Anonyme";
  let msg = req.params.msg;
  let timestamp = new Date().toISOString();
  let newMsg = {user: user, msg: msg, timestamp: timestamp};
  allMsgs.push(newMsg);
  res.json(allMsgs.length-1);
});



app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");

