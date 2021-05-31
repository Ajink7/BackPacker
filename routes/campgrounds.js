const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Joi = require('joi')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressErrors')
const {campgroundSchema } = require('../schemas')
const Campground = require('../models/campground');
const { isLoggedIn , isOwner ,viewcampground } = require('../middleware')
const campgrounds = require('../controllers/campground')
const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.allCampgrounds))
    .post(isLoggedIn,upload.array('image'),viewcampground, catchAsync(campgrounds.newCampground))
    // .post(upload.array('image'),(req,res) => {
    //     console.log(req.body,req.file)
    //     res.send(req.body)
    // })
router.get('/new',isLoggedIn,campgrounds.renderForm )

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isOwner,upload.array('image'),viewcampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isOwner , catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn, isOwner ,catchAsync(campgrounds.renderEditForm))


module.exports = router
