const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Joi = require('joi')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressErrors')
const {campgroundSchema } = require('../schemas')
const Campground = require('../models/campground');
const { isLoggedIn } = require('../middleware')


const viewcampground = (req,res,next) => {
    
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


router.get('',catchAsync(async (req,res) => {
    const campgrounds  =  await Campground.find({})
    res.render('campgrounds/index',{campgrounds: campgrounds});
} ))
router.get('/new',isLoggedIn, (req,res) => {
    res.render('campgrounds/new');
} )
router.post('/',isLoggedIn,viewcampground, catchAsync(async (req,res,next) => {
    
   
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success','Successfully created a New Campground!')
    res.redirect('/campgrounds')
    
    
} ))

router.get('/:id',isLoggedIn,catchAsync(async (req,res) => {
    const campground  =  await Campground.findById(req.params.id).populate('reviews')
    if(!campground)
    {
        req.flash('error' , 'Not a valid campground!!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground});
} ))

router.get('/:id/edit',isLoggedIn,catchAsync(async (req,res) => {
    const campground  =  await Campground.findById(req.params.id)
    if(!campground)
    {
        req.flash('error' , 'Not a valid campground!!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground});
} ))

router.put('/:id',isLoggedIn,viewcampground, catchAsync(async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    //res.redirect('/campgrounds')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',isLoggedIn, catchAsync(async (req,res) => {
    id = req.params.id
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')

}))

module.exports = router
