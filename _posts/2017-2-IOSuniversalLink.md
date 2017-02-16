---
layout: post
title: IOS中唤起native app
my_excerpt: 。
categories: [web]
tags: [web,微信,Javascript,]
pid: 201412040000
---

##背景

前段时间遇到一个小需求：要求在分享出来的h5页面中，有一个立即打开的按钮，如果本地安装了我们的app，那么点击就直接唤起本地app，如果没有安装，则跳转到下载。

因为从来没有做过这个需求，因此这注定是一个苦逼的调研过程。

我们最开始就面临2个问题：一是如何唤起本地app，二是如何判断浏览器是否安装了对应app。

##如何唤起本地app

首先，想要实现这个需求，肯定是必须要客户端同学的配合才行，因此我们不用知道所有的实现细节，我们从前端角度思考看这个问题，需要知道的一点是，ios与Android都支持一种叫做schema协议的链接。比如网易新闻客户端的协议为

{% highlight  html linenos %}
newsapp://xxxxx
{% endhighlight %}

当然，这个协议不需要我们前端去实现，我们只需要将协议放在a标签的href属性里，或者使用location.href与iframe来实现激活这个链接。而location.href与iframe是解决这个需求的关键。

在ios中，还支持通过`smart app banner`来唤起app，即通过一个meta标签，在标签里带上app的信息，和打开后的行为，代码形如


{% highlight  html linenos %}
<meta name="apple-itunes-app" content="app-id=1023600494, app-argument=tigerbrokersusstock://com.tigerbrokers.usstock/post?postId=7125" />
{% endhighlight %}

我们还需要知道的一点是，微信里屏蔽了schema协议。除非你是微信的合作伙伴之类的，他们专门给你配置进白名单。否则我们就没办法通过这个协议在微信中直接唤起app。

因此我们会判断页面场景是否在微信中，如果在微信中，则会提示用户在浏览器中打开。

如何判断本地是否安装了app

很无奈的是，在浏览器中无法明确的判断本地是否安装了app。因此我们必须采取一些取巧的思路来解决这个问题。

很容易能够想到，采用设置一个延迟定时器setTimeout的方式，第一时间尝试唤起app，如果200ms没有唤起成功，则默认本地没有安装app，200ms以后，将会触发下载行为。

结合这个思路，我们来全局考虑一下这个需求应该采用什么样的方案来实现它。

使用location.href的同学可能会面临一个担忧，在有的浏览器中，当我们尝试激活schema link的时候，若本地没有安装app，则会跳转到一个浏览器默认的错误页面去了。因此大多数人采用的解决方案都是使用iframe


#测试了很多浏览器，没有发现过这种情况

后来观察了网易新闻，今日头条，YY等的实现方案，发现大家都采用的是iframe来实现。好吧，面对这种情况，只能屈服。

整理一下目前的思路，得到下面的解决方案

{% highlight  html linenos %}
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

##weinre简介

Weinre(WebInspector Remote)是一款基于Web Inspector(Webkit)的远程调试工具，借助于网络，可以在PC上直接调试运行在移动设备上的远程页面，中文意思是远程Web检查器，有了Weinre，在PC上可以即时修改目标网页的HTML/CSS/Javascript，调试过程可实时显示移动设备上页面的预览效果，并同步显示设备页面的错误和警告信息，可以查看网络资源的信息，不过weinre不支持断点调试。该项目目前是 Apache Cordova 的一部分。

Weinre也从最初的Java移植到了当前的JavaScript。我们使用的就是Apache后来推出的JavaScript版本weinre。需要在nodejs环境下安装使用，使用npm包管理工具也可以直接下载安装。

原理图：
<img src="{{ site.baseurl }}/postPics/weinre/1.png" alt="" style="width:600px;margin: 5px auto;"/>


##安装

{% highlight  html linenos %}
npm -g install weinre  //安装weinre  
weinre --boundHost [hostname | ip address |-all-]  --httpPort [port]  //启动weinre  
{% endhighlight %}

安装之后打开所配置的weinre：

<img src="{{ site.baseurl }}/postPics/weinre/2.png" alt="" style="width:600px;margin: 5px auto;"/>

可以配置 .weinre/server.properties 让启动 weinre 变得更方便, 具体方法请参考官网, 配置好后, 以后想启动 weinre, 直接运行weinre命令即可, 无需每次都追加那些参数了。

环境配置好了，接下来就是打通调试环境和目标页面的联系：
{% highlight  html linenos %}
<script src="http://localhost:8081/target/target-script-min.js#anonymous"></script> 
{% endhighlight %}
我们把以上代码加入我们要调试的页面中。

然后再手机端打开我们的待调试的页面。

<img src="{{ site.baseurl }}/postPics/weinre/3.png" alt="" style="width:320px;margin: 5px auto;"/>

然后回到我们的weinre环境中点击测试接口：

<img src="{{ site.baseurl }}/postPics/weinre/4.png" alt="" style="width:400px;margin: 5px auto;"/>

我们进入了一个熟悉的界面如下所示，只要在点击targets中你想测试的页面激活一下。就可以通过elments等选项修改css/javascipt/html代码直接远程调试我们的目标页面啦~

<img src="{{ site.baseurl }}/postPics/weinre/5.png" alt="" style="width:600px;margin: 5px auto;"/>