const Camp = require('./models/camp_sch')
const review = require('./models/review_sch') 



module.exports.tester= (req, res, next) => {
    console.log("working!!")
    next()    
}

module.exports.isloggedIn= (req, res, next)=>{
    if (!req.isAuthenticated()){
        req.flash('error', 'You must be signed in first')
        return res.render('users/login')
    }
    next ()
} 

module.exports.isAuthorized = async(req, res, next)=>{
    const id = req.params.id
    const campground= await Camp.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error' ,"You Are not at all Authorized")
        return res.redirect('/campgrounds')
    }
    next()
}

