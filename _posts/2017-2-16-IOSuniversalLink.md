---
layout: post
title: IOS中唤起native app
my_excerpt: 。
categories: [web]
tags: [web,微信,Javascript,]
description: 在ios9出来以后，我们发现越来越多的应用能够直接绕过微信的屏蔽，从其内置浏览器中直接唤起app。相比于通过弹窗提示让用户到浏览器中操作的方式，这无疑是极大的提高了用户体验与流量导入。因此，在ios上实现直接从微信中唤起app变得非常必要。而其中的关键，就在于通用链接·universal links·：一种能够方便通过传统HTTP链接来启动app的方式，可以通过相同的网址打开网站和app
pid: 201702170000
---

##背景

前段时间遇到一个小需求：要求在分享出来的h5页面中，有一个立即打开的按钮，如果本地安装了我们的app，那么点击就直接唤起本地app，如果没有安装，则跳转到下载。

因为从来没有做过这个需求，因此这注定是一个苦逼的调研过程。

我们最开始就面临2个问题：一是如何唤起本地app，二是如何判断浏览器是否安装了对应app。

##如何唤起本地app

首先，想要实现这个需求，肯定是必须要客户端同学的配合才行，因此我们不用知道所有的实现细节，我们从前端角度思考看这个问题，需要知道的一点是，ios与Android都支持一种叫做schema协议的链接。比如网易新闻客户端的协议为

{% highlight  html %}
newsapp://xxxxx
{% endhighlight %}

当然，这个协议不需要我们前端去实现，我们只需要将协议放在a标签的href属性里，或者使用location.href与iframe来实现激活这个链接。而location.href与iframe是解决这个需求的关键。

在ios中，还支持通过`smart app banner`来唤起app，即通过一个meta标签，在标签里带上app的信息，和打开后的行为，代码形如


{% highlight  html %}
<meta name="apple-itunes-app" content="app-id=1023600494, app-argument=tigerbrokersusstock://com.tigerbrokers.usstock/post?postId=7125" />
{% endhighlight %}

我们还需要知道的一点是，微信里屏蔽了schema协议。除非你是微信的合作伙伴之类的，他们专门给你配置进白名单。否则我们就没办法通过这个协议在微信中直接唤起app。

因此我们会判断页面场景是否在微信中，如果在微信中，则会提示用户在浏览器中打开。

如何判断本地是否安装了app

很无奈的是，在浏览器中无法明确的判断本地是否安装了app。因此我们必须采取一些取巧的思路来解决这个问题。

很容易能够想到，采用设置一个延迟定时器setTimeout的方式，第一时间尝试唤起app，如果200ms没有唤起成功，则默认本地没有安装app，200ms以后，将会触发下载行为。

结合这个思路，我们来全局考虑一下这个需求应该采用什么样的方案来实现它。

使用location.href的同学可能会面临一个担忧，在有的浏览器中，当我们尝试激活schema link的时候，若本地没有安装app，则会跳转到一个浏览器默认的错误页面去了。因此大多数人采用的解决方案都是使用iframe


>测试了很多浏览器，没有发现过这种情况

后来观察了网易新闻，今日头条，YY等的实现方案，发现大家都采用的是iframe来实现。好吧，面对这种情况，只能屈服。

整理一下目前的思路，得到下面的解决方案

{% highlight  javascript %}

var url = {
  open: 'app://xxxxx',
  down: 'xxxxxxxx'
};
var iframe = document.createElement('iframe');
var body = document.body;
iframe.style.cssText='display:none;width=0;height=0';
var timer = null;

// 立即打开的按钮
var openapp = document.getElementById('openapp');
openapp.addEventListener('click', function() {
  if(/MicroMessenger/gi.test(navigator.userAgent) {
    // 引导用户在浏览器中打开
  }) else{
    body.appendChild(iframe);
    iframe.src = url.open;
    timer = setTimeout(function() {
      wondow.location.href = url.down;
    }, 500);
  }
}, false)

{% endhighlight %}


