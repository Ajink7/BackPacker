
const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.addReview = async (req,res) =>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success','Successfully added a Review!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview = async (req,res) => {
    const {id , reviewId} = req.params
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id , {$pull: {reviews: reviewId}})
    req.flash('success','Successfully deleted a Review!')

    res.redirect(`/campgrounds/${id}`)

}