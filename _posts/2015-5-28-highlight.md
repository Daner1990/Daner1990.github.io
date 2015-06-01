---
layout: post
title: yekyll语法高亮
my_excerpt: Jekyll 自带语法高亮功能，它是由 Pygments 来实现的。在文章中插入一段高亮代码非常 容易，只需使用 Liquid 标记
tags: [tools,yekyll]
---

###以下是例子

{% highlight ruby linenos %}

def show
  @widget = Widget(params[:id])
  respond_to do |format|
    format.html # show.html.erb
    format.json { render json: @widget }
  end
end

{% endhighlight %}


{% highlight html linenos %}

<html>
    <body>
        <p>Hello World</p>
    </body>
</html>

{% endhighlight %}