想法很美好，现实很残酷。一测试，就发现简单的这样实现有许多的问题。

第一个问题在于，当页面成功唤起app之后，我们再切换回来浏览器，发现跳转到了下载页面。

为了解决这个问题，发现各个公司都进行了不同方式的尝试。

也是历经的很多折磨，发现了几个比较有用的事件。

`pageshow`： 页面显示时触发，在load事件之后触发。需要将该事件绑定到window上才会触发

`pagehide`: 页面隐藏时触发

`visibilitychange`： 页面隐藏没有在当前显示时触发，比如切换tab，也会触发该事件

`document.hidden` 当页面隐藏时，该值为true，显示时为false

由于各个浏览器的支持情况不同，我们需要将这些事件都给绑定上，即使这样，也不一定能够保证所有的浏览器都能够解决掉这个小问题，实在没办法的事情也就只能这样了。

扩充一下上面的方案，当本地app被唤起，则页面会隐藏掉，就会触发pagehide与visibilitychange事件

{% highlight  javascript %}
$(document).on('visibilitychange webkitvisibilitychange', function() {
    var tag = document.hidden || document.webkitHidden;
    if (tag) {
        clearTimeout(timer);
    }
})

$(window).on('pagehide', function() {
    clearTimeout(timer);
})
{% endhighlight %}

而另外一个问题就是IOS9+下面的问题了。ios9的Safari，根本不支持通过iframe跳转到其他页面去。也就是说，在safari下，我的整体方案被全盘否决！

于是我就只能尝试使用location.href的方式，这个方式能够唤起app，但是有一个坑爹的问题，使用schema协议唤起app会有弹窗而不会直接跳转去app！甚至当本地没有app时，会被判断为链接无效，然后还有一个弹窗。

这个弹窗会造成什么问题呢？如果用户不点确认按钮，根据上面的逻辑，这个时候就会发现页面会自动跳转到下载去了。而且无效的弹窗提示在用户体验上是无法容忍的。

好吧，继续扒别人的代码，看看别人是如何实现的。所以我又去观摩了其他公司的实现结果，发现网易新闻，今日头条都可以在ios直接从微信中唤起app。真是神奇了，可是今日头条在Android版微信上也没办法直接唤起的，他们在Android上都是直接到腾讯应用宝的下载里去。所以按道理来说这不是添加了白名单。

为了找到这个问题的解决方案，我在网易新闻的页面中扒出了他们的代码，并整理如下，添加了部分注释

{% highlight  javascript %}

window.NRUM = window.NRUM || {};
window.NRUM.config = {
    key:'27e86c0843344caca7ba9ea652d7948d',
    clientStart: +new Date()
};
(function() {
    var n = document.getElementsByTagName('script')[0],
        s = document.createElement('script');

    s.type = 'text/javascript';
    s.async = true;
    s.src = '//nos.netease.com/apmsdk/napm-web-min-1.1.3.js';
    n.parentNode.insertBefore(s, n);
})();


