const User = require("../models/user.js");


// "renderSignup" ka callback function--->>>
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


//"signup Route" ka callback function--->>>
module.exports.signup = async(req, res, next) => {
try {
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    //newUser ko register karbane k liye DB k under-->>
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    });
} 
catch(e) {
    req.flash("error", e.message);
    res.redirect("/signup");
} 
};


//renderLogin ka callback function---->>>
module.exports.renderLoginForm = (req, res ) => {
    res.render("users/login.ejs");
};

//"login Route" ka callback function------>>>
module.exports.login = async(req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        let redirectUrl = 
            res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl); //redirectUrl
};


//"logout Route" ka callback Function---->>
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {  //logout() <<-- callback
    if(err) {
        return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
    });
};