var express = require("express");
var router = express.Router();
const request = require("request-promise");
const cheerio = require("cheerio");
var cookieParser = require("cookie-parser");

/* GET users listing. */
router.get("/", function(req, res, next) {
  var novel = [];
  var idnovels = req.query.id;
  const URL = "https://webnovel.online/";

  const getPageContent = uri => {
    const options = {
      uri,
      headers: {
        "User-Agent": "Request-Promise"
      },
      transform: body => {
        return cheerio.load(body);
      }
    };

    return request(options);
  };
  var data = [];
  var novelsname = null;
  var author = null;
  var genresdata = [];
  var chapterlist = [];
  var dateupdate = null;
  var othername = null;
  var lasterchapter = null;
  var idnovel = null;
  var idchapter = null;
  var cover = null;
  var lastupdates = [];
  var update_time = null;
  var id = null;
  var totalpages = null;
  getPageContent(URL + idnovels).then($ => {
    novelsname = $(".col-md-10 h1").text();
    cover = $('.my-panel img').attr('src');
    cover = 'https://webnovel.online'+cover;
    // othername = $(".truyen_info_right li:nth-child(1) span").text();
    // author = $(".truyen_info_right li:nth-child(2) a").text();

    $(".tag-items li .tag-item a").each(function(result) {
      genres = $(this).text();
      idgenres = $(this).attr("href");
      idgenres = idgenres.slice(('/novel-list?genres_include=').length)
      // var dem = link.search("&state");
      // idgenres = link.slice(link.search("category=") + 9, dem);
      //   console.log(idgenres);
      genresdata.push({
        genrename: genres,
        idgenres: idgenres
      });
    });
    status = $(".col-md-10 small span").text();
    // dateupdate = $(".updated").text();
    description = $(".description").html();
    description = description.slice(1,description.search('<hr>'))
    $("#info .content-item a").each(function(result) {
      chaptername = $(this).text();
      var chapterid = $(this).attr("href");
      idchapter = chapterid.slice(
        chapterid.search(idnovels + "/") + (idnovels.length + 1)
      );
      chapterlist.push({
        chaptername: chaptername,
        idchapter: idchapter
      })
    });
    novel = {
        novelsname: novelsname,
        idnovels: idnovels,
        // othername: othername,
        // author: author,
        cover: cover,
        genresdata: genresdata,
        status: status,
        // dateupdate: dateupdate,
        description: description,
        chapterlist: chapterlist

    }
    // console.log(chapterlist);
    res.send(JSON.stringify(novel));
  });
});

module.exports = router;
