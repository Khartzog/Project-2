const express = require('express')
const path = require('path')
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
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

  app.get('/signIn', function(req, res){
    res.render('project-2/signIn.ejs');
    res.end();
  })

  app.get('/viewEntries', function(req, res){
    res.render('project-2/viewEntries.ejs');
    verifyUser();
    res.end();
  });

  function verifyUser(username, callback){

    var sql = "SELECT username FROM userinfo WHERE username = $1::string";
    var params = [username];

    pool.query(sql, params, function(err, result) {
      if (err){
        // console.log("there was an error with the database");
        // console.log(err);
        callback(err, null);
      }
    //   console.log("found DB result: " + JSON.stringify(result.rows));

      callback(null, result.rows);

    })
  }