// ==UserScript==
// @name        /r/LoL Oddshot Bot Link Replacer
// @namespace   justjustin.rlol.OddshotBotLinkReplacer
// @description Replaces oddshot.tv links with youtube mirrors from oddshotbot
// @include     https://www.reddit.com/r/leagueoflegends/*
// @exclude     https://www.reddit.com/r/leagueoflegends/comments/*
// @version     1
// @grant       none
// ==/UserScript==

function replaceLink($item, url) {
    $item.querySelector("p.title a.title").href = url;
    console.log( {msg: "Replacing link", item:$item, url:url} );
}
function replaceOddShotLink($item) {
    var commentURL = $item.querySelector("a.comments").href;
    
    var req = new XMLHttpRequest();
    req.open("GET", commentURL);
    req.mydata = {item:$item, link:commentURL};
    req.responseType = "document";
    req.onload = function(e) {
        var dom = req.response;
        if (!dom) {
            return replaceLink(req.mydata.item, req.mydata.link);
        }
        var $comments = dom.querySelectorAll("div.commentarea div.nestedlisting>div.thing");
        for (var i = 0; i < $comments.length; ++i) {
            if ($comments[i].querySelector("a.author").innerHTML == "OddshotBot") {
                var $link = $comments[i].querySelector("div.entry div.usertext-body a");
                if ($link && $link.innerHTML == "YouTube Mirror") {
                    return replaceLink(req.mydata.item, $link.href);
                }
            }
        }
        return replaceLink(req.mydata.item, req.mydata.link);
    }
    req.send();
}

function checkPageItems() {
    var $items = document.querySelectorAll("#siteTable>div.thing");
    for (var i = 0 ; i < $items.length; ++i) {
        var $link = $items[i].querySelector("span.domain a");;
        if ($link && $link.innerHTML == "oddshot.tv") {
            replaceOddShotLink($items[i]);
        }
    }
}
checkPageItems();