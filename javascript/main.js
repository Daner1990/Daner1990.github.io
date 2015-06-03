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
    events.resizeEvent();
    menus.initMenu();
    window.addEventListener('resize',events.resizeEvent,false); 
    window.addEventListener('scroll',events.scrollEventFix,false); 

});
