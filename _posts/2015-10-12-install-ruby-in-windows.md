---
layout: post
title: 在windows下安装ruby使用gem
my_excerpt: 如题！
categories: [工具]
tags: [Windows,Ruby]
pid: 201510101500
---

在之前的文章中，我们通过`linux`命令行直接安装`ruby`，并通过`gem`安装了`jekyll`和`sass`等软件。我已经习惯了快捷的`linux 安装模式`，已经很少在`windows`配置环境，新公司的默认系统都是`windows`,虽然可以装虚拟机。但也要对windows环境熟悉熟悉了。

所以把`ruby`环境，`gem`操作安装在`windows`上：

1.在[官网](http://rubyinstaller.org/downloads)下载个`ruby`。在安装的时候，请勾选`Add Ruby executables to your PATH`这个选项，添加环境变量，不然以后使用编译软件的时候会提示找不到ruby环境！需要自己再去环境变量中进行配置。

<img src="{{ site.baseurl }}/postPics/ruby.png" alt="" style="margin: 5px auto;"/>

2.安装完`ruby`之后，在开始菜单中，找到刚才我们安装的`ruby`，打开`Start Command Prompt with Ruby`

<img src="{{ site.baseurl }}/postPics/ruby-cmd.png" alt="" style="margin: 5px auto;"/>

以用`gem` 安装 `sass` 为例：
然后直接在命令行中输入
{% highlight ruby linenos %}
gem install sass
{% endhighlight %}

按回车键确认，等待一段时间就会提示你sass安装成功。最近因为墙的比较厉害，如果你没有安装成功，可以用[淘宝的RubyGems镜像安装sass](http://daner1990.github.io/%E8%A7%A3%E5%86%B3GEM%E4%B8%8D%E8%83%BD%E7%94%A8%E7%9A%84%E9%97%AE%E9%A2%98/)，如果成功则忽略。

如果要安装beta版本的，可以在命令行中输入
{% highlight ruby linenos %}
gem install sass --pre
{% endhighlight %}
你还可以从`sass`的`Git repository`来安装，git的命令行为
{% highlight ruby linenos %}
git clone git://github.com/nex3/sass.git
cd sass
rake install
{% endhighlight %}
升级sass版本的命令行为
{% highlight ruby linenos %}
gem update sass
{% endhighlight %}
查看sass版本的命令行为
{% highlight ruby linenos %}
sass -v
{% endhighlight %}
你也可以运行帮助命令行来查看你需要的命令

{% highlight ruby linenos %}
sass -h
{% endhighlight %}

