const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const Errorhandle = require('./utils/errorhandle')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


const validatecampground=(req, res, next)=>{

    const campgroundschem=Joi.object({
        id: Joi.string(),
        campground: Joi.object({
            title: Joi.string().escapeHTML(),
            location: Joi.string().escapeHTML(),
            // image: Joi.string(),
            price: Joi.number().min(0),
            description: Joi.string().escapeHTML()
        }).required(),
        deleteimages: Joi.array()
    })
    const {error} = campgroundschem.validate(req.body);
    if(error){
        const msg=error.details.map(el=> el.message).Join(',')
        throw new Errorhandle(msg, 400);
    }else{
        next();
    }
}

const validatereview=(req, res, next)=>{
    const reviewscheme= Joi.object({
        id: Joi.string(),
        review: Joi.object({
            rating: Joi.number().min(0).max(5).required(),
            msg: Joi.string().escapeHTML()
        }).required()
    })
    const {error} = reviewscheme.validate(req.body);
    if(error){
        const msg=error.details.map(el=> el.message).join(',')
        throw new Errorhandle(msg, 400);
    }else{
        next();
    }
}


module.exports= {validatecampground, validatereview}