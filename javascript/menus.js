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
            codes += "<li>"+key+"</li>";
        }

        menusWrapper.innerHTML = codes;
    };

    var filter = function(e){
        console.log(e);
        var tag = e.target.innerHTML;
        //firefox not support innerText;
        //var tag = e.target.innerText;
        
        var code = '';
        
        code += '<div class="posts">';
        {% for post in site.posts %}
            {% for tag in post.tags%}
                if(("{{tag}}").toLowerCase() == tag){
                    code += '<article class="post">';

                        code += '<h2><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h2>';

                        code += '<div class="entry">';
            
                            code += "{{ post.my_excerpt }}";

                        code += '</div>';

                        code += '<a href="{{ site.baseurl }}{{ post.url }}" class="read-more">Read More</a>';

                        code += '<ul class="page-tags">';

                        {% for tag in post.tags%}
                            code += '<li>{{tag}}</li>';
                        {% endfor %}
                        
                    code += '</ul></article>';
                }

            {% endfor %}
        {% endfor %}
        code += '</div>';

        document.getElementById('main').innerHTML = code;
        return false; 
    };

    return{
        filter:filter,
        menus:menus,
        initMenu:initMenu
    }
});
