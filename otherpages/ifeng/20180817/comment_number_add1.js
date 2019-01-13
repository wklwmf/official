define("recommend.comment_number", ["F"], function (F) {
    var __commentNumberSpan = null, __commentNumberUrl = null, __url = "//comment.ifeng.com/get.php", __docurl = "", __comment_interval = null, __targetUrl = "";
    var recommend_comment_number = function () {
        __comment_interval = setInterval(function () {
            if (F.query("#recommend div.js_recommendList").length > 0) {
                clearInterval(__comment_interval);
                __commentNumberSpan = F.find(F.query("#recommend div.js_recommendList")[0], "span.s02");
                __commentNumberUrl = F.find(F.find(F.query("#recommend div.js_recommendList")[0], "h2"), "a")[0];
                if ("undefined" !== typeof __commentNumberUrl && __commentNumberUrl.href) {
                    __docurl = (__commentNumberUrl.href).split("#")[0].split("?")[0]
                } else {
                    return false
                }
                __targetUrl = "//gentie.ifeng.com/view.html?docUrl=" + encodeURIComponent(__docurl) + "&docName=" + encodeURIComponent(F.trim(__commentNumberUrl.innerHTML));
                F.ajax({
                    url: __url,
                    dataType: "jsonp",
                    data: {format: "js", job: 3, docurl: __docurl},
                    cache: true,
                    callback: "callbackRecommendCommentCount",
                    success: function (data) {
                        F.html(F.find(__commentNumberSpan, "em"), data)
                    }
                })
            }
        }, 200)
    };
    return recommend_comment_number
});
define("comment.number", ["F"], function (F) {
    var peopleNumber = null, commentNumber = null, people_interval = null, comment_interval = null, _docUrl = "", _docName = "";
    var cmtCountUrl = "//comment.ifeng.com/get.php";
    return function (config) {
        _docUrl = encodeURIComponent(config.docUrl);
        _docName = encodeURIComponent(config.docName);
        if ("undefined" === typeof window["PEOPLE_NUMBER"] || "undefined" === typeof window["COMMENT_NUMBER"]) {
            F.ajax({
                url: cmtCountUrl,
                dataType: "jsonp",
                data: {doc_url: config.docUrl, format: "js", job: 1, callback: "callbackGetFastCommentCount"},
                cache: true,
                callback: "callbackGetFastCommentCount",
                success: function (cmtJson) {
                    if (!cmtJson.allow_comment && !cmtJson.count) {
                        return false
                    } else {
                        var _skey = "", _speUrl = "";
                        try {
                            if ("undefined" !== typeof config.skey) {
                                _skey = "&skey=" + config.skey
                            }
                            if ("undefined" !== typeof config.speUrl) {
                                _speUrl = "&speUrl=" + encodeURIComponent(config.speUrl)
                            }
                            var _url = "//gentie.ifeng.com/view.html?docUrl=" + _docUrl + "&docName=" + _docName + _skey + _speUrl + "&pcUrl=" + config.pcUrl;
                            window["PEOPLE_NUMBER"] = cmtJson.join_count / 1;
                            window["COMMENT_NUMBER"] = cmtJson.count / 1;
                            people_interval = setInterval(function () {
                                document.getElementById('js_comment_box03').style.display = 'block';
                                peopleNumber = F.query(".js_peopleNumber");
                                if (peopleNumber.length > 0) {
                                    for (var i = 0, l = peopleNumber.length; i < l; i++) {
                                        if (peopleNumber[i].tagName === "A") {
                                            F.attr(peopleNumber[i], "href", _url)
                                        }
                                        F.html(F.query("em", peopleNumber[i]), window["PEOPLE_NUMBER"])
                                    }
                                    clearInterval(people_interval)
                                }
                            }, 300);
                            comment_interval = setInterval(function () {
                                document.getElementById('js_comment_box03').style.display = 'block';
                                commentNumber = F.query(".js_commentNumber");
                                if (commentNumber.length > 0) {
                                    for (var j = 0, jl = commentNumber.length; j < jl; j++) {
                                        if (commentNumber[j].tagName === "A") {
                                            F.attr(commentNumber[j], "href", _url)
                                        }
                                        F.html(F.query("em", commentNumber[j]), window["COMMENT_NUMBER"])
                                    }
                                    clearInterval(comment_interval)
                                }
                            }, 300)
                        } catch (ex) {
                        }
                    }
                }
            })
        }
    }
});