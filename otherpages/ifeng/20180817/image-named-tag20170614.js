/* 
* @Author: anchen
* @Date:   2017-06-14 09:55:27
* @Last Modified by:   anchen
* @Last Modified time: 2017-06-14 11:01:10
*/

 
(function(){
    
    (function(int_image,int_clickurl, int_w, int_h,int_click_imp_arr){
        var int_id = "int_click_" + Math.ceil(Math.random() * 1000000);
        var int_text = "<a href="+int_clickurl+" target='_blank' id="+int_id+"><img src="+int_image+" width="+int_w+" height="+int_h+" border='0' /></a>";
        document.write(int_text);

    document.getElementById(int_id).onclick = function() {
        if("undefined" != typeof int_click_imp_arr && int_click_imp_arr != ''){
            for(var i = 0;i < int_click_imp_arr.length; i++){
                impHandel(int_click_imp_arr[i]);
            }
        }
    }

    })(img_named_tag_image,img_named_tag_clickurl, img_named_tag_width,img_named_tag_height,click_imp_arr);

    function impHandel(imp){
        var impressionSource = document.createElement('div');
        impressionSource.style.display = "none";
        impressionSource.innerHTML = "<img src='" + imp + "' style='width:1px;height:1px;border:none;' />";
        document.body.insertBefore(impressionSource , document.body.childNodes[0]);
    }

    if("undefined" != typeof imp_arr && imp_arr != ''){
        for(var j = 0;j < imp_arr.length; j++){
            impHandel(imp_arr[j]);
        }
    }

})();