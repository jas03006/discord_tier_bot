const https = require("https");

var riot_url;
var riot_tier = "Loading...";

var htmlparser = require("htmlparser");
var handler = new htmlparser.DefaultHandler(function(error, dom) {
  if (error) return;
  else return dom;
});
var parser = new htmlparser.Parser(handler);

const cmd_mark = "!";

module.exports = {
  react: function(msg) {
    return react(msg);
  }
};

async function react(msg) {
  try {
  const args = msg == undefined ? "" : msg.trim().split(" ");
  const cmd = args == "" ? "" : args[0];
  if(args.length < 2){
    return "ID를 입력해주세요";
  }
  if (cmd === cmd_mark + "티어") {
    return (
      "[솔로랭크] " + (await get_riot_tier(msg.substring(msg.indexOf(" ") + 1)))
    ); //parse_tier();
  } else if (cmd === cmd_mark + "롤체") {
    return (
      "[롤토체스] " + (await get_lolchess(msg.substring(msg.indexOf(" ") + 1)))
    ); //lolchess_tier;
  }
  }catch(error){
    console.log("react() error: "+error);
  }
}

function parse_tier(riot_tier) {
  return (riot_tier = riot_tier[0].trim() + " " + riot_tier[1].trim());
}

async function get_riot_tier(id) {
  let riot_p = new Promise((resolve, reject) => {
    //setInterval(() => {
    var url = riot_url;
    if (id != undefined && id != null) {
      url =
        "https://www.op.gg/summoner/userName=" +
        encodeURIComponent(id.replace(/\s+/g, ""));
    } else {
      resolve("[!티어 ID]의 형식으로 입력해 주세요");
    }
    https.get(url, function(res) {
      var resData = "";
      res.on("data", function(chunk) {
        resData += chunk;
      });

      res.on("end", function() {
        parser.parseComplete(resData);
        riot_tier = handler.dom[5]["children"][1]["children"][19]["attribs"][
          "content"
        ].split("/");
        console.log("OP.GG responded.");
        //console.log(riot_tier);
        resolve(parse_tier(riot_tier));
      });

      res.on("error", function(err) {
        console.log("오류발생: " + err.message);
      });
    });
  });
  //}, 30000);
  return await riot_p;
}

var lolchess_url;
var lolchess_tier = "Loading...";

async function get_lolchess(id) {
  var xpath = require("xpath");
  var dom = require("xmldom").DOMParser;
  //  setInterval(() => {
  let lolchess_p = new Promise((resolve, reject) => {
    var url = lolchess_url;
    if (id != undefined) {
      url =
        "https://lolchess.gg/profile/kr/" +
        encodeURIComponent(id.replace(/\s+/g, ""));
    } else {
      resolve("[!롤체 ID]의 형식으로 입력해 주세요");
    }
    https.get(url, function(res) {
      var resData = "";
      res.on("data", function(chunk) {
        resData += chunk;
      });

      res.on("end", function() {
        var doc = new dom({
          locator: {},
          errorHandler: {
            warning: function(w) {},
            error: function(e) {},
            fatalError: function(e) {
              console.error(e);
            }
          }
        }).parseFromString(resData);
        lolchess_tier =
          xpath.select(
            '//*[@id="profile"]/div/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/span[1]/text()',
            doc
          ) +
          ": " +
          xpath.select(
            '//*[@id="profile"]/div/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/span[2]/text()',
            doc
          );
        console.log("lolchess.gg responded.");
        console.log(lolchess_tier);
        resolve(id + " " + lolchess_tier);
      });

      res.on("error", function(err) {
        reject(err);
        console.log("오류발생: " + err.message);
      });
    });
  });
  return await lolchess_p;
  //  }, 30000);
}
