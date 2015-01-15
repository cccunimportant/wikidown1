var c = console;
var fs = require('fs');
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser"); // 參考：http://codeforgeek.com/2014/09/handle-get-post-request-express-4/
var cookieParser = require('cookie-parser')
var session = require('express-session');
var serveIndex = require('serve-index');

var app = express();
var pubDir = path.join(__dirname, 'public');
var dbDir  = path.join(__dirname, 'db');

app.use(cookieParser());
app.use(session({secret: '@#$TYHaadfa1', resave: false, saveUninitialized: true}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public/', express.static(pubDir));
app.use('/public/', serveIndex(pubDir, {'icons': true}));

function response(res, code, msg) {
  res.set('Content-Type', 'text/plain').status(code).send(msg).end();
  c.log("=====response=====\n"+code+":"+msg);
}

app.get("/db/:db/:name", function(req, res) {
  var db = req.params.db;
  var name = req.params.name;
  fs.readFile(dbDir+'/'+db+'/'+name, function(err, jtext) {
    if (err)
      response(res, 404, 'read fail!');
    else
      response(res, 200, jtext.toString());
  });
});

app.post("/db/:db/:name", function(req, res) {
  var db = req.params.db;
  var name = req.params.name;
  var obj = req.body.obj;
  var msg = "db:"+db+" name:"+name+"\n"+obj;
  fs.writeFile(dbDir+"/"+db+"/"+name, obj, function(err) {
    if (err)
      response(res, 500, 'write fail!');
    else
      response(res, 200, 'write success!');
  })
});

app.listen(3000);

console.log('Server started: http://localhost:3000/');
