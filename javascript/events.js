// events.js
// base events 

define(function(){
    var scrollEventRel = function(){
        var header,headerWidth;
        header = document.getElementsByClassName('wrapper-masthead');
        if(header == 'undefined' || header.length == 0){
            return false;
        }
        header = header[0];
        headerWidth = header.clientHeight;

        if(window.scrollY <= headerWidth){
            header.style.top = "0px";
        }else{
            header.style.top = window.scrollY+"px";
        }
        console.log(window.scrollY);
    };

    var scrollEventFix = function(){
        var header,headerWidth;
        header = document.getElementsByClassName('wrapper-masthead');
        if(header == 'undefined' || header.length == 0){
            return false;
        }
        header = header[0];
        headerWidth = header.clientHeight;

        if(window.scrollY <= headerWidth){
            header.classList.remove("wrapper-down");
        }else{
            header.classList.add("wrapper-down");
        }
       
    };

    var resizeEvent = function(){
        var header,headerWidth;
        header = document.getElementsByClassName('wrapper-masthead');
        if(header == 'undefined' || header.length == 0){ 
            return false;
        }   
        document.getElementById('main').style.paddingTop = header[0].clientHeight+"px";
    };

    return{
        resizeEvent:resizeEvent,
        scrollEventRel:scrollEventRel,
        scrollEventFix:scrollEventFix
    }
});
