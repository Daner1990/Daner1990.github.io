---
layout: post
title: 解决插件hightlight没有关闭相关问题
my_excerpt: 直接看文章吧少年！
categories: [工具]
tags: [highlight,jekyll,git]
pid: 201510151608
---

这几天在把之前Blog的文章Copy过来，在导入一片全代码的文章时出现了以下错误

{% highlight %}
    Regenerating: 1 file(s) changed at 2015-10-15 15:31:48   
    Liquid Exception: highlight tag was never closed in _posts/2015-4-16-css-load.md/#excerpt
	...error:
    Error: highlight tag was never closed
    Error: Run jekyll build --trace for more information.
{% endhighlight %}

jekyll版本是 2.5.3。具体文章是[css load标签](http://daner1990.github.io/css-load/);

---

错误总提示`highlight`没有关闭。经查资料在`jekyll 1.+`版本中出现过改问题，[`bug`连接](https://github.com/jekyll/jekyll/issues/1401);
提示没有关闭的原因是`highlight`包裹的相关代码中有crlf & lf 及**回车和换行**。把代码中的所有换行去掉变没有错误。
但是这个问题在我其他的`blog`中并没有出现。暂时不知道是什么原因导致了此不一致性。
