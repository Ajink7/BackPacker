if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const { resolveSoa } = require('dns');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressErrors')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const {campgroundSchema , reviewSchema} = require('./schemas')
const Review = require('./models/review')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const MongoDBStore = require('connect-mongo')
const dbUrl = process.env.DB_USER//'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, { 
    useNewUrlParser: true,
    useUnifiedTopology: true ,
    useCreateIndex: true,
    useFindAndModify : false
})
  
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: "Secret",
    touchAfter: 24*3600,
});

const sessionConfig = {
    store: store,
    name: 'session',
    secret: 'thisisnotagoodsecret',
    saveUninitialized: true,
    resave: false ,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}
const db = mongoose.connection;
db.on("error",console.error.bind(console,'connection error'))
db.once("open",() => {
    console.log("Database connected")
})

app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(session(sessionConfig))
app.use(helmet({contentSecurityPolicy:false}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(mongoSanitize())

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
const port = process.env.PORT || 3000
app.listen(port,()=> {
    console.log(`Listening on port ${port}`)
})
app.use(express.static(path.join(__dirname,'public')))
app.use(flash())


app.use((req,res,next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    //conreq.session.returnTo 
    next()
})
app.get('/',(req,res) => {
    res.render('./home')
})
app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)
app.all('*', (req,res,next) => {
    next(new ExpressError('page not found',404))
})
app.use((err,req,res,next) => {
    const { StatusCode = 500 , message = "Something has gone wrong" } = err;
    res.status(StatusCode).render('error',{err})
})

