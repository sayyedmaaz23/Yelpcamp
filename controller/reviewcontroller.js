const Camp= require('../models/camp_sch');
const review = require ('../models/review_sch');

module.exports.addrev=async(req, res)=>{
    const id= req.params.id;
    const camp= await Camp.findByIdAndUpdate(id)
    const _review= new review(req.body.review)
    _review.author= req.user._id
    await _review.save()
    await camp.review.push(_review)
    await camp.save()  
    res.redirect(`/campgrounds/${id}`)
}


module.exports.deleterev=async(req, res)=>{
    const c_id= req.params.id
    const r_id= req.params.reviewid
    const rev = await review.findById(r_id)
    console.log(rev.author._id)
    if(!rev.author._id.equals(req.user._id)){
        req.flash('error', "You are not authorized!!")
        return res.redirect('/campgrounds')
    }
    await Camp.findByIdAndUpdate(c_id, {$pull:{review: r_id}})
    await review.findByIdAndDelete(r_id)
    
    res.redirect(`/campgrounds/${c_id}`);
}