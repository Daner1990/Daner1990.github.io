---
layout: post
title: reviewboard工具rbtools使用
description: RBTool新版本支持ALIASES，支持自定义命令，只要在reviewboardrc文件中进行简单的配置就可以实现一条命令直接发布代码审计。
my_excerpt: 。
categories: [tools]
tags: [tools,svn]
pid: 201706270000
---

## 背景

我司在提交代码之前都需要对代码进行pre commit review。但在实际操作中并没有那么严苛。

由于正常流程提交代码审核需要打开review网页，生成diff文件，上传diff，对标题细节进行描述，并发布。

整个流程非常耗时繁琐，所以我一直是用的工具是eclipse中的插件tao-reviewborad。

但是eclipse的缺点也很明显，每次在进行提交代码之前都需要打开eclipse，进行review相关操作的提交。

为了使用其中一个插件的功能而内存中长时间打开一个1G左右的软件有些得不偿失。

## 解决方案

最近了解到RBTool新版本支持ALIASES，支持自定义命令，只要在reviewboardrc文件中进行简单的配置就可以实现一条命令直接发布代码审计。

不需要自己写脚本去编写。十分方便，所以一试~

具体reviewboardrc代码如下：

{% highlight  python %}
REVIEWBOARD_URL = "http://reviewboard.xxx.domain/"
REPOSITORY = "xxx"
REPOSITORY_URL = "https://scm.xxx.domain:18080/svn/xxx/trunk/xxx/"

OPEN_BROWSER = True
ENABLE_PROXY = False

GUESS_FIELDS = "auto"
GUESS_SUMMARY = "auto"
GUESS_DESCRIPTION = "auto"

DEBUG = "true"

PUBLISH = "true"

ALIASES = {
    'pt' : 'post --summary $1 --description $1',
    'ps' : 'post'
}

USERNAME = "xxxxx"
PASSWORD = "xxxxx"
{% endhighlight %}

我在aliases中定义了一个command pt 来简化整个post的操作，如下

{% highlight  python %}
rbt pt "保持summary和description一致，无法空格"
{% endhighlight %}

只需要一条简单命令就可以实现提交发布。

具体参数配置可以参看官网：

https://www.reviewboard.org/docs/rbtools/dev/rbt/commands/post/#rbt-post

## 弊端

在实际操作过程并不是那么美好，虽然节约了字符输入量，有两个问题

>第一：耗时并没有得到特别的缩短，特别是在上传diff的时候会出现明显的等待时间，文件越大耗时越长，虽然在内网之内去掉代理

依然有这个问题。5s左右的等待期其实有些无法忍受，具体解决方案等待调研

{% highlight  python %}
>>> Running: svn --non-interactive status -q --ignore-externals
>>> Running: svn --non-interactive diff --diff-cmd=diff --notice-ancestry -r BASE
>>> Making HTTP GET request to http://reviewboard.xxx.domain/api/review-requests/?only-links=create&only-fields=
>>> 在当前位置会有空白时间5s左右
>>> Making HTTP POST request to http://reviewboard.xxx.domain/api/review-requests/
>>> Making HTTP GET request to http://reviewboard.xxx.domain/api/review-requests/163145/diffs/?only-fields=
>>> Making HTTP POST request to http://reviewboard.xxx.domain/api/review-requests/163145/diffs/
>>> Making HTTP GET request to http://reviewboard.xxx.domain/api/review-requests/163145/draft/?only-fields=commit_id
>>> Making HTTP PUT request to http://reviewboard.xxx.domain/api/review-requests/163145/draft/
Review request #163145 posted.
{% endhighlight %}

>第二：命令行输入summary&description不支持直接空格，只能一次输入一个字符，python在识别command中参数时，是通过空格来判断是第几个参数的

在考虑加密的形式来写入空格，换行符。但是也许要设计到脚本，那就脱离了简单提交review的初衷了。后期可以对其进行优化。

如果愿意无视以上问题，现在的rbtools已经值得一用了~~

## 碰到的问题

在运行ALIASES中pt命令的途中遇到`cannot create process`的问题，rbtools是基于python的东西，这个主要是python系统的问题

我们在安装rbtools的时候实际上是会自带一套python环境

我们需要做的是把python对应到我们安装的rbtools的python环境中

具体变动在安装的rbtools目录下：

>C:\Program Files (x86)\RBTools\Python27\Scripts\rbt-script.py

{% highlight  python %}
#!C:\Program Files (x86)\RBTools\Python27\python.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'RBTools==0.7.10','console_scripts','rbt'
__requires__ = 'RBTools==0.7.10'
import re
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(
        load_entry_point('RBTools==0.7.10', 'console_scripts', 'rbt')()
    )

{% endhighlight %}

把python.exe的注释

>#!C:\src\rbtools\build\windows-pkg\build\Python27\python.exe

变更为代码中python.exe实际对应的位置即可，以下为我的实际位置

>#!C:\Program Files (x86)\RBTools\Python27\python.exe
