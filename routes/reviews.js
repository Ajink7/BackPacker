const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressErrors')
const { reviewSchema } = require('../schemas')
const Campground = require('../models/campground');
const {validateReview, isLoggedIn, isReviewOwner} = require('../middleware')



router.post('',isLoggedIn,validateReview,catchAsync(async (req,res) =>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success','Successfully added a Review!')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:reviewId',isLoggedIn, isReviewOwner, catchAsync( async (req,res) => {
    const {id , reviewId} = req.params
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id , {$pull: {reviews: reviewId}})
    req.flash('success','Successfully deleted a Review!')

    res.redirect(`/campgrounds/${id}`)

}))

module.exports = router