// Our scraping tools
var request = require("request");

//Scrape the html
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();

var scraped = false;


function scrape(req, res) {
    console.log("Inside scrape");
    let url = "https://news.google.com/news/section?cf=all&pz=1&ned=us&topic=tc&siidp=8a350d64e14f64fa6f7764fd50b7ff4e900b&ict=ln&zx=qd667c63tfto" //"https://news.google.com/news/section?cf=all&pz=1&ned=us&topic=tc&siidp=8a350d64e14f64fa6f7764fd50b7ff4e900b&ict=ln&zx=wsrtxdgdpxco";
    request(url, (error, response, html) => {
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
            newsItems.push(item);
        });

        // save each item to db

        //get from db and show on FE
        res.render("newsItem", {
            "newsItems": newsItems
        })
    });
}

router.get("/", (req, res) => {
    if (scraped) {
        loadFromDB();
    } else {
        scrape(req, res);
        scraped = true;
    }
    console.log("Inside get");


});
module.exports = router;
