var express         = require("express");
var app             = express();
var flash           = require("connect-flash");
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var passport        = require("passport");
var LocalStrategy   = require("passport-local");
var methodOverride  = require("method-override");
var Location        = require("./models/locations");
var Comment         = require("./models/comments");
var User            = require("./models/user");
var seedDB          = require("./seeds");

//REQUIRUNG ROUTES
var commentRoutes           = require("./routes/comments");
var eventsCommentRoutes     = require("./routes/commentsEvent");
var locationsRoutes         = require("./routes/locations");
var eventsRoutes            = require("./routes/events");
var indexRoutes             = require("./routes/index");


//SEED THE DATABASE
//  seedDB();

//Creating Database
mongoose.connect("mongodb://localhost:27017/japan", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : " once again Rusty wins cutest dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser( User.serializeUser());
passport.deserializeUser( User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/locations", locationsRoutes);
app.use("/locations/:id/comments", commentRoutes);
app.use("/events", eventsRoutes);
app.use("/events/:id/comments", eventsCommentRoutes);

app.listen(3000);