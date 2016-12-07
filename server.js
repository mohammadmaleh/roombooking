var express = require('express')
var mongojs = require('mongojs')
var bodyParser = require('body-parser')
var Moment = require('moment-timezone');
var db = mongojs('mongodb://root:root@ds119768.mlab.com:19768/heroku_l027btv0')

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});
// post method takes date and returns rooms in that date
app.post('/getrooms',function(req,res){

    db.rooms.find(req.body,function(err,docs){
        if (err)
            res.json(err)
        res.json(docs)
    })

})
app.post('/sendpass',function(req,res){

   console.log(req.body)

})


app.listen(3000)
console.log('server running on port 3000')

var today = new Date()
today.setHours(0,0,0,0);

var mockData = [{
        name: "nice room in berlin",
        location: "Berlin",
        date:Moment(today).format("YYYY-MM-DDTHH:mm:ss")+"Z",
        description:'confy room with nice view',
        price:100,
        availableToday: true,
        equipment: [
            "bed",
            'fridge',
            'bath',
            'a lot of beers',


        ],
        size: "80",
        capacity: 2,

        avail: [


            {from : Moment(today).add(9,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z", to : Moment(today).add(12,'hours').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z"},
            {from : Moment(today).add(7,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z", to : Moment(today).add(7,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z"},
            {from : Moment(today).add(7,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z", to : Moment(today).add(7,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z"},
            {from : Moment(today).add(7,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z", to : Moment(today).add(7,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z"},

        ],
        images: [
            "http://cdn.home-designing.com/wp-content/uploads/2010/10/living-room-artificial-light-by-ferdaviola.jpg",
            "https://www.munich-accommodation.com/images/hotel-double-room.jpg?m=1373840483",
            "https://static.pexels.com/photos/7007/pexels-photo.jpg",
        ]
    },
    {
        name: "room in Munich",
        location: "Munich",
        date:Moment(today).format("YYYY-MM-DDTHH:mm:ss")+"Z",
        description:'confy room with nice view',
        price:100,
        availableToday: true,
        equipment: [
            "bed",
            'fridge',
            'bath',
            'a lot of beers',


        ],
        size: "80",
        capacity: 2,

        avail: [


            {from : Moment(today).add(12,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z", to : Moment(today).add(14,'hours').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z"},

        ],
        images: [
            "http://kingofwallpapers.com/room/room-003.jpg",
            "https://media-cdn.tripadvisor.com/media/photo-o/03/83/78/df/florence-room-b-b.jpg",
            "https://s-media-cache-ak0.pinimg.com/originals/d9/3c/ec/d93cec2893e6cb0aca2b4c48563d4f48.jpg",
        ]
    },{
        name: "nice room in Hamburg",
        location: "Hamburg",
        date:Moment(today).format("YYYY-MM-DDTHH:mm:ss")+"Z",
        description:'confy room with nice view',
        price:100,
        availableToday: true,
        equipment: [
            "bed",



        ],
        size: "80",
        capacity: 2,

        avail: [


            {from : Moment(today).add(9,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z", to : Moment(today).add(12,'hours').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z"},
            {from : Moment(today).add(13,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z", to : Moment(today).add(19,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z"},
           
        ],
        images: [
            "http://cdn.home-designing.com/wp-content/uploads/2010/10/living-room-artificial-light-by-ferdaviola.jpg",
            "https://www.munich-accommodation.com/images/hotel-double-room.jpg?m=1373840483",
            "https://static.pexels.com/photos/7007/pexels-photo.jpg",
        ]
    },{
        name: "nice room in Frankfurt",
        location: "Frankfurt",
        date:Moment(today).format("YYYY-MM-DDTHH:mm:ss")+"Z",
        description:'confy room with nice view',
        price:100,
        availableToday: true,
        equipment: [
            "fridge",
            'closet',



        ],
        size: "80",
        capacity: 2,

        avail: [


            {from : Moment(today).add(9,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z", to : Moment(today).add(12,'hours').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z"},
            {from : Moment(today).add(13,'hours').add(45,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z", to : Moment(today).add(19,'hours').add(30,'minutes').tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss")+"Z"},

        ],
        images: [
            "https://s-media-cache-ak0.pinimg.com/originals/d9/3c/ec/d93cec2893e6cb0aca2b4c48563d4f48.jpg",
            "https://s-media-cache-ak0.pinimg.com/originals/d9/3c/ec/d93cec2893e6cb0aca2b4c48563d4f48.jpg",
            "https://static.pexels.com/photos/7007/pexels-photo.jpg",
        ]
    },







]

db.rooms.insert(mockData,function(err,docs){
    // res.json(docs)
})
