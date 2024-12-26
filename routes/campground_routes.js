const express= require('express');
const router = express.Router();
const Camp= require('../models/camp_sch');
const wrapfunc= require ('../utils/wrapperfunc');
const {validatecampground}= require('../Schema');
const {isloggedIn, isAuthorized} = require('../middleware')
const campgroundcont= require('../controller/campgroundcont')
const multer  = require('multer')
const {storage} = require('../cloudinary/cloudinaryconfig')
const upload = multer({storage})


router.route('/')
      .get(wrapfunc(campgroundcont.allcampgrounds))
      .post(isloggedIn,upload.array("image"), validatecampground, wrapfunc(campgroundcont.newformfunc))

router.get('/new',isloggedIn, campgroundcont.newform)

router.get('/:id',wrapfunc(campgroundcont.viewsite ))

router.get('/:id/edit',isloggedIn, isAuthorized,  wrapfunc(campgroundcont.editform))

router.put('/:id',upload.array("image"), validatecampground, isAuthorized,wrapfunc(campgroundcont.editformfunct))

router.delete('/:id',isloggedIn, isAuthorized, upload.array("image"), wrapfunc(campgroundcont.delete))


module.exports = router