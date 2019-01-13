
/**
 *project: Common Header Widgets
 *version: 2.0
 *create: 2013-8-14
 *update: 2013-8-14 18:00 1.0
 *update: 2013-9-22 15:54 1.1
 *update: 2013-11-4 17:30 2.0
 *author: F2E xiechengxiong
 */
define('header',['F', 'public_login'], function (f) {//依赖F，所以把F模块引进来
    var win = window;
    var options = {
        maxWidth: 100,//用户名显示最大长度
        myUrl: 'http://my.ifeng.com/?_c=index&_a=my',//个人中心地址
        exitUrl: 'http://my.ifeng.com/?_c=index&_a=logout&backurl=' + win.location.href//退出登录地址
    };
    var Fn = {
        /**
         * 初始化
         */
        init: function () {
            this.more = f.query('#f-more')[0];
            this.moreBox = f.query('#f-more-box')[0];
            this.loginNone = f.query('#f-login-none')[0];
            this.loginDetail = f.query('#f-login-detail')[0];
            win['REG_LOGIN_CALLBACK'](1, Fn.loginCallback);
            win['IS_LOGIN']() && win['GLOBAL_LOGIN'] && win['GLOBAL_LOGIN']();
            this.initFixBrowser();
            this.bindEvent();
        },
        /**
         * 绑定事件
         */
        bindEvent: function () {
            f.on(f.query('#f-header')[0], 'click', function (e) {
                var target = e.target || win.event.srcElement;
                var role = target.getAttribute('data-role');
                switch (role) {
                    case 'f-login':
                        win['GLOBAL_LOGIN'] && win['GLOBAL_LOGIN']();
                        break;
                    /*case 'f-login-out': Fn.loginOut(); break;*/
                    default:
                        break;
                }
            });
            f.on(this.more, 'mouseenter', function () {
                Fn.disMoreBox('block');
            });
            f.on(this.more, 'mouseleave', function () {
                Fn.disMoreBox('none');
            });
        },
        /**
         * 是否显示更多列表
         */
        disMoreBox: function (dis) {
            this.moreBox.style.display = dis;
            if (this.ifr) {
                this.ifr.style.height = this.moreBox.offsetHeight + 'px';
            }
        },
        /**
         * 获取iframe对象
         * @param w iframe宽度
         * @returns {String} 返回html字符串
         */
        getIfr: function (w) {
            return '<iframe src="about:blank" frameborder="0" width="' + w + '" height="0"></iframe>';
        },
        /**
         * 做IE下的浏览器兼容，添加iframe
         */
        initFixBrowser: function () {
            if (/msie/g.test(win.navigator.userAgent.toLocaleLowerCase())) {
                f.append(this.moreBox, this.getIfr(48));
                this.ifr = f.query('iframe', this.moreBox)[0];
            }
        },
        /**
         * 登录成功回调
         * @param obj 返回用户名或者对象
         */
        loginCallback: function (obj) {
            var username = 'string' === typeof obj ? obj : obj['uname'];
            Fn.loginDetail.innerHTML = '<span class="cRed"><span class="user"><a href="' + options.myUrl + '" target="_blank">' + username + '</a></span><span><a href="' + options.myUrl + '" target="_blank">...</a></span></span><a data-role="f-login-out" href="' + options.exitUrl + '" class="cGray">退出</a>';
            Fn.loginDetail.style.display = 'inline';
            Fn.loginNone.style.display = 'none';
            var user = f.query('.user', this.loginDetail)[0];
            var width = user.offsetWidth > options.maxWidth ? options.maxWidth : options.maxWidth + 20;
            user.style.width = width + 'px';
        }/*,
         *//**
         * 退出登录
         *//*
         loginOut: function() {
         win['GLOBAL_LOGIN_OUT'](function () {
         win.location.reload();
         });
         }*/
    };
    Fn.options = options;
    return Fn;
});

