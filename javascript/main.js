---
---
// main.js
// main modules 

require.config({
    path:{
        'menus':'menus',
        'events':'events'
    }
});

require(['events','menus'],function(events,menus){
    //page init
    events.resizeEvent();
    window.addEventListener('resize',events.resizeEvent,false); 
    window.addEventListener('scroll',events.scrollEventFix,false); 

    //menu init
    menus.initMenu();
    document.getElementById('menus-tags').addEventListener('click',function(e){
        if(e.target && e.target.nodeName.toLowerCase() == 'li'){
            menus.filter(e);
        }
    },false);

});
