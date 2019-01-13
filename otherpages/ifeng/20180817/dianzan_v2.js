define("dianzan",["detail","jquery#1.8.1"],function(obj,$){
	var href = obj.docUrl;
    var urlArr;
    var dom = $(".left_bq .face_box li");
    var zan_key = obj.zmtId ? 'sub_' + obj.zmtId + 'ding' : 'cmpp_' + obj.globalId + 'ding';
    function getPraise(urlarr){
        //获取点赞数
        try{
            $.ajax({
                url: "//survey.news.ifeng.com/api/getaccumulatorweight",
                type: 'GET',
                dataType: 'JSONP',
                cache:true,
                jsonpCallback:"success_zan_0",
                jsonp:"callback",
                data:{"serviceid":"2","format":"js","key[]":urlArr},
                success: function(data) {
                    var zanObj = data.browse;
                    if(!zanObj){
                        zanObj = data.data.browse;
                    }

                    var zanNumArr = [];
                    for(var item in zanObj){
                        zanNumArr.push(zanObj[item]);
                    };
                    setPraiseNum(zanNumArr);
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                }
            });
        }catch(e){

        };
    }
    function setPraiseNum(zanNumArr){
        //设置点赞数
        dom.each(function(index,obj){
            var num = parseInt(zanNumArr[index],10);
            $(obj).find("span").html(handleZanNum(num));
        })
    }
    function handleZanNum(num){
        if(num < 10000){
            return num;
        }else{
            return 9999+"+";
        }
    }

    function accumulatorZan(key){
        try{
            $.ajax({
                url: "//survey.news.ifeng.com/api/accumulator",
                type: 'GET',
                dataType: 'script',
                cache:true,
                data:{"format":"js","key":key},
                success: function(data) {
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                }
            });
        }catch(e){

        };
    }
	function initDianzan(){
		if(dom && dom.length){
	        urlArr = [href+"?good",href+"?adore",href+"?smile",href+"?cry",href+"?boring",href+"?angry"];

	        $(".left_bq .face_box").one("click",function(event){
	            var li = $(event.target).closest("li");
	            var index = $(".face_box li").index(li);

	            //获取点赞数
	            var key = urlArr[index];
	            //点赞数假加1
	            var zanDom = li.find("span");
	            var zanNum = parseInt(zanDom.html(),10);
	            zanDom.html(handleZanNum(zanNum+1));
	            accumulatorZan(key);//调用接口
	            return false;
	        })
	    }else{
	        dom = $(".left_dz");
	        urlArr = [zan_key];
	        dom.one("click",function(){
	            $(this).addClass('left_dz_hover');
	            //点赞数假加1
	            var zanDom = $(this).find("span");
	            var zanNum = parseInt(zanDom.html(),10);
                if(zanNum){
                    zanNum = zanNum + 1;
                }else{
                    zanNum = 1;
                }
	            zanDom.html(zanNum);

	            accumulatorZan(zan_key);//调用接口
	        })
	    }
	    getPraise(urlArr);
	}
	return initDianzan;
})