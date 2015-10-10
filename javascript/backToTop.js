---
---
// backtotop.js

define(function(){

    var backToTop = function(){
        var clientHeight = window.innerHeight;
        var documentHeight = document.body.clientHeight;
        var scrollTopHeight = document.body.scrollTop;
        var backToTopBtn = document.getElementsByClassName('backtotop')[0];
        
        if(!backToTopBtn){
            backToTopBtn.style.opacity =0;
            return false;
        }

        if(clientHeight >= documentHeight){
            backToTopBtn.style.opacity =0;
            return false;
        }

        if(clientHeight < documentHeight && scrollTopHeight > 100){
            backToTopBtn.style.opacity = 1;
            //backToTopBtn.setAttribute("style","opacity:1");
            return false;
        }
    };

    var backToTopEvent = function(){
        document.body.scrollTop = 0;
        return false;
    };

    return{
        backToTop:backToTop,
        backToTopEvent:backToTopEvent
    }
});
