var express = require("express");
var router = express.Router();
const request = require("request-promise");
const cheerio = require("cheerio");
var cookieParser = require("cookie-parser");

/* GET users listing. */
router.get("/", function(req, res, next) {
  var novel = [];
  var page = req.query.page;
  const URL =
    "https://bestlightnovel.com/novel_list?type=topview&category=all&state=completed&page=";

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
  var totalpages = null;
  getPageContent(URL + page).then($ => {
    // console.log(
    //   "http://www.nettruyen.com/tim-truyen?status=-1&sort=15&page=" + page
    // );
    // var pagett = $(".pagination-outter ul li.hidden").text();
    // totalpage = pagett.slice(pagett.search("/") + 2);
    $(".cotgiua .wrap_update .update_item").each(function(result) {
      
      $(this)
        .find("h3.nowrap a")
        .each(function() {
          novelsname = $(this).text();
         var novelid = $(this).attr('href');
         idnovel = novelid.slice(novelid.search(".com/") + 5);
        //   console.log(idnovel);
        });
      $(this)
        .find(".chapter")
        .each(function() {
          lasterchapter = $(this).text();
          var chapterid = $(this).attr('href');
          idchapter = chapterid.slice(chapterid.search(idnovel+'/') + (idnovel.length+1));
        //   console.log(idchapter)
        });

        $(this)
        .find("a img")
        .each(function() {
          cover = $(this).attr('src');
          // console.log(cover);
        //   console.log(idchapter)
        });
          
        data.push({
          'novelsname': novelsname,
          'idnovel': idnovel,
          'lasterchapter': lasterchapter,
          'idchapter': idchapter,
          'cover': cover
        })
    });
    var totalpage = $('.phan-trang a:last-child').text();
    totalpages = totalpage.slice(5,9);
    // console.log(totalpages);
    var novels = {
      url: "https://novelonlinefree.info/novel_list?type=topview&category=all&state=completed&page=" + page,
      page: page,
      data: data,
      totalpage: parseInt(totalpages)
    };

    res.send(JSON.stringify(novels));
  });
});

module.exports = router;
