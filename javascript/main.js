---
---
// main.js
// main modules 

require.config({
    path:{
        'menus':'menus',
        'events':'events',
        'backToTop':'backToTop'
    }
});

require(['events','menus','backToTop'],function(events,menus,backToTop){

    //page init
    events.resizeEvent();
    window.addEventListener('resize',events.resizeEvent,false); 
    window.addEventListener('scroll',events.scrollEventFix,false); 

    //menu init
    //menus.initMenu();
    var tagsList = document.getElementById('page_tags_list');
    if(tagsList){
        tagsList.addEventListener('click',function(e){
            if(e.target && e.target.nodeName.toLowerCase() == 'span'){
                menus.filter(e);
            }
        },false);
    }

    //categories redirect
    var categoriesList = document.getElementById('page_categories_list');
    if(categoriesList){
        categoriesList.addEventListener('click',function(e){
            var hash = "";
            if(e.target && e.target.nodeName.toLowerCase() == 'span'){
                hash = e.target.getAttribute('category');
            }
            if(hash){
                var url = "#" + hash;
                window.location.href = url;
          }
            return false;
        });
    }

    //back to top
    var backToTopBtn = document.getElementsByClassName('backtotop');
    if(backToTopBtn){
        backToTop.backToTop();
        backToTopBtn = backToTopBtn[0];
        backToTopBtn.addEventListener('click',function(e){
            backToTop.backToTopEvent();
        });
    }

});
