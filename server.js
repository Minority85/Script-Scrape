var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var exphbs = require("express-handlebars");
var routes = require("./routes/routes");

var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "home" }));
app.set("view engine", "handlebars");
app.use(routes);

// mongoose.connect("mongodb://localhost/scriptScrape", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {

    axios.get("https://www.azfamily.com/news/").then(function (response) {

        var $ = cheerio.load(response.data);

        $("article h4").each(function (i, element) {

            var result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        // res.send("Done");
    });
});

app.get("/articles", function (req, res) {

    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {

    db.Article.findOne({ _id: req.params.id })
        .populate("message")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/article/:id", function (req, res) {

    db.Message.create(req.body)
        .then(function (dbMessage) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { message: dbMessage._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scriptScrape";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// app.listen(PORT, function () {
//     console.log("App running on port " + PORT + "!");
// });