/**
 *project: Search Widgets
 *version: 1.0
 *depends: F 1.2.0
 *create: 2013-10-21
 *update: 2013-10-21 11:00 1.0
 *author: F2E xiechengxiong
 */

define('search',['F', 'keywords'], function(f) {//依赖F，所以把F模块引进来
    var win = window;
    var doc = document;
    var options = {//组件的默认配置
        id: null,//容器id
        defType: 0,//默认选中类型索引
        types: [
            {
                text: '站内',//类型名称
                name: 'q',//输入框名称
                subUrl: 'http://search.ifeng.com/sofeng/search.action', //表单提交类型
                placeHolder: '',//占位字符
                isShowTips: false,//是否显示联想提示
                tips: null,//提示列表的自定义处理。由于各种提示所产生的UI不一致，所以不做统一处理
                extData: {c: 1}//提交的时候附加的数据
            },
            // {
            //     text: '站外',
            //     name: 'q',
            //     subUrl: 'http://sou.ifeng.com/bsearch/bsearch.do',
            //     placeHolder: '',
            //     isShowTips: false,
            //     tips: null,
            //     extData: null
            // },
            {
                text: '证券',
                name: 'keyword',
                subUrl: 'http://app.finance.ifeng.com/hq/search.php',
                placeHolder: '上证指数',
                isShowTips: true,
                tips: {
                    url: 'http://app.finance.ifeng.com/hq/suggest_v2.php',
                    ui: function(i, d, cls, val) {
                        var _types = {stock: '股票', fund: '基金', hkstock: '港股', forex: '外汇', bond: '债券'};
                        function lw(str, key) {
                            return str.replace(key, "<strong>" + key + "</strong>");
                        }
                        return '<tr data-index="'+ i +'"'+ cls +'><td>'+ lw(d['s'], val.toUpperCase()) +'</td><td>'+ lw(d['n'], val) +'</td><td>'+ lw(d['p'], val.toUpperCase()) +'</td><td>'+ _types[d['t']] +'</td></tr>';
                    },
                    key: 'q',
                    cb: 'cb',
                    openUrl: function(d) {
                        return 'http://finance.ifeng.com/app/hq/' + d['t'] + '/' + (d['t'] === 'forex' ? d['s']: d['c']);
                    }
                },
                extData: null
            },
            {
                text: '汽车',
                name: 'keyword',
                subUrl: 'http://car.auto.ifeng.com/lib/car/suggest_go.php',
                placeHolder: '输入品牌或车系',
                isShowTips: true,
                tips: {
                    url: 'http://car.auto.ifeng.com/lib/car/suggest_jsonp.php',
                    ui: function(i, d, cls) {
                        return '<tr data-index="'+ i +'"'+ cls +'><td>'+ d[2] +'</td></tr>';
                    },
                    key: 'keyword',
                    cb: 'callback',
                    openUrl: function(d) {
                        return 'http://car.auto.ifeng.com/lib/car/suggest_go.php?bname=' + escape(d[0]) + '&sname=' + escape(d[1]);
                    },
                    extData: function(d) {
                        return [d[0], d[1]];
                    }
                },
                extData: {bname: '', sname: ''}
            },
            {
                text: '视频',
                name: 'q',
                subUrl: 'http://search.ifeng.com/sofeng/search.action',
                placeHolder: '',
                isShowTips: false,
                tips: null,
                extData: {c: 5}
            }
        ]
    };
    var Fn = {//主体控制对象
        /**
         * 初始化方法
         * @param opts 自定义配置
         */
        init: function(opts) {
            options = f.extend(options, opts);//将传入的配置与默认配置合并
            var wrap = f.query('#'+ options.id);
            if(wrap.length < 1) {
                return;
            }
            this.bs = this.getBrowser();
            var obj = wrap[0];
            this.compatible();
            this.type = options.types[options.defType];
            obj.innerHTML = this.createSearchUI();
            this.wrap = f.query('.f-search-wrap', obj)[0];
            this.checked = f.query('.checked', obj)[0];
            this.typeWrap = f.query('.type', obj)[0];
            this.typeList = f.query('.type ul', obj)[0];
            this.extWrap = f.query('.ext', obj)[0];
            this.text = f.query('.text input', obj)[0];
            this.form = f.query('form', obj)[0];
            this.tips = f.query('.tips', obj)[0];
            this.button = f.query('button', obj)[0];
            this.initFixBrowser();
            this.bindEvent();
        },
        /**
         * 绑定事件
         */
        bindEvent: function() {
            f.on(this.form, 'keypress', function (e){
                if(e.keyCode === 13) {//阻止按下enter键的时候表单自动提交
                    return false;
                }
            });
            f.on(this.text, 'keyup', function(e) {//输入框输入监控
                var c = e.keyCode;
                switch(true) {
                    case c === 38: Fn.focusChange(Fn.tipsIndex - 1); break;//上键
                    case c === 40: Fn.focusChange(Fn.tipsIndex + 1); break;//下键
                    case c === 13: Fn.openResult(); break;//enter键
                    case c === 8 || (c >= 46 && c <= 111) || (c >= 186 && c <= 222): Fn.textChange(); break;//其它有效的字符键
                    default: break;
                }
            });
            f.on(this.text, 'focus', function(e) {//获得焦点
                Fn.textFocus();
            });
            f.on(this.text, 'blur', function(e) {//失去焦点
                Fn.textBlur();
            });
            f.on(this.tips, 'mouseenter', function(e) {//鼠标进入联想提示列表
                Fn.focusChange(parseInt(this.getAttribute('data-index')));
            }, {delegate: 'tr'});
            f.on(this.tips, 'mouseleave', function(e) {//鼠标离开联想提示列表
                Fn.disTips('none');
            });
            f.on(this.tips, 'click', function(e) {//点击联想提示列表
                Fn.openResult();
            }, {delegate: 'tr'});
            f.on(this.typeWrap, 'mouseleave', function(e) {//鼠标离开类型列表
                Fn.disTypeList('none');
            });
            f.on(this.checked, 'mouseenter', function(e) {//鼠标类型头
                f.addClass(e.target, 'hover');
            });
            f.on(this.checked, 'mouseleave', function(e) {//鼠标离开类型头
                f.removeClass(e.target, 'hover');
            });
            f.on(this.button, 'mouseenter', function(e) {//鼠标类型头
                f.addClass(e.target, 'hover');
            });
            f.on(this.button, 'mouseleave', function(e) {//鼠标离开类型头
                f.removeClass(e.target, 'hover');
            });
            f.on(this.wrap, 'click', function(e) {//点击代理
                var target = e.target;
                var role = target.getAttribute('data-role');
                switch(role) {
                    case 'checked': Fn.disTypeList(''); break;//点击类型
                    case 'type': Fn.typeChange(parseInt(target.getAttribute('data-index'))); break;//点击类型列表
                    default: break;
                }
            });
        },
        /**
         * 将从后台渠道的占位字符组装进配置
         */
        compatible: function() {
            if(win['PH_HOTWORDS']) {
                // 站内  站外  证券 汽车  视频
                for(var i = 0, len = options.types.length; i < len; i++) {
                    var option = options.types[i].text;
                    if(option === '站内' || option === '视频') {
                        options.types[i].placeHolder = win['PH_HOTWORDS'][1];
                    } else if(option === '证券') {
                        options.types[i].placeHolder = win['PH_HOTWORDS'][0];
                    }
                }
            }
        },
        /**
         * 创建附带参数UI
         * @returns {string} 返回HTML字符串
         */
        createExtUI: function() {
            var t = this.type;
            var el = '';
            for(var j in t.extData) {
                if(typeof t.extData[j] !== 'undefined') {
                    el += '<input type="hidden" name="'+ j +'" value="'+ t.extData[j] +'" />';
                }
            }
            return el;
        },
        /**
         * 创建搜索整个UI
         * @returns {string} 返回HTML字符串
         */
        createSearchUI: function() {
            var t = this.type;
            var input = '<div class="text"><input type="text" name="'+ t.name +'" value="'+ t.placeHolder +'" data-role="text" autocomplete="off" /></div>';
            var tl = '';
            for(var i = 0, len = options.types.length; i < len; i++) {
                tl += '<li><a href="javascript:void(0);" data-role="type" data-index="'+ i +'">'+ options.types[i].text +'</a></li>';
            }
            var type = '<div class="type"><div class="checked" data-role="checked">'+ t.text +'</div><ul style="display: none;">'+ tl +'</ul></div>';
            var btn = '<div class="btn"><button type="submit"></button></div>';
            var tips = '<div class="tips" style="display: none;"></div>';
            var ext = '<div class="ext">'+ this.createExtUI() +'</div>';
            return '<div class="f-search-wrap"><form method="get" action="'+ t.subUrl +'" target="_blank">'+ type + input + btn + tips + ext +'</form></div>';
        },
        /**
         * 创建联想提示UI
         * @returns {string} 返回HTML字符串
         */
        createTipsUI: function() {
            var t = this.type;
            var html = '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody>';
            for(var i = 0, len = this.data.length; i < len; i++) {
                var cls = i % 2 === 0 ? '' : ' class="bg"';
                html += t.tips.ui(i, this.data[i], cls, this.text.value);
            }
            if(t.tips.extData) {//如果错在附加数据，则添加附加数据表单项
                var ext = t.tips.extData(this.data[0]);
                f.each(f.query('input', this.extWrap), function(i) {
                    this.value = ext[i];
                });
            }
            return html +'</tbody></table>';
        },
        /**
         * 是否显示联想提示
         * @param dis 显示字符串
         */
        disTips: function(dis) {
            this.tipsIndex = 0;
            this.tips.style.display = dis;
            if(this.ifr) {
                this.ifr.style.display = dis;
            }
        },
        /**
         * 是否显示类型列表
         * @param dis 显示字符串
         */
        disTypeList: function(dis) {
            this.typeList.style.display = dis;
            if(this.typeList.nextSibling) {
                this.typeList.nextSibling.style.display = dis;
            }
            if(dis === 'none') {
                f.removeClass(this.checked, 'up');
            } else {
                f.addClass(this.checked, 'up');
            }
        },
        /**
         * 联想提示鼠标滑动变色处理
         * @param index 当前行数的索引值
         */
        focusChange: function(index) {
            var tr = f.query('tr', this.tips);
            index = index === tr.length ? 0 : index === -1 ? tr.length - 1 : index;//判断是否处于第一行或者最后一行
            f.each(f.query('tr', this.tips), function(i) {
                if(i === index) {
                    f.addClass(this, 'focus');
                } else {
                    f.removeClass(this, 'focus');
                }
            });
            this.tipsIndex = index;
        },
        /**
         * 获得浏览器名称及版本
         * @returns {{name: *, version: *}} 返回名称和版本的对象字面量，对于外壳浏览器360不做判断
         */
        getBrowser: function() {
            var bs = {};
            var u = win.navigator.userAgent.toLocaleLowerCase(),
                sougou = /se 2.x metasr 1.0/,
                qqbrowser = /(qqbrowser)\/([\d.]+)/,
                msie = /(msie) ([\d.]+)/,
                chrome = /(chrome)\/([\d.]+)/,
                firefox = /(firefox)\/([\d.]+)/,
                safari = /(safari)\/([\d.]+)/,
                opera = /(opera)\/([\d.]+)/,
                b = u.match(sougou) || u.match(qqbrowser) || u.match(msie) || u.match(chrome) || u.match(firefox) || u.match(safari) || u.match(opera) || [0, 0, 0];
            if (b[1] === 'opera') {
                b[2] = u.match(/(version)\/([\d.]+)/)[2];
            }
            if (u.match(sougou)) {
                b = [];
                b[1] = 'sougo';
                b[2] = 'msie7.0';
            }
            bs[b[1]] = b[2];
            bs['name'] = b[1];
            bs['version'] = b[2];
            return bs;
        },
        /**
         * 创建iframe
         * @param w iframe宽度
         * @param h iframe高度
         * @returns {HTMLElement} iframe对象
         */
        getIfr: function(w, h) {
            var ifr = doc.createElement('iframe');
            ifr.src = 'about:blank';
            ifr.setAttribute('frameborder', '0');
            ifr.style.display = 'none';
            ifr.width = w;
            ifr.height = h;
            return ifr;
        },
        /**
         * 浏览器兼容性处理
         */
        initFixBrowser: function() {
            if(this.bs['name'] === 'msie') {//如果为IE，则在其下边加上iframe，防止flash或者select对齐进行覆盖
                this.typeList.parentNode.appendChild(this.getIfr(62, 142));
                this.ifr = this.getIfr(302, '100%');
                this.ifr.style.top = '28px';
                this.wrap.appendChild(this.ifr);
            }
        },
        /**
         * 异步请求联想数据
         * @param val 发送时附带的数据
         * @param fn 请求成功后执行的回调函数
         */
        loadTips: function(val, fn) {
            var tips = this.type.tips;
            var script = doc.createElement('script');
            var head = doc.getElementsByTagName('head')[0];
            script.type = 'text/javascript';
            var fnName = 'jsonp_' + Math.floor(Math.random()*10E10) + '_' + new Date().getTime();
            win[fnName] = function() {
                fn && fn();
                head.removeChild(script);
            };
            head.appendChild(script);
            script.src = tips.url +'?'+ tips.cb +'='+ fnName + '();&'+ tips.key +'='+ encodeURIComponent(val);
        },
        /**
         * 按下enter键或者点击联想列表时的动作处理
         */
        openResult: function() {
            if(this.data && this.data.length > 0) {//如果当前联想提示有数据，则用open方式提交，否则直接提交表单
                win.open(this.type.tips.openUrl(this.data[this.tipsIndex]));
            } else {
                this.form.submit();
            }
        },
        /**
         * 输入框失去焦点事件处理
         */
        textBlur: function() {
            if(this.text.value === '') {
                this.text.value = this.type.placeHolder;
            }
        },
        /**
         * 输入框文本变化处理方法
         */
        textChange: function(){
            if(this.type.isShowTips) {//如果当前类型有联想提示的话则请求
                this.loadTips(this.text.value, function() {
                    Fn.data = win['suggest_json'] || [];
                    if(Fn.data.length > 0) {
                        Fn.tips.innerHTML = Fn.createTipsUI();
                        Fn.disTips('');
                        if(Fn.ifr) {//如果为IE浏览器，则改变iframe高度
                            Fn.ifr.style.height = Fn.tips.offsetHeight +'px';
                        }
                    } else {//数据为空时不显示联想提示列表
                        Fn.disTips('none');
                    }
                });
            }
        },
        /**
         * 输入框获得焦点事件处理
         */
        textFocus: function() {
            if(this.text.value === this.type.placeHolder) {
                this.text.value = '';
            }
        },
        /**
         * 类型变化处理方法
         * @param i 类型的索引值
         */
        typeChange: function(i) {
            var f = this.text.value === this.type.placeHolder;
            var t = this.type = options.types[i];
            this.disTypeList('none');
            this.checked.innerHTML = t.text;
            this.extWrap.innerHTML = this.createExtUI();
            this.text.name = t.name;
            this.text.value = (this.text.value !== t.placeHolder && !f) ? this.text.value : t.placeHolder;
            this.form.action = t.subUrl;
        }
    };
    Fn.options = options;
    return Fn;
});