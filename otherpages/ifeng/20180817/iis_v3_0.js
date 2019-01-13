/**
 * iis front js v3
 * fengxuewu 2017/3/23 
*/
(function () {
	var iis3_version = '3.0';	
	//动态生成回调函数名称
	if (typeof(window.iis3) == 'undefined' || window.iis3.version != iis3_version) {

		window.iis3 = {
			version: iis3_version,
			click_target: '_blank',
			res_arr:{},
			cl:0,
			display_1:"d1_" + new Date().getTime() + "_" + parseInt(Math.random()*10000),
			display_2:"d2_" + new Date().getTime() + "_" + parseInt(Math.random()*10000),
			display_3:"d3_" + new Date().getTime() + "_" + parseInt(Math.random()*10000),
			display_4:"d4_" + new Date().getTime() + "_" + parseInt(Math.random()*10000),

			show_a: function(p,callback) {
				try{

					//var url = 'http://10.32.23.199/showcode';				
					var url = window.location.protocol+'//iis1.deliver.ifeng.com/showcode';

					var ap = '', w = '', h = '';
					//ide need
					var adunitid = '', channel = '', f = '', fid = '',custom = '';
					var uid = this.get_cookie('userid');			
					
					var num = 0;
					var is_ide = 0;
					
					//zongbianshi hezuo tuiguang like _zbs_baidu_news fengxw@ifeng.com 2018/11/26
					var reg = /[&|#|\?]+(_.*?)(?=&|\s|\?|\||#|%|$)/;
					var ch_arr = reg.exec(window.location.href);
                    var ch = '';
					if(!ch_arr || ch_arr == null){
					}else{
						ch = ch_arr[1];
					}

					if(typeof(p.aids) != 'undefined' || p.aids != ""){												
						//for (var ai in p.aids) {
                         for (var ai=0;ai < p.aids.length;ai++){

							//if (ap == '') ap += p.aids[ai].ap; else ap += ',' + p.aids[ai].ap;
							//if (w == '') w += p.aids[ai].w; else w += ',' + p.aids[ai].w;
							//if (h == '') h += p.aids[ai].h; else h += ',' + p.aids[ai].h;

							if (num == 0) ap += p.aids[ai].ap; else ap += ',' + p.aids[ai].ap;
							if (num == 0) w += p.aids[ai].w; else w += ',' + p.aids[ai].w;
							if (num == 0) h += p.aids[ai].h; else h += ',' + p.aids[ai].h;

							if(typeof(p.aids[ai].adunitid) != 'undefined' && p.aids[ai].adunitid!="" && typeof(p.aids[ai].channel) != 'undefined' && p.aids[ai].channel!=""){
								is_ide = 1;								
								if (adunitid == '') adunitid += p.aids[ai].adunitid; else adunitid += ',' + p.aids[ai].adunitid;
								if (channel == '') channel += p.aids[ai].channel; else channel += ',' + p.aids[ai].channel;								
								if(typeof(p.aids[ai].f) != 'undefined' && p.aids[ai].f!=""){
									if (num == 0) f += p.aids[ai].f; else f += ',' + p.aids[ai].f;
								} 								
								if(typeof(p.aids[ai].fid) != 'undefined' && p.aids[ai].fid!=""){
									if (num == 0) adunitid += p.aids[ai].fid; else fid += ',' + p.aids[ai].fid;
								}								
								if(typeof(p.aids[ai].custom) != 'undefined' && p.aids[ai].custom!=""){
									if (num == 0) custom += p.aids[ai].custom; else custom += ',' + p.aids[ai].custom;								
								}																								
							}else{
								if (num == 0) adunitid += ''; else adunitid += ',' + '';
								if (num == 0) channel += ''; else channel += ',' + '';
								if (num == 0) f += ''; else f += ',' + '';
								if (num == 0) adunitid += ''; else fid += ',' + '';
								if (num == 0) custom += ''; else custom += ',' + '';

							}
							num++;
						}
						num = 0;
					}
					
					url += '?adids=' + ap;				
					url += '&uid=' + uid;
					url += '&w=' + w;
					url += '&h=' + h;					
					url += '&dm=' + this.get_domain();
					url += '&tc=' + new Date().getTime();
					if(ch!=""){
                        url += '&ch=' + ch;
					}
					if(is_ide == 1){
						url += '&adunitid=' + adunitid;
						url += '&channel=' + channel;
						url += '&f=' + f;
						url += '&fid=' + fid;
						url += '&custom=' + custom;
					}

					//change callback function
					eval("window.iis3."+this.display_1+" = window.iis3.display1;");
					eval("window.iis3."+this.display_2+" = window.iis3.display2;");
					eval("window.iis3."+this.display_3+" = window.iis3.display3;");
					if(p.mode == 4){
						if(typeof(callback) != 'undefined' && callback!=""){
							eval("window.iis3."+this.display_4+" = "+callback+";");	
						}else{
							return;
						}
					}
					
					//new arr
					if(typeof(p.aids) != 'undefined' || p.aids != ""){
						//for (var ai in p.aids) {
						  for (var ai=0;ai < p.aids.length;ai++){

							if(typeof(p.aids[ai].ap) != 'undefined' && typeof(p.aids[ai].res) != 'undefined'){
								this.res_arr[p.aids[ai].ap] = p.aids[ai].res;
							}							
						}
					}else{
						return;
					}

					//用户请求广告的次数轮播计数
					if(this.cl == 0){					
						if(this.is_index()){
							var cookiename = "ifengRotator_iis3";
						}else{
							var cookiename = "ifengRotator_iis3_c";
						}
						this.cl = this.get_cookie(cookiename);
						if (typeof(this.cl) === 'undefined' || this.cl === '' || this.cl == "NaN" || this.cl == 1000) {
							this.cl = parseInt(Math.random() * 10 + 1);
						}
						this.set_cookie(cookiename, ((parseInt(this.cl) + 1)),12);
					}
					url += '&cl=' + this.cl;

					//mode请求方式 1:同步 2:异步 3:同步 返回json变量数据 var jsonGg 4:异步返回回调函数
					if (typeof(p.mode) != 'undefined'){
						if(p.mode == 1){	
							url += '&cb=' + 'iis3.' + this.display_1;						
						}else if(p.mode == 2){
							url += '&cb=' + 'iis3.' + this.display_2;
						}else if(p.mode == 3){
							url += '&cb=' + 'iis3.' + this.display_3;
						}else if(p.mode == 4){
							url += '&cb=' + 'iis3.' + this.display_4;
						}else{
							return;
						}
						
						//change url
						url = this.change_url(url);
						
						//synchronous request;
						if(p.mode == 1 || p.mode == 3){
							document.write('<scr'+'ipt src = "' + url + '" ><\/scr'+'ipt>');
						//asynchronous request;
						}else if(p.mode == 2 || p.mode == 4){
							this.load_script(url);
						}
						
					}else{
						return;
					}
				} catch(e) {}
				
			},						
			// synchronous display code
			//同步回调函数
			display1: function(ps) {
				//var g = {isal: this.isal, iswh: this.iswh};				
				for (var psi in ps) {
					var p = ps[psi];
					var r = this.build_code(p);
				    document.write(r.code);	

				}
			},
			// asynchronous display code (multiple)
			//异步回调函数
			display2: function(ps) {

				for (var psi in ps) {
					var p = ps[psi];
					var r = this.build_code(p);

					this.set_code(p.ap, p.w, p.h, r.code);
				}
			},
		
			//同步回调返回json数据
			display3: function(ps) {				
				window.jsonGg = ps;
			},

			// build code
			build_code: function(p) {
				var r = {code: ''};

				try {					
					//统计使用
					//murls and curls array
					var code = "";
					var span = "";

					if(typeof(p['note']) != 'undefined'){
						span += "<!-- " + p['note'] + " -->";
					}

					span += "<scr"+"ipt>var click_imp_arr = new Array();var imp_arr = new Array();";
														
					if(typeof(p['murls']) != 'undefined'){
						var murls = p['murls'];
						//for (var mi in murls) {
                        for (var mi=0;mi<murls.length;mi++){
							span += ' imp_arr[' + mi + '] = "' + murls[mi] + '";'+"\n";
						}
					}

					if(typeof(p['curls']) != 'undefined'){

						var curls = p['curls'];

						//for (var ci in curls) {
						 for (var ci=0;ci<curls.length;ci++){
							span += ' click_imp_arr[' + ci + '] = "' + curls[ci] + '";'+"\n";
						}
					}
					
					span +='</script>';

					if (typeof(p.code) != 'undefined') {
						code = decodeURIComponent(p.code.replace(/\+/g, "%20")); // decode java URLEncoder.encode
					}
					span = span + "" + code;

					//不是模板	
					var impCode = '<scr'+'ipt>(function(){if(typeof(isTemplet)!="undefined"){if(isTemplet!="on"){sendImp()}else{}isTemplet="off"}else{sendImp()}function sendImp(){if(typeof(imp_arr)!="undefined"){if(undefined!=imp_arr&&""!=imp_arr){for(var j=0;j<imp_arr.length;j++){impHandel(imp_arr[j])}}}}function impHandel(imp){var impressionSource=document.createElement("div");impressionSource.style.display="none";impressionSource.innerHTML="<img id=\'adimpid\' src=\'"+imp+"\' style=\'width:1px;height:1px;border:none;\' />";document.body.insertBefore(impressionSource,document.body.childNodes[0])}})();</script>';
					//var impCode = "<scr"+"ipt></script>";
					span = span + "" +impCode;					
					r.code = span;

				} catch (e) {
					;
				}
				return r;
			},

			 //set code to page (make iframe or directly assign)
			 set_code: function(id, w, h, code) {

				var did = 'iis3_dif_' + id;
				var d = document.getElementById(did);

				if (!d) return;
				if (w == 0) w = '100%'; else w = w + 'px';

				if (h == -1) { // big img of i.ifeng top
					h = Math.round((document.documentElement.clientWidth - 20) / 702 * 151 + 40 + 15 + 4) + 'px';
				} else {
					h = h + 'px';
				}

				if (this.res_arr[id] == 1) {									

					try{  
						var frm = document.createElement('iframe');  
						frm.name = "iis3_if_" + id;  
				    }catch(e){ 
					    var frm = document.createElement('<iframe name="iis3_if_"' + id + '"></iframe>');  
					    
					}
					var content = '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;">' + code + '</body></html>';

					frm.id = "iis3_if_" + id;
					//frm.name = "iis3_if_" + id;
					if (this.is_ie6()) frm.setAttribute("frameborder",0,0);
					else frm.setAttribute("frameborder",0);
					frm.setAttribute("border",0);
					frm.setAttribute("scrolling","no");
					frm.style.width = w;
					frm.style.height = h;
					d.appendChild(frm);
					
					
					var ifrdoc = frm.contentWindow.document?frm.contentWindow.document:frm.contentDocument;
					//ie 5 6 7 8 9
					if(frm.document){						
						ifrdoc.open();
					     frm.contentWindow.contents = content;
						 frm.src="javascript:window[\"contents\"]";
						 ifrdoc.close();
					}else{
						
						ifrdoc.open();
						ifrdoc.write(content);
						ifrdoc.close();
					}
					
				} else {
					d.innerHTML = code;
				}
			},
			change_url: function(str){
				var url_new = "";
				var num = str.indexOf("?");
				var str2 = str.substr(num+1);
				var arr=str2.split("&");				
				arr.sort(this.randomsort);
				for(var i=0;i < arr.length;i++){
					if(i == 0) url_new += "?" + arr[i];else url_new += "&" + arr[i];					
				}			
				return str.substr(0,num) + url_new;
			},
			randomsort:function() {
				return Math.random()>.5 ? -1 : 1;
			},
			// get current domain, support iframe once.
			// (but, referrer is not sure, the request flow return, you should use the cookie transfer.)
			// bugfix, comment parent for 'blocked a frame with origin' error.
			get_domain: function() {
				var dm = location.hostname;
				// gm target
				//var is_gm_v = this.get_cookie('is_ga'+'me_v');
				//if (is_gm_v == '1') {
				//	dm = 'from.ga'+'mes.ifeng.com';
				//}
				// baidu target
				if (this.is_mobile() && (navigator.userAgent.match(/(baidubrowser|baiduboxapp)/i))) {
					dm = 'baidu.ua';
				}
				// uc target
				if (this.is_mobile() && (navigator.userAgent.match(/(ucbrowser|ucweb)/i))) {
					dm = 'uc.ua';
				}
				// qq target
				if (this.is_mobile() && (navigator.userAgent.match(/qqbrowser/i))) {
					dm = 'qq.ua';
				}
				return dm;
			},
			is_index: function(){
				var path = document.location.pathname;
				if(path == "/index.html" || path == "/index.html" || path == "/"){
					return 1;
				}else{
					return 0;
				}								
			},
			// set cookies
			set_cookie: function(name, value, expire) {
				var date = new Date();
				var eStr = '';
				if ("undefined" != typeof expire && expire != "") {					
					expire = new Date(date.getTime() + expire * 60000 * 60);					
					eStr = 'expires=' + expire.toGMTString() + ';'
				}

				document.cookie = name + '=' + escape(value) + ';path=/;' + eStr;
			},
			// get cookie
			get_cookie: function(name) {
				var value = '';
				var part;

				var pairs = document.cookie.split('; ');
				for (var i = 0; i < pairs.length; i++) {
					part = pairs[i].split('=');
					if (part[0] == name) {
						value = unescape(part[1]);
					}
				}
				return value;
			},

			// asynchronous send a url request with random parameter
			m_impression: function (url) {
				var tmr = new Date().getTime()+parseInt(Math.random()*10000);
				if (url.indexOf('?') > 0) {
					url += '&tmr='+tmr;
				} else {
					url += '?tmr='+tmr;
				}
				var img = new Image(1,1);
				img.onload = img.onerror = function() {};
				img.src = url;
				return 1;
			},

			//asynchronous send a url request
			m_click: function (url) {
				var img = new Image(1,1);
				img.onload = img.onerror = function() {};
				img.src = url;
				return 1;
			},

			// asynchronous load js file
			load_script: function (url) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = url;
				document.body.appendChild(script);
			},									
				getQueryString: function(url) {
					var result = {}, queryString = (url && url.indexOf("?")!=-1 && url.split("?")[1]) || location.search.substring(1),
						re = /([^&=]+)=([^&]*)/g, m;
					while (m = re.exec(queryString)) {
						result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
					}
					return result;
				},
			// identify mobile
			is_mobile: function() {
				if ((navigator.userAgent.match(/(phone|pad|pod|ios|android|mobile|blackberry|mqqbrowser|juc|fennec|wosbrowser|browserng|webos|symbian)/i))) {
					return true;
				}
				if (location.hostname.substr(0,1) == 'i') {
					return true;
				}
				return false;
			},

			// identify ie6
			is_ie6: function() {
				return /msie 6/.test(navigator.userAgent.toLowerCase());
			}
		};
		
	}
	
	
	try { // start place
		if (typeof(window.iis3_config) != 'undefined') {			
			iis3.show_a(window.iis3_config);
			window.iis3_config = undefined;
		}
	} catch(e) {}
	

})();