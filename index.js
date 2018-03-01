var express = require('express'); //including express module for creating server
var app = express(); //creating an instance of express
var https = require('https'); //including https module for requesting text file

app.set('view engine', 'ejs'); //including EJS template engine

app.use(express.static(__dirname + '/views')); //including static folder path

app.get('/',function(req,res){ // standard GET route for the API
    var body = ''; //declaring variable where the data will go from https request
    https.get('https://shielded-headland-24739.herokuapp.com/static/users.txt', function(data) {
        data.on('data', function(packet) { // going through chunk by chunk of data and then appending them to body
            body = body + packet;
        });
        data.on('end', function() { //when the last chunk has come through this will be executed
            data = body.split("|"); //splitting the user records by using the delimiter pipe
            var json_data = []; //list of json objects where the user data will be stored
            for(var data_iterator=0;data_iterator<data.length;data_iterator++){
                //looping through each of the user data and further splitting it
                var data_splits = data[data_iterator].split("&");
                var inner_json_data = {};
                for(var split_iterator=0;split_iterator<data_splits.length;split_iterator++){
                    var key_value = data_splits[split_iterator].split("=");
                    inner_json_data[key_value[0]] = key_value[1];
                }
                json_data.push(inner_json_data);
            }
            //sending the data to be rendered on a EJS file with the data
            res.render('index.ejs',{users:json_data});
        });
    }).on('error', function(e) {
        console.log("Error" + e.message);
    });
});

//server will be started at this port
app.listen(8082);
console.log("Listening to 8082");