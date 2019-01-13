define('header', ['public_login'], function () {
    var win = window;
    var doc = document;
    var getCookie = function (name) {
        var cookie = '; ' + document.cookie;
        var pointer = cookie.indexOf('; ' + name + '=');
        var nextPointer = cookie.indexOf(';', pointer + 2);
        if (pointer >= 0) {
            return decodeURIComponent(
                cookie.substring(pointer + name.length + 3, nextPointer > 0 ? nextPointer : cookie.length)
            );
        }
        return '';
    };
    var clearCookie = function (name, path, domain) {
        var cStrArr = [];
        cStrArr.push(name + '=');
        cStrArr.push(path ? '; path=' + path : '');
        cStrArr.push(domain ? '; domain=' + domain : '');
        cStrArr.push('; expires=Thu, 01-Jan-70 00:00:01 GMT');
        document.cookie = cStrArr.join('');
    };
    var timestampIndex = 0;
    var jsonp = function (options) {
        var cache = typeof options.cache !== 'undefined' ? cache : false;
        var url = options.url;
        var success = options.success;
        var data = [];
        var scope = options.scope || win;
        var callback;
        if (typeof options.data === 'object') {
            for (var k in options.data) {
                data.push(k + '=' + encodeURIComponent(options.data[k]));
            }
        }
        if (typeof options.callback === 'string' && options.callback !== '') {
            callback = options.callback;
        } else {
            callback = 'f' + new Date().valueOf().toString(16) + timestampIndex;
            timestampIndex++;
        }
        data.push('callback=' + callback);
        if (cache === false) {
            data.push('_=' + new Date().valueOf() + timestampIndex);
            timestampIndex++;
        }
        if (url.indexOf('?') < 0) {
            url = url + '?' + data.join('&');
        } else {
            url = url + '&' + data.join('&');
        }
        var insertScript = doc.createElement('script');
        insertScript.src = url;
        win[callback] = function () {
            success.apply(scope, [].slice.apply(arguments).concat('success', options));
        };
        insertScript.onload = insertScript.onreadystatechange = function () {
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                insertScript.onload = insertScript.onreadystatechange = null;
                insertScript.parentNode.removeChild(insertScript);
            }
        };
        var oScript = doc.getElementsByTagName('script')[0];
        oScript.parentNode.insertBefore(insertScript, oScript);
    };
    var init = function () {
        initLogin();
        checkLogin();
    };
    var initLogin = function () {
        window['REG_LOGIN_CALLBACK'](3, function () {
            window.location.reload();
        });
        window['REG_LOGIN_CALLBACK'](1, function (optionsORname) {
            process_login_callback();
        });
        if (window['IS_LOGIN']()) {
            // 如果是已登陆即调用全局方法,将回调传入.
            window['GLOBAL_LOGIN']();
        } else {
            if (device.type == 'mobile' || device.type == 'pad') {
                // 如果是手机设备
                document.getElementById('btnSwapLogin').onclick = function () {
                    window.location.href = '//id.ifeng.com/muser/login?cb=' + window.location.href;
                    return false;
                };
            } else {
                // 如果不是收集设备
                document.getElementById('btnSwapLogin').onclick = function () {
                    window['GLOBAL_LOGIN']();
                    return false;
                };
            }
        }
    };
    var checkLogin = function () {
        var sid = getCookie('sid');
        //sendCount(sid);
        if (sid !== '') {
            jsonp({
                url: 'https://id.ifeng.com/api/checklogin',
                data: { sid: sid },
                success: function (result) {
                    showBox(!!result.code);
                },
            });
        } else {
            showBox(false);
        }
    };
    /*
    var sendCount = function(userSid) {
        var sendUrl = 'http://18.ifeng.com/count?sid=' + userSid;
        var sendInsertScript = doc.createElement("script");
        sendInsertScript.src = sendUrl;
        var oScript = doc.getElementsByTagName("script")[0];
        oScript.parentNode.insertBefore(sendInsertScript, oScript)
    };
    */
    var getUserName = function(){
        // var sid = getCookie('sid');
        var userName = getCookie('IF_USER') ? decodeURIComponent(getCookie('IF_USER')) : '凤凰网友';
        return userName;
    }

    var showBox = function (isLogin) {
        if (!isLogin) {
            clearCookie('sid', '/', '.ifeng.com');
        }
    };
    var process_login_callback = function (optionsORname) {

        var userName = getUserName();

        var msg =
            '<a id="logName" class="LoginAfterName" href="javascript:void(0);"><span id="theLogName">' + userName + '</span><span id="logNameSpan">&nbsp;</span></a>' +
            '<a href="javascript:void(0);" class="logout" id="btnlogout">退出</a>' +
            '<ul id="loglist" style="display: none;">' +
            '<li><a href="//id.ifeng.com" target="_blank">进入个人中心</a></li>' +
            '<li class="BgNone"><a href="http://zmt.ifeng.com/" target="_blank">进入我的大风号</a></li>' + '</ul>';

        document.getElementById('welcome').innerHTML = msg;
        document.getElementById('f-login-none').style.display = 'none';
        document.getElementById('btnSwapLogin').style.display = 'none';
        document.getElementById('register').style.display = 'none';
        document.getElementById('welcome').style.display = 'block';

        document.getElementById('logName').onclick = function () {
            var logNamespan = document.getElementById('logNameSpan');
            var loglist = document.getElementById('loglist');
            if (loglist.style.display == 'block') {
                loglist.style.display = 'none';
            } else {
                loglist.style.display = 'block';
            }
            if (logNamespan.style.backgroundPosition == '6px -298px') {
                logNamespan.style.backgroundPosition = '6px -198px';
            } else {
                logNamespan.style.backgroundPosition = '6px -298px';
            }
        }

        document.getElementById('btnlogout').onclick = function () {
            window['GLOBAL_LOGIN_OUT']();
        }

    };
    return init;
});