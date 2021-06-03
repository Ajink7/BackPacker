
const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN
const geocode = mbxGeocoding({accessToken: mapboxToken})

module.exports.allCampgrounds = async (req,res) => {
    const campgrounds  =  await Campground.find({})
    res.render('campgrounds/index',{campgrounds: campgrounds});
} 

module.exports.renderForm =  (req,res) => {
    res.render('campgrounds/new');
}

module.exports.newCampground = async (req,res,next) => {
    const campground = new Campground(req.body.campground)
    const geoData = await geocode.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    campground['images'] = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground['author'] = req.user._id
    campground.geometry = geoData.body.features[0].geometry
    await campground.save()
    console.log(campground)
    req.flash('success','Successfully created a New Campground!')
    res.redirect('/campgrounds')
} 

module.exports.showCampground = async (req,res) => {
    const campground  =  await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        },
    }).populate('author')
    //console.log(campground)
    if(!campground)
    {
        req.flash('error' , 'Not a valid campground!!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground});
} 

module.exports.renderEditForm = async (req,res) => {
    const campground  =  await Campground.findById(req.params.id)
    if(!campground)
    {
        req.flash('error' , 'Not a valid campground!!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground});
} 

module.exports.editCampground = async (req,res) => {
        const {id} = req.params;
        const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
        console.log(req.body)
//     //res.redirect('/campgrounds')
//     res.redirect(`/campgrounds/${campground._id}`)
        //const campground = new Campground(req.body.campground)
        const img = req.files.map(f => ({url: f.path, filename: f.filename}))
        campground['images'].push(...img)
        campground['author'] = req.user._id
        await campground.save()
        if(req.body.deleteImages){
            for(let filename of req.body.deleteImages){
                await cloudinary.uploader.destroy(filename)
            }
            await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
            console.log(campground)
        }
        req.flash('success','Successfully Edited Campground!')
        res.redirect('/campgrounds')
 }

module.exports.deleteCampground = async (req,res) => {
    id = req.params.id
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')

}