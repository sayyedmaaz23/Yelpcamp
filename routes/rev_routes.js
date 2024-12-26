const express= require('express');
const router = express.Router({mergeParams: true});
const wrapfunc= require ('../utils/wrapperfunc');
const {validatereview}= require('../Schema');
const {isloggedIn}= require('../middleware');
const reviewcont = require('../controller/reviewcontroller')

router.get('/', (req, res)=>{
    const id= req.params.id;
    res.redirect(`/campgrounds/${id}`)
})
router.post('/',isloggedIn,validatereview, wrapfunc( reviewcont.addrev))

router.delete('/:reviewid', isloggedIn, wrapfunc( reviewcont.deleterev))

module.exports = router;
