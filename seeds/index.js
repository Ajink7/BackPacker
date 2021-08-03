const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb+srv://Ajink7:TuB5og1erSzihWeM@cluster0.xnbiy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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
    //await Campground.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;

        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            "images" : [ { 
                        "url" : "https://res.cloudinary.com/divgbey8i/image/upload/v1622693718/campground-images/vvb0iakuwaz5ajbrcwvc.jpg", 
                        "filename" : "campground-images/vvb0iakuwaz5ajbrcwvc" }, 
                        {  
                        "url" : "https://res.cloudinary.com/divgbey8i/image/upload/v1622448055/campground-images/apa9m7znujjfibpbua7n.jpg", 
                        "filename" : "campground-images/apa9m7znujjfibpbua7n" } ],
            "geometry" : {
                "type" : "Point",
                "coordinates" : [ cities[random1000].longitude , cities[random1000].latitude ] 
            },
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad, deserunt quod, harum sed nulla adipisci dolores repudiandae libero est sint maiores placeat consequuntur, rerum dignissimos quia fuga. Distinctio, repudiandae architecto.',
            price: price,
            author: '60c09127b9c6d62d2d2e4531'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})



