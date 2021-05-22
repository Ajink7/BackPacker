const {campgroundSchema , reviewSchema } = require('./schemas')
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressErrors')
const Review = require("./models/review")

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl
        req.flash('error','You must Login first!')
        return res.redirect('/login')
    }
    next()
}



module.exports.viewcampground = (req,res,next) => {
    
    const result = campgroundSchema.validate(req.body)
    //console.log(result)
    if(result.error){
        const msg = result.error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg,400)
    }
    else
    {
        next()
    }
}

module.exports.isOwner = async (req,res,next) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!(campground.author.equals(req.user._id)))
    {
        req.flash('error' , 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}


module.exports.isReviewOwner = async (req,res,next) => {
    const { id, reviewId} = req.params
    //const campground = await Campground.findById(id)
    const review = await Review.findById(reviewId)
    if(!(review.author.equals(req.user._id)))
    {
        req.flash('error' , 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}


module.exports.validateReview = (req,res,next) => {
    
    const result = reviewSchema.validate(req.body)
    //console.log(result)
    if(result.error){
        const msg = result.error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg,400)
    }
    else
    {
        next()
    }
}


