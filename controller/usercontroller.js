const User = require('../models/user')


module.exports.userreg=(req, res)=>{
    res.render('users/register')

}

module.exports.userregfunc=async(req, res, next)=>{
    try{
        const {username, email, password} = req.body
        const user = User({username, email})
        const newuser= await User.register(user, password)
        req.logIn(newuser, (err)=>{
            if(err){
                return next(err)
            }
            req.flash('success', 'Welcome!!')
        res.redirect('/campgrounds')
        })
        
    }catch(e){
        req.flash('error', `${e}`)
        res.redirect('/register')
    }
   
}


module.exports.userlogin=(req, res)=>{
    res.render('users/login')
}


module.exports.userloginfunc=(req, res)=>{
    const redirecturl= req.session.returnTo || '/campgrounds'
    req.flash('success', 'Welcome Back')
    res.redirect(redirecturl)
}

module.exports.logout=(req, res, next)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');});
}