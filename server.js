// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const https = require("https");

const tier = require("./tier.js");

const Discord = require("discord.js");


// our default array of dreams
const dreams = [
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
 app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

app.get("/search", async function(request, response) {
  var ID = request.query["ID"];
  console.log(ID); 
  let reaction_p = tier.react("!티어 "+ID);
  var reaction = await reaction_p;
  response.set('Content-Type', 'text/plain');
  response.json(reaction);
});


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async function(msg) {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
  //console.log(msg);
  if (msg.author.bot) {
    return;
    
  }
  if(msg.content[0] != '!'){
    return;
  }
  let reaction_p = tier.react(msg.content);
  var reaction = await reaction_p;
  if(reaction){
    msg.reply(reaction);
  }
});

client.login(process.env.BOT_TOKEN);


setInterval(() => {
  https.get(`https://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 100000);