;
(function(window,doc){

    // http://apm.netease.com/manual?api=web
    NRUM.mark && NRUM.mark('pageload', true)

    var list = []
    var config = null

    // jsonp
    function jsonp(a, b, c) {
        var d;
        d = document.createElement('script');
        d.src = a;
        c && (d.charset = c);
        d.onload = function() {
            this.onload = this.onerror = null;
            this.parentNode.removeChild(this);
            b && b(!0);
        };
        d.onerror = function() {
            this.onload = this.onerror = null;
            this.parentNode.removeChild(this);
            b && b(!1);
        };
        document.head.appendChild(d);
    };


    function localParam(search,hash){
        search = search || window.location.search;
        hash = hash || window.location.hash;
        var fn = function(str,reg){
            if(str){
                var data = {};
                str.replace(reg,function( $0, $1, $2, $3 ){
                    data[ $1 ] = $3;
                });
                return data;
            }
        }
        return {search: fn(search,new RegExp( "([^?=&]+)(=([^&]*))?", "g" ))||{},hash: fn(hash,new RegExp( "([^#=&]+)(=([^&]*))?", "g" ))||{}};
    }

    jsonp('http://active.163.com/service/form/v1/5847/view/1047.jsonp')

    window.search = localParam().search
    window._callback = function(data) {
        window._callback = null
        list = data.list
        if(search.s && !!search.s.match(/^wap/i)) {
            config = list.filter(function(item){
                return item.type === 'wap'
            })[0]
            return
        }
        config = list.filter(function(item){
            return item.type === search.s
        })[0]
    }

    var isAndroid = !!navigator.userAgent.match(/android/ig),
        isIos = !!navigator.userAgent.match(/iphone|ipod/ig),
        isIpad = !!navigator.userAgent.match(/ipad/ig),
        isIos9 = !!navigator.userAgent.match(/OS 9/ig),
        isYx = !!navigator.userAgent.match(/MailMaster_Android/i),
        isNewsapp = !!navigator.userAgent.match(/newsapp/i),
        isWeixin = (/MicroMessenger/ig).test(navigator.userAgent),
        isYixin = (/yixin/ig).test(navigator.userAgent),
        isQQ = (/qq/ig).test(navigator.userAgent),
        params = localParam().search,
        url = 'newsapp://',
        iframe = document.getElementById('iframe');

    var isIDevicePhone = (/iphone|ipod/gi).test(navigator.platform);
    var isIDeviceIpad = !isIDevicePhone && (/ipad/gi).test(navigator.platform);
    var isIDevice = isIDevicePhone || isIDeviceIpad;
    var isandroid2_x = !isIDevice && (/android\s?2\./gi).test(navigator.userAgent);
    var isIEMobile = !isIDevice && !isAndroid && (/MSIE/gi).test(navigator.userAgent);
    var android_url = (!isandroid2_x) ? "http://3g.163.com/links/4304" : "http://3g.163.com/links/6264";
    var ios_url = "http://3g.163.com/links/3615";
    var wphone_url = "http://3g.163.com/links/3614";
    var channel = params.s || 'newsapp'

    // 判断在不同环境下app的url
    if(params.docid){
        if(params['boardid'] && params['title']){
            url = url + 'comment/' + params.boardid + '/' + params.docid + '/' + params.title
        }else{
            url = url + 'doc/' + params.docid
        }
    }else if(params.sid){
        url = url + 'topic/' + params.sid
    }else if(params.pid){
        var pid = params.pid.split('_')
        url = url + 'photo/' + pid[0] + '/' + pid[1]
    }else if(params.vid){
        url = url + 'video/' + params.vid
    }else if(params.liveRoomid){
        url = url + 'live/' + params.liveRoomid
    }else if(params.url){
        url = url + 'web/' + decodeURIComponent(params.url)
    }else if(params.expertid){
        url = url + 'expert/' + params.expertid
    }else if(params.subjectid){
        url = url + 'subject/' + params.subjectid
    }else if(params.readerid){
        url = url + 'reader/' + params.readerid
    }else{
        url += 'startup'
    }
    if(url.indexOf('?') >= 0){
        url += '&s=' + (params.s || 'sps')
    }else{
        url += '?s=' + (params.s || 'sps')
    }

    // ios && 易信  用iframe 打开
    if((isIos||isIpad) && navigator.userAgent.match(/yixin/i)) {
        document.getElementById('iframe').src = url;
    }

    var height = document.documentElement.clientHeight;

    // 通常情况下先尝试使用iframe打开
    document.getElementById('iframe').src = url;

    // 移动端浏览器中，将下载页面显示出来
    if(!isWeixin && !isQQ && !isYixin && !isYx){
        document.querySelector('.main-body').style.display = 'block'
        if(isIos9){
            document.querySelector('.main-body').classList.add('showtip')
        }

        setTimeout(function(){
            document.body.scrollTop = 0
        },200)
    }else{
        document.getElementById('guide').style.display = 'block'
    }

    // Forward To Redirect Url
    // Add by zhanzhixiang 12/28/2015
    if (params.redirect) {
        var redirectUrl = decodeURIComponent(params.redirect);
        if ( typeof(URL) === 'function' && new URL(redirectUrl).hostname.search("163.com") !== -1) {
            window.location.href = redirectUrl;
        } else if (redirectUrl.search("163.com") !== -1){
            window.location.href = redirectUrl;
        };
    }

    // Forward To Redirect Url End
    if ((isWeixin || isQQ) && isAndroid) {
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.netease.newsreader.activity&ckey=CK1331205846719&android_schema=' +　url.match(/(.*)\?/)[1]
    }

    if(isIos||isIpad){
        document.getElementById("guide").classList.add('iosguideopen')
    }else if (isAndroid){
        document.getElementById("guide").classList.add('androidguideopen')
    }else{
        // window.location.href = 'http://www.163.com/newsapp'
    }

    document.getElementById('link').addEventListener('click', function(){

        // 统计
        neteaseTracker && neteaseTracker(false,'http://sps.163.com/func/?func=downloadapp&modelid='+modelid+'&spst='+spst+'&spsf&spss=' + channel,'', 'sps' )

        if (config) {
            android_url = config.android
        }
        if (config && config.iOS) {
            ios_url = config.iOS
        }
        if(isWeixin || isQQ){
            return
        }
        var msg = isIDeviceIpad ? "检测到您正在使用iPad, 是否直接前往AppStore下载?" : "检测到您正在使用iPhone, 是否直接前往AppStore下载?";
        if (isIDevice){
            window.location = ios_url;
            return;
        }else if(isAndroid){
            // uc浏览器用iframe唤醒
            if(navigator.userAgent.match(/ucbrowser|yixin|MailMaster/i)){
                document.getElementById('iframe').src = url;
            } else {
                window.location.href = url;
            }
            setTimeout(function(){
                if(document.webkitHidden) {
                    return
                }
                if (confirm("检测到您正在使用Android 手机，是否直接下载程序安装包？")) {
                    neteaseTracker && neteaseTracker(false,'http://sps.163.com/func/?func=downloadapp_pass&modelid='+modelid+'&spst='+spst+'&spsf&spss=' + channel,'', 'sps' )
                    window.location.href = android_url;
                } else {
                    neteaseTracker && neteaseTracker(false,'http://sps.163.com/func/?func=downloadapp_cancel&modelid='+modelid+'&spst='+spst+'&spsf&spss=' + channel,'', 'sps' )
                }
            },200)
            return;
        }else if(isIEMobile){
            window.location = wphone_url;
            return;
        }else{
            window.open('http://www.163.com/special/00774IQ6/newsapp_download.html');
            return;
        }
    }, false)

    setTimeout(function(){
        if(isIDevice && params.notdownload != 1 && !isNewsapp && !isIos9){
            document.getElementById('link').click()
        }
    }, 1000)

})(window,document);

