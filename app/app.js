
// app.js

var express = require('express');
var reload = require('reload');
var app = express();
var dataFile = require('./data/data.json');
var io = require('socket.io')();

var mongo = require('mongodb').MongoClient; // Requiring Mongo
var database; // Creating a global db variable

app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = 'Roux Meetups';
app.locals.allSpeakers = dataFile.speakers;

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/speakers'));
app.use(require('./routes/feedback'));
app.use(require('./routes/api'));
app.use(require('./routes/chat'));

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});

io.attach(server);
io.on('connection', function(socket) {
  socket.on('postMessage', function(data) {
    io.emit('updateMessages', data);
  });
});

var date = new Date();
var current_minutes = date.getSeconds();   

// connecting to mongo and create a database called guests if it does not exist yet
// source: https://zellwk.com/blog/crud-express-mongodb/

mongo.connect("mongodb://192.168.0.122:27017/guests", function(err,db){
		
	if(!err){
		
		console.log("we are connected to mongo");
		// Insert a new record into a collection called guestList 
		// with a Name + timeStamp every time you instantiate the app 
		db.collection('guestList').insertOne({'useName':'Ronaldo-' + current_minutes , "pwd": "EhNois"});
		database = db;
		
		console.log('* All documents:');
		
		// display all documents in guestList collection
		database.collection('guestList').find().toArray(function(err, cursor) {
		  console.log(cursor);
		})
	}
}) 
reload(server, app);