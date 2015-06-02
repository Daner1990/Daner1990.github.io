// main.js
// main modules 

require.config({
    path:{
        'events':'events'
    }
});

require(['events'],function(events){
    events.resizeEvent();
    window.addEventListener('resize',events.resizeEvent,false); 
    window.addEventListener('scroll',events.scrollEventFix,false); 
});
