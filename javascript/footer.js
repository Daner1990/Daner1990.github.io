---
---
// footer.js

define(function(){

    var initFooter = function(){
        var clientHeight = window.innerHeight;
        var documentHeight = document.body.clientHeight;
        var scrollTopHeight = document.body.scrollTop;
        var footerWrapper = document.getElementsByClassName('wrapper-footer')[0];

        if(clientHeight > documentHeight){
            footerWrapper.style.position = "fixed";
            footerWrapper.style.left = "0";
            footerWrapper.style.bottom = "0";
            return false;
        }
    };

    return{
        initFooter:initFooter
    }
});
