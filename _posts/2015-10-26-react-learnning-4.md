---
layout: post
title: React学习笔记(四):优化
my_excerpt: 直接看文章吧少年！
categories: [Javascript]
tags: [Javascript,React]
pid: 201511061512
---

#性能优化

当一个组件更新的时候，无论是设置新的props 还是调用setState或者forceUpdate方法，React都会调用该组件的所有子组件的render方法。在大部分情况并没有太大问题。但是如果我们的组件树深度嵌套或者是render方法十分复杂的页面上，这会带来延迟。

有些情况下render会在没有任何必要的情况下改变，比如props和state都没有被使用或者被改变。这种情况render出来的DOM不会有区别。

为了避免做这种无用功。我们可用使用`shouldComponentUpdate`方法！

>shouldComponentUpdate

>@return : true | false

>@default return : true

>@description : 默认该方法永远会返回true，因为组件总会调用render方法。但是在首次渲染时，shouldComponentUpdate并不会被调用。