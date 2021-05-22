const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressErrors')
const { reviewSchema } = require('../schemas')
const Campground = require('../models/campground');
const {validateReview, isLoggedIn, isReviewOwner} = require('../middleware')
const review = require('../controllers/review')


router.post('',isLoggedIn,validateReview,catchAsync(review.addReview))

router.delete('/:reviewId',isLoggedIn, isReviewOwner, catchAsync( review.deleteReview))

module.exports = router