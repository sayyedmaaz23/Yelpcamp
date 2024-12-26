const Camp = require('../models/camp_sch');
const maptilerClient = require("@maptiler/client");
const { cloudinary } = require("../cloudinary/cloudinaryconfig");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.allcampgrounds = async (req, res) => {
    const allcamps = await Camp.find({})
    res.render('campgrounds/allcampgrounds', { allcamps })
}


module.exports.newform = (req, res) => {
    res.render('campgrounds/newcamp')
}

module.exports.viewsite = async (req, res) => {
    const id = req.params.id

    const campsite = await Camp.findById(id).populate({
        path: 'review',
        populate: {
            path: 'author'
        }
    }).populate({ path: 'author' });
    if (!campsite) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/campsite', { campsite })
}

module.exports.editform = async (req, res) => {
    const id = req.params.id
    const campsite = await Camp.findById(id)
    if (!campsite) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/campedit', { campsite })
}


module.exports.editformfunct = async (req, res) => {
    const { id } = req.params;
    const campground = await Camp.findByIdAndUpdate(id, { ...req.body.campground });
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const image = req.files.map(f => ({ url: f.path, imgname: f.filename }))
    campground.images.push(...image)
    if (req.body.deleteimages) {
        for (let imgname of req.body.deleteimages) {
            await cloudinary.uploader.destroy(imgname);
        }
        campground.updateOne({ $pull: { images: { imgname: { $in: req.body.deleteimages } } } }).then(data => { console.log(data) })
    }
    await campground.save()
    req.flash('success', 'Changed Successfully')
    res.redirect(`/campgrounds`)
}

module.exports.delete = async (req, res) => {
    const id = req.params.id
    await Camp.findOneAndDelete({ _id: id })
    res.redirect(`/campgrounds`)
}

module.exports.newformfunc = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const newsite = new Camp(req.body.campground);
    newsite.geometry = geoData.features[0].geometry;
    newsite.images = req.files.map(f => ({ url: f.path, imgname: f.filename }))
    console.log(newsite.images)
    newsite.author = req.user._id;
    await newsite.save();
    req.flash('success', 'Successfully created!!');
    res.redirect(`/campgrounds/${newsite._id}`);
} 