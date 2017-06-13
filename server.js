/*
NewsFeed app scrapes data from Google news , stores it to db, displays it via handlebars, and allows user to make comments
 ====================================================================================================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var logger = require("morgan");


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));


// Serves static content for the app from the "public" directory
app.use(express.static(process.cwd() + "/public"));
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//

// Routes
var routes = require("./controller/news-routes");
app.use("/", routes);

// Listen on port 3000
let port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("App running on port 3000!");
});
