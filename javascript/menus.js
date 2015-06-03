---
---
// menus.js
// init menus for filter
// in order to get the postTags
// we use liquid in javascript 

define(function(){

    var labs = [],menus={};

    {% for post in site.posts %}
        {% for tag in post.tags%}
            labs.push("{{tag}}");
        {% endfor %}
    {% endfor %}

    labs.map(function(current,index){
        current = current.toLowerCase();
        if(menus[current]){
            menus[current] += 1;
        }else{
            menus[current] = 1;
        }
    });

    console.log(menus);

    var initMenu = function(){
        var menusWrapper = document.getElementById('menus-tags');
        var codes ="";

        for(var key in menus){
            codes += "<li><span class=name>"+key+"</span></li>";
        }

        menusWrapper.innerHTML = codes;
    };

    var filter = function(){
    
    };

    return{
        filter:filter,
        menus:menus,
        initMenu:initMenu
    }
});
