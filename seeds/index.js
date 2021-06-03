const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;

        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            "images" : [ { 
                        "url" : "https://res.cloudinary.com/divgbey8i/image/upload/v1622271242/campground-images/mkdk0nmo2vtblattkyxk.png", 
                        "filename" : "campground-images/mkdk0nmo2vtblattkyxk" }, 
                        {  
                        "url" : "https://res.cloudinary.com/divgbey8i/image/upload/v1622271242/campground-images/mlmq9apcd071ygdukt51.png", 
                        "filename" : "campground-images/mlmq9apcd071ygdukt51" } ],
            "geometry" : {
                "type" : "Point",
                "coordinates" : [ 76.5740323493548, 10.20060295315 ] 
            },
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad, deserunt quod, harum sed nulla adipisci dolores repudiandae libero est sint maiores placeat consequuntur, rerum dignissimos quia fuga. Distinctio, repudiandae architecto.',
            price: price,
            author: '60a54f7531ae1645f127722e'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})