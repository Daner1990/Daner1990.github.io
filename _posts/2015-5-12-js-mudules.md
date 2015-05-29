---
layout: post
title: js modules
my_excerpt: javascript 模块化编程,简单的了解两种模块化模式CommonJS和AMD
---

<h2>1. 基本javascript模块编程</h2>

直接在全局中定义函数。这样会造成全局污染并且要以防同名现在出现。

把函数定义在对象中作为属性。外部可以直接修改对象中的属性。

定义立即执行匿名函数。保证内部变量的私有性。


<h2>2.规范的模块开发</h2>

代码模块化很重要，有了模块我们才能方便的使用别人的代码。想要什么功能加载什么模块

所以需要有一套标准的模块规范

现在有两个模块规范：commonjs 和 amd 模块规范。


<h2>3.commonJS</h2>

09年，美国程序员创造了nodejs 将js语言用于服务端编程

js模块化变成诞生。

在浏览器环境中没有模块并没有太大问题但是在服务端一定要有模块 与os互动否则无法编程

nodejs的模块系统是参照commonjs规范实现的

在commonjs中有一个全局方法 require（）

用于加载模块 eg：

    var math = require('math');
    math.add(1,2);

但是有一个问题。commonjs是同步操作

如果要使用模块就必须同步等到模块加载完成

在服务器上等待的时间只是读取时间

但是对浏览器而言这是一个大问题。因为模块都放在服务器上

等待时间取决网络快慢。时间过长会导致浏览器处于假死状态。所以不能使用同步加载


<h2>4.AMD</h2>

为了解决以上问题。amd模块规范诞生了。asynchronous module definition 异步模块定义

在所有依赖模块的语句都定义了一个回调函数。等到加载完成后。这个回调函数才会运行。

amd也采用require（）加载模块 但是不同于 commonjs

        requied([moduels],callback);
        // eg
        require([math],function(math){
            math.add(1,2);
        });
