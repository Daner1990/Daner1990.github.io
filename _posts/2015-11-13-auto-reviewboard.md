---
layout: post
title: 脚本化boardreview
my_excerpt: 直接看文章吧少年！
categories: [工具]
tags: [工具,boardreview,svn]
pid: 201511131512
---

##背景

我们现在的项目开发流程是首先提交代码到reviewboard，查看代码，代码合格，ship it！
然后再通过svn提交到服务器的流程。

然而我们的开发环境强制要求是windows，在脱离了便捷的linux便捷命令行之后，执行以上的每一步命令都显得特别繁琐，无法愉快的写代码。

目前涉及到的工具：

>eclipse 主要是用来提交代码

>reviewboard 主要是针对eclipse用户我们使用淘宝开发的插件：[tao-reviewboard](http://code.taobao.org/p/tao-reviewboard/wiki/index/)。reviewboard最主要、最基本的功能是生成本地代码和源代码管理服务器上代码的diff并上传至Review Board服务器

>svn (第三方插件通过help->install new software;来安装。可以在window->perferences;来配置相关信息)

以上是我现在用来上传代码的工具。在提交人是自己ship的还是自己。并且主要开发环境不是eclipse的情况下，要打开eclipse，要reviewboard，要打开网页输入reviewID进行ship，然后再回到eclipse进行svn代码提交整个过程是无比繁杂的。

在此基础上，我想做的是通过脚本完成以上所有步骤。此为背景

##安装相关软件

>Python

从 http://www.python.org/getit/ 下载并安装Python

>easy_install

确保系统中有easy_install工具。如果没有，请从这里下载并安装：http://peak.telecommunity.com/dist/ez_setup.py。easy_install主要是用来安装python的第三方扩展包。
正常情况下，我们要给Python安装第三方的扩展包，我们必须下载压缩包，解压缩到一个目录，然后命令行或者终端打开这个目录，然后执行
{% highlight html %}
python setup.py install
{% endhighlight %}
来进行安装。

这样是不是很繁琐呢？如果我们直接命令行执行
{% highlight html %}
easy_install ThirdSoftware
{% endhighlight %}

>RBTools

在命令行中运行：`easy_install -U RBTools`
运行`post-review --version`测试安装是否成功


---