{% endhighlight %}

虽然有一些外部的引用，和一些搞不懂是干什么用的方法和变量，但是基本逻辑还是能够看明白。好像也没有什么特别的地方。研究了许久，看到了一个叫做apple-app-site-association的jsonp请求很奇特。这是来干嘛用的？


{% highlight  javascript %}

{
   "applinks": {
       "apps": [ ],
       "details": {
           "TEAM-IDENTIFIER.YOUR.BUNDLE.IDENTIFIER": {
               "paths": [
                   "*"
               ]
           }
       }
   }
}

{% endhighlight %}


大家可以直接访问这个链接，查看里面的内容

http://active.163.com/service/form/v1/5847/view/1047.jsonp

为了搞清楚这个问题，费尽千辛万苦搜索了很多文章，最终锁定了一个极为关键的名词 `Universal links`。

>Apple为iOS 9发布了一个所谓的通用链接的深层链接特性，即Universal links。虽然它并不完美，但是这一发布，让数以千计的应用开发人员突然意识到自己的应用体验被打破。
>
>Universal links，一种能够方便的通过传统的HTTP/HTTPS 链接来启动App，使用相同的网址打开网站和App。

关于这个问题的提问与universal links的介绍 点击这里查看:

http://stackoverflow.com/questions/31891777/ios-9-safari-iframe-src-with-custom-url-scheme-not-working


