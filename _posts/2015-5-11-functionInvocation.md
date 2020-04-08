---
layout: post
title: 调用指令:对apply/call/bind的理解
my_excerpt: javascript中函数调用方法，具体内部是怎么实现调用的呢，对call,apply,bind的理解
categories: [Javascript]
tags: [Javascript,Web]
pid: 201505110000
description: javascript中函数调用方法，具体内部是怎么实现调用的呢，对call,apply,bind的理解
---

####Function Invocation

{% highlight javascript linenos %}

    function hello(thing) 
    { 
        console.log(this + " says hello " + thing);
    }

    hello.call("Yehuda", "world") 

    //=> Yehuda says hello world  

{% endhighlight %}

####简单的函数调用

{% highlight javascript linenos %}

    function hello(thing) {  
        console.log("Hello " + thing);
    }

    // this:
    hello("world")

    // es5模式下等价于:
    hello.call(window, "world");  

    // es5 严格模式下等价于
    hello.call(undefined,'world');

{% endhighlight %}

#### 函数指令的理解(function invocation)

>一个函数指令例如：fn(...args) 等价于 fn.call(window [ES5-strict: undefined], ...args).
>
>匿名函数(function() {})() 等价于 (function(){}).call(window [ES5-strict: undefined).


####方法调用

{% highlight javascript linenos %}
    var person = {  
        name: "Brendan Eich",
        hello: function(thing) {
            console.log(this + " says hello " + thing);
        }
    }

    // this:
    person.hello("world")

    // 等价于desugars to this:
    person.hello.call(person, "world");  

{% endhighlight %}
    
#### 使用 Function.prototype.bind

有时为了方便对函数中的常量进行引用

{% highlight javascript linenos %}

    var person = {  
        name: "Brendan Eich",
        hello: function(thing) {
            console.log(this.name + " says hello " + thing);
        }
    }
    var boundHello = function(thing) { 
        return person.hello.call(person, thing); 
        //第二个person保证了对person对象name的调用
    }
    boundHello("world");  

    //Brendan Eich says hello world

{% endhighlight %}
-----------------------------

######[参考文档](http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)
