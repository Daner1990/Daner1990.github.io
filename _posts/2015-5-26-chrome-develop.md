---
layout: post
title: Chrome Developer 开发工具学习
tags: Tools
my_excerpt: 就近期对前端的开发来看，chrome developer在我看来是一款比firebug更加优秀的前端调试工具。但是chromedeveloper还有许多新功能等待我的发现。
---

Tips:

<h2>1. Filter</h2>

如何通过filter定位到具体的js css文件？

    在source 面板 使用 ctrl+o可以打开filter选择框

如何通过filter定位到具体某个文件的关键字？

    使用ctrl+f打开输入框(在这里可以进行替换replace)

如何在所有文件中检索某关键字？
    
    ctrl+shift+f

在某个文件中检索函数(JS)或选择器(CSS):
    
    ctrl+shift+o

跳到某一行
    
    ctrl+g



<h2>2.source面板</h2>

snippets:片段

    可以在snippets中右键添加一个js/css片段，建立完成之后可以RUN该段代码
    同时可以选中其中某段代码右键“Evaluate in Console”运行选中代码
    
    和source的Local modifications一样可以查看代码修改历史版本


<h2>3.Console面板</h2>

console.log() //可接多个参数

    console.log("%s has %d points", "Sam", 100);
    console.log("%cThis will be formatted with large, blue text", "color: blue; font-size: x-large");

    %s
    Formats the value as a string
    %i or %d
    Formats the value as an integer.
    %f
    Formats the value as a floating point value.
    %o
    Formats the value as an expandable DOM element. As seen in the Elements panel.
    %O
    Formats the value as an expandable JavaScript object.
    %c
    Applies CSS style rules to the output string as specified by the second parameter. 

console.error()//输出是红色的

console.warn()//输出背景色是黄色的

console.assert()//assertions 断言 两个参数

    两个参数，第一个参数是一个表达式。当第一个参数执行出错为false
    第二个参数显示。第二个是错误的消息

    console.assert(1>2,'error,1 is smaller then 2');

console.group()/console.groupEnd();
    
    在group和groupEnd内部的console信息属于一组
    可以嵌套

console.table()

    格式化显示数据
    console.table([{a:1, b:2, c:3}, {a:"foo", b:false, c:undefined}]);
    console.table([[1,2,3], [2,3,4]]);

console.time()/console.timeEnd()

    计算执行时间ms

debugger；

    在文件中设置断点

console.count()

    对相同的打印会进行计数


选择元素

    $() document.querySelector() 选择第一个元素
    $$() document.querySelectorAll() 选择所有元素
    $x() return array with specified Xpath

监听元素

    monitorEvents(document.body,'click')
    unmonitorEvents(document.body)

cpu profiler 
    
    profile()
    profileEnd()
