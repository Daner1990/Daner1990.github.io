---
layout: post
title: IOS中唤起native app
my_excerpt: 。
categories: [web]
tags: [web,微信,Javascript,]
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


<img src="{{ site.baseurl }}/postPics/weinre/5.png" alt="" style="width:600px;margin: 5px auto;"/>