// Our scraping tools
var request = require("request");

//Scrape the html
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var Comments = require("../models/Comments.js");
var News = require("../models/News");


var scraped = false;
mongoose.Promise = Promise;

var dbUrl = "mongodb://localhost/newsFeed";

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect(dbUrl);
}

 
var db = mongoose.connection;

db.on("error", (error) => console.log(`Mongoose error ${error}`));

db.once("open", () => console.log("Mongoose db connection successfull"))

function scrape(req, res, next) {
    if (!scraped) {
        console.log("Inside scrape");
        let url = "https://news.google.com/news/section?cf=all&pz=1&ned=us&topic=tc&siidp=8a350d64e14f64fa6f7764fd50b7ff4e900b&ict=ln&zx=qd667c63tfto" //"https://news.google.com/news/section?cf=all&pz=1&ned=us&topic=tc&siidp=8a350d64e14f64fa6f7764fd50b7ff4e900b&ict=ln&zx=wsrtxdgdpxco";
        request(url, (error, response, html) => {
            console.log("inside scrape res");
            let $ = cheerio.load(html);
            var newsItems = [];
            $(".esc-body").each((i, element) => {
                //  console.log(element);
                let title = $(element).find(".esc-lead-article-title .titletext").html();
                let link = $(element).find(".esc-lead-article-title a").attr("href");
                let summary = $(element).find(".esc-lead-snippet-wrapper").html();
                let imgSrc = $(element).find("img").attr("src");
                let item = {
                    "title": title,
                    "link": link,
                    "summary": summary,
                    "imgSrc": imgSrc
                }

                var news = new News(item);

                news.save((error, article) => {
                    if (error) {
                        console.log('Err' + error);
                    } else {
                        console.log("Saved in db");
                    }
                })


            });

            return next();
        });


    } else {
        return next();
    }
}



function loadFromDb(req, res) {
    News.find({}).populate("comment").exec(function(error, newsItems) {
        if (error) {
            res.send(error)
        }
        console.log("=====================================================");

        console.log(newsItems[0]);
        res.render('newsItem', {
            "newsItems": newsItems
        })
    });

}

router.get("/scrape", (req, res) => {
    scrape(req, res);
});

router.post("/postComments/:id", (req, res) => {
    var newComment = new Comments(req.body);
    var articleId = req.params.id;
    newComment.save((error, comment) => {
        if (error) {
            console.log(`Error on saving comment ${error}`);
            res.send(error);
        }
        console.log("Added comment", comment);
        console.log("Updating news");
        News.findOneAndUpdate({
            "_id": articleId
        }, {
            $push: {
                "comment": comment
            }
        }, (error, newDoc) => {
            if (error) {
                console.log(`Error on saving comment in article${error}`);

                res.send(error)
            };
            console.log("Saved comments");
            loadFromDb(req, res);
        })
    })

})

router.delete("/news/:newsId/comments/:id", (req, res) => {
    let commentId = req.params.id;
    let newsId = req.params.newsId;
    // delete from comment table
    Comments.findByIdAndRemove({
        "_id": commentId
    }, (err, todo) => {
        if (err) res.send(err);
        console.log(`Delted the comment ${commentId}`);
        News.update({
                "_id": newsId
            }, {
                $pull: {

                    "comment": {
                        "_id": commentId
                    }
                }
            },
            function(error, result) {
                if (err) res.send(err);
                res.json(200);
            })
    })
    // delete reference from news
});

router.get("/", scrape, loadFromDb);

module.exports = router;
