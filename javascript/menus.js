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
        var menusWrapper = document.getElementById('page-tags_list');
        var codes ="";

        for(var key in menus){
            codes += "<span>"+key+"</span>";
        }
        codes += "<span>others</span>";

        menusWrapper.innerHTML = codes;
    };

    var filter = function(e){
        var tag = e.target.innerHTML;
		console.log(tag);
        //firefox not support innerText;
        //var tag = e.target.innerText;
        
        var code = '';
        
        //code += '<div class="posts">';

        if(tag == "others"){
            {% for post in site.posts %}
                if(("{{post.tags}}").length == 0){

                    code += '<article class="post">';
                        code += '<span class="time">{{ post.date | date : "%Y-%m-%d" }}</span>';
                        code += '<a class="title" href="{{site.baseurl}}{{post.url}}">{{post.title}}</a>';
                    code += '</article>';
                }

            {% endfor %}
        
        }else{
            {% for post in site.posts %}
                {% for tag in post.tags%}
                    if(("{{tag}}") == tag){

                    	code += '<article class="post">';
                            code += '<span class="time">{{ post.date | date : "%Y-%m-%d" }}</span>';
                            code += '<a class="title" href="{{site.baseurl}}{{post.url}}">{{post.title}}</a>';
                    	code += '</article>';

                    }

                {% endfor %}
            {% endfor %}
        }
        //code += '</div>';
		console.log(code);

        document.getElementById('page_tags_posts').innerHTML = code;
        return false; 
    };

    return{
        filter:filter,
        menus:menus,
        initMenu:initMenu
    }
});
