const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressErrors')
const { reviewSchema } = require('../schemas')
const Campground = require('../models/campground');


const validateReview = (req,res,next) => {
    
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



router.post('',validateReview,catchAsync(async (req,res) =>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success','Successfully added a Review!')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:reviewId', catchAsync( async (req,res) => {
    const {id , reviewId} = req.params
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id , {$pull: {reviews: reviewId}})
    req.flash('success','Successfully deleted a Review!')

    res.redirect(`/campgrounds/${id}`)

}))

module.exports = router