ios9推行的一个新的协议！

关于本文的这个问题，国内的论坛有许许多多的文章来解决，但是提到universal links的文章少之又少。他改变了用户体验的关键在于，微信没有办法屏蔽这个协议。因此如果我们的app注册了这个协议，那么我们就能够从微信中直接唤起app。

至于universal links具体如何实现，让ios的同学去搞定吧，这里提供两个参考文章

http://www.cocoachina.com/bbs/read.php?tid-1486368.html

https://blog.branch.io/how-to-setup-universal-links-to-deep-link-on-apple-ios-9

支持了这个协议之后，我们又可以通过iframe来唤起app了，因此基本逻辑就是这样了。最终的调研结果是

没有完美的解决方案

就算是网易新闻，这个按钮在使用过程中也会有一些小bug，无法做到完美的状态。

因为我们面临许多没办法解决的问题，比如无法真正意义上的判断本地是否安装了app，pageshow，pagehide并不是所有的浏览器都支持等。很多其他博客里面，什么计算时间差等方案，我花了很久的时间去研究这些方案，结果是，根！本！没！有！用！

老实说，从微信中跳转到外部浏览器，并不是一个好的解决方案，这样会导致很多用户流失，因此大家都在ios上实现了universal links，而我更加倾向的方案是知乎的解决，他们从设计上避免了在一个按钮上来判断这个逻辑，而采用了两个按钮的方式。

网易新闻的逻辑是，点击打开会跳转到一个下载页面，这个下载页面一加载完成就尝试打开app，如果打开了就直接跑到app里面去了，如果没有就在页面上有一个立即下载的按钮，按钮行只有下载处理。

在后续与ios同学实现universal liks的时候又遇到了一些坑，总结了一些经验，欢迎持续关注我下一篇关于这个话题的讨论。

**以上内容转来自：https://gold.xitu.io/post/57b6ba9f128fe10054bb5401**

##第二篇

在ios9出来以后，我们发现越来越多的应用能够直接绕过微信的屏蔽，从其内置浏览器中直接唤起app。相比于通过弹窗提示让用户到浏览器中操作的方式，这无疑是极大的提高了用户体验与流量导入。因此，在ios上实现直接从微信中唤起app变得非常必要。

而其中的关键，就在于通用链接·universal links·：一种能够方便通过传统HTTP链接来启动app的方式，可以通过相同的网址打开网站和app。

对于ios开发者来说，可以很轻松在网上找到非常多给自己的app配置universal links的教程文章，这里推荐 http://www.cocoachina.com/ios/20150902/13321.html

这篇文章的主要目的，就是从前端角度来聊一聊·universal links·的运用。

无论是Android还是ios应用，都能够通过一定的方式捕获浏览器正在进行的url跳转。我们知道在页面中通常有如下三种方式能够访问别的链接

通过html中的a标签
{% highlight  javascript %}
<a href="universal links">action</a>

{% endhighlight %}

通过js的location方法
{% highlight  javascript %}
window.location = 'universal links';
{% endhighlight %}

通过iframe标签，一般情况下我们会通过js创建一个iframe标签，并通过设置iframe的src属性实现跳转

{% highlight  javascript %}
var iframe = document.createElement('iframe');
iframe.style.cssText = 'width: 0; height: 0';
document.body.appendChild(iframe);
iframe.src = 'universal links';
{% endhighlight %}

为了能够在js中控制跳转行为，我们基本不会通过a标签的方式，而选择2，3种。不过比较头疼的是，并不是所有手机版本的浏览器都能够毫无顾忌的使用这两种方式，比如在ios8中，据说他们ios开发通过通常使用的方式，无法捕获window.location的跳转，因此我们得采用iframe的方式来实现唤起。而在Android上浏览器的表现就更加杂乱不一，因此如果想要兼顾所有的浏览器，从测试角度来说，这是一个比较大的工作量。

