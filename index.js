const express = require('express')
const path = require('path')
var session = require('express-session')
const fetch = require("node-fetch");

//var await = require('asyncawait/await');
// var async = require('async');
const PORT = process.env.PORT || 5000

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://postgres:Kh681378.@localhost:5432/mydb";

const pool = new Pool({connectionString: connectionString}); 

const app = express();

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  app.get('/signIn', function(req, res){
    res.render('project-2/signIn.ejs');
    res.end();
  })

  app.get('/mainPage', function(req, res){
    res.render('project-2/mainPage.ejs');
    res.end();
  })

  app.get('/createEntry', function(req, res){
    res.render('project-2/createEntry.ejs');
    res.end();
  })

  app.get('/confirmEntry', function(req, res){
    res.render('project-2/confirmEntry.ejs')
    var text = req.query.content;
    makeEntry(text, function(error, result){
      
    });
  })

  app.get('/viewEntries', function(req, res){
    var content = ["It rained a bit today, I forgot my umbrella at work.", "I love saturdays, they are the best!"];
    res.render('project-2/viewEntries.ejs', {content: content});
    var username = req.query.username;
    var pass = req.query.password;
    var verified = "false";
    verifyUser(username, pass, function(error, result){
      console.log("back from the database with results: ", result);
      verified = "true";
      // res.json(result);
    })

    console.log("verified: " + verified);
    var ent = getEntries();
    console.log("ent: " + ent);
    res.end();
  })

  function verifyUser(username, pass, callback){

    var sql = "SELECT username FROM userinfo WHERE username = $1 and pass = $2";
    var params = [username, pass];

    pool.query(sql, params, function(err, result) {
      if (err){
        console.log("there was an error with the database");
        console.log(err);
        callback(err, null);
      }
        callback(null, result.rows);

    })
  };

  function getEntries(){
    var sql = "SELECT entry_content FROM user_entry WHERE userid = 1";
    var entries = [];
   
    // db.tx(t => {
    pool.query(sql, function(err, result, done){
      console.log(result.rows);
      entries.push(result.rows);
    })
    console.log("en: " + entries);
  };

  function makeEntry(content, callback){
    var sql = query = "INSERT INTO user_entry(entry_content, entry_date, userid, journal_id) VALUES($1, now(), 1, 1)";
    var params = [content];

    pool.query(sql, params, function(err, result) {
      if (err){
        console.log("there was an error with the database");
        console.log(err);
        callback(err, null);
      }
        callback(null);

    })
  };


  
