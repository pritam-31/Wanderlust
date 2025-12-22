if(process.env.NODE_ENV != "production") {
   require('dotenv').config(); 
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");  //npm i method-override
const ejsMate = require("ejs-mate");                //higher level ejs : npm i  ejs-mate
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
//for Authentication --->>>
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//routes path--->>>
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


//DB connection------>
//const  MONGO_URL = ('mongodb://127.0.0.1:27017/wanderlust');
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
  await mongoose.connect(dbUrl); 
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const sessionOptions = {
    secret: process.env.SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



//Root Route ----->
app.get('/', (req, res) => {
    res.redirect("/listings");
});



//cookie(session) middleware---->>>>
app.use(session(sessionOptions));
app.use(flash());


//"passport" ko initialize --->>
app.use(passport.initialize());  
//"passport.session" ko implement karne ke liye--->>>
app.use(passport.session());
//user ko Login/Sign_up karana ---->>>
passport.use(new LocalStrategy(User.authenticate()));


//user related information ko session k under store--->>
passport.serializeUser(User.serializeUser());
//user related information ko session k under un-store--->>
passport.deserializeUser(User.deserializeUser());


//"Flash" --> success
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});


// //demoUser--->>>
// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     //password = "helloworld"
//     res.send(registeredUser);
// });


//listing routes
app.use("/listings", listingsRouter);
//review routes
app.use("/listings/:id/reviews", reviewsRouter);
//bookings routes
const bookingsRouter = require("./routes/bookings.js");
app.use("/bookings", bookingsRouter);
//user routes
app.use("/", userRouter);



//Custom error --->>
app.use((req, res, next) => {
        next(new ExpressError(404, "Page Not Found!"));
});

//Error handler Middleware ---->>
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
    //res.status(statusCode).send(message);
});

//server starting...
app.listen(8080, () => {
    console.log("server is listening to port 8080.");
});