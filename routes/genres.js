var express = require("express");
var router = express.Router();
const request = require("request-promise");
const cheerio = require("cheerio");
var cookieParser = require("cookie-parser");

/* GET users listing. */
router.get("/", function (req, res, next) {
  var novel = [];
  var page = req.query.page;
  var idgenres = req.query.id;
  const URL =
    "https://webnovel.online/";

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
  var lasterchapter = null;
  var idnovel = null;
  var idchapter = null;
  var cover = null;
  var lastupdates = [];
  var update_time = null;
  var id = null;
  var view = null;
  var des = null;
  var totalpages = null;
  getPageContent(URL + 'novel-list?genres_include=' + idgenres + '&page=' + page).then($ => {
    console.log(URL + 'novel-list?genres_include=' + idgenres + '&page=' + page)
    // console.log(
    //   "http://www.nettruyen.com/tim-truyen?status=-1&sort=15&page=" + page
    // );
    // var pagett = $(".pagination-outter ul li.hidden").text();
    // totalpage = pagett.slice(pagett.search("/") + 2);
    $(".content .content-story").each(function (result) {

      $(this)
        .find("h3 a")
        .each(function () {
          novelsname = $(this).text();
          idnovel = $(this).attr('href');
          idnovel = idnovel.slice(1)
          //  idnovel = novelid.slice(novelid.search(".com/") + 5);
          console.log(idnovel);
        });
      $(this)
        .find(".social-meta span:nth-child(3) a")
        .each(function () {
          lasterchapter = $(this).text();
          var chapterid = $(this).attr('href');
          idchapter = chapterid.slice(chapterid.search(idnovel + '/') + (idnovel.length + 1));
          console.log(idchapter)
        });

      $(this)
        .find(".col-md-4 img")
        .each(function () {
          cover = $(this).attr('src');
          cover = 'https://webnovel.online' + cover;
          // console.log(cover);
          //   console.log(idchapter)
        });
      $(this)
        .find(".col-md-8 p")
        .each(function () {
          des = $(this).text();
        });
      $(this)
        .find(".social-meta span:nth-child(1)")
        .each(function () {
          view = $(this).text();
          // console.log(cover);
          //   console.log(idchapter)
        });
      data.push({
        'novelsname': novelsname,
        'idnovel': idnovel,
        'lasterchapter': lasterchapter,
        'idchapter': idchapter,
        'cover': cover,
        'view': view,
        'des': des
      })
    });
    var totalpage = $('.pagination li:last-child a').attr('href');
    if (totalpage === undefined) {
      var novels = {
        url: URL + page,
        page: page,
        data: data,
        totalpage: 1
      };

      return res.send(JSON.stringify(novels));
    }
    console.log(totalpage)
    totalpages = totalpage.slice(totalpage.search('page') + 5);
    console.log(totalpages);
    var novels = {
      url: URL + page,
      idgenres: idgenres,
      page: page,
      data: data,
      totalpage: parseInt(totalpages)
    };

    res.send(JSON.stringify(novels));
  });
});

module.exports = router;