而universal links如果能够实现从微信中直接唤起app，那么微信以外的浏览器的复杂场景我们都不需要考虑了。因此这简直就是一件利国利民的好事，从开发到测试的工作量都大大降低。

读过上一篇文章的同学应该知道，单单从浏览器层面，我们无法精准的判断本地是否安装了app。这给我们实现这一需求造成了非常多的困扰。而从ios9.2开始，**针对universal links，有一个非常重要的改动，通俗来说，就是必须通过访问不同的url链接，我们才能在微信中唤起本地app**。

在上面我们介绍过，universal links能够使用和访问普通网页一样的http链接，唤起我们自己的app。比如我们访问一个页面`http://www.test.com/gold`能够在浏览器中打开一个页面，而当我们在手机浏览器中，通过上面的三种方式尝试访问同样的地址`http://www.test.com/gold`，只要本地安装了指定的app，就可以打开app中的对应页面。但是9.2的改动之后就不行了，在9.2之后，我们必须使用2个不同的域名，并且这2个域名指向同一个页面，我们才能够在微信中唤起app。

如果我们仅仅只是配置了一个域名，那么当我们在微信中打开这个网页，并且在页面中访问自身时，页面仅仅相当于一次刷新，而app并不会被唤起。而点击在浏览器中打开时，会唤起app。

对于不了解的人来说，这是一个深坑，而当我们了解了其中的细节，那么我们就能够利用这一点，完美的实现有则唤起，无则下载的需求。

假如我们有一个app，demoAPP。我们的ios同事已经配置好了universal links，2个域名分别为`a.com`, `b.com`。另外我们有一个宣传页面，在浏览器中，`a.com/activity`与`b.com/activity`都能够访问该宣传页面。

为了规范统一，我们规定将该宣传页面从demoAPP分享出来时，页面地址使用`a.com/activity`，而在当我们想要唤起demoAPP时，使用`b.com/activity`.

另外，在实践中我发现如下特性，如果本地安装了demoAPP，那么`a.com/activity`中唤起app之后，不会发生任何变化。而如果本地没有安装demoAPP，页面会跳转到`b.com/activity`，当到了这个页面，我们已经知道无法唤起，因此直接下载即可。

因此根据这个特性，我们有了如下的实践方案

{% highlight  javascript %}

var openURL = {
    open: 'b.com/activity',
    down: 'downloadurl'
},
// 打开app的按钮
btn = document.querySelector('.open-app'),
curURL = window.location.href;
if (/b.com/ig.test(curURL)) {
    window.location = openURL.down;
    return;
}

btn.onclick(function() {
    window.location = 'b.com/activity';
})
{% endhighlight %}

是不是很简单！

当然在具体实现上，还有许多繁琐的细枝末节需要我们一步一步去完善。这里只是提供了一个思路。从整体来说，这个需求并不是一个简单的任务，我们需要后端同学配置2套域名，需要ios同事配合，甚至还需要和产品不停的沟通，因为有一些确实无法实现的东西需要他们理解。

##第三方

老实说，如果自己劳心劳力想要比较完善的实现这么个需求，真的吃力不讨好，需要配合的部门太多，耗时太多，最后的效果还并不是很好，很多用户还对这种弹窗下载提示真的深恶痛绝。因此，通过第三方的解决方案无疑是最好的办法。

这里推荐2个第三方方案，具体的优势，实现与配置方式在他们网站中都有详细的讲解，如果真的有接到这个需求的同学，强烈建议参考。当然，如果有数据隐私这方面的考虑的话，就还是自己老老实实的做兼容吧，反正方案就是这2篇文章说的这些。

`磨窗` http://www.magicwindow.cn/

`deepshare` http://deepshare.io/redirect-once/

我知道有的同学会想吐槽，说了这么多，原来还是第三方才是最佳方案，干嘛不直接说得了！那么我只能说，这么想的同学，肯定不知道经验这个东西，在撕b上到底有多重要！！

**第二篇文章转自：https://gold.xitu.io/entry/57bd1e6179bc440063b3a029/view**