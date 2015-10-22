---
layout: post
title: React学习笔记一
my_excerpt: 直接看文章吧少年！
categories: [Javascript]
tags: [Javascript,React]
pid: 201510221412
---

1. 安装`React`环境

{% highlight %}
1. 根据你的系统安装响应版本的[`node`](https://nodejs.org/en/)。
   [`npm`](http://www.cnblogs.com/fsjohnhuang/p/4178019.html)作为`node`的模块管理和发布工具，已跟随`node`一起安装。
2. 通过`npm install -g npm` 把[`npm`](https://docs.npmjs.com/getting-started/installing-node) 升级为最新版本。(由于我大中华防火墙过于强大可以用Taobao提供的[镜像](http://npm.taobao.org/)来配置源)
3. 安装react和react dom
   `npm install --save react react-dom`
4. 安装[`Browserify`](http://browserify.org/#install)。Browserify作为一个[Javascript打包工具](http://www.ruanyifeng.com/blog/2014/09/package-management.html)。可以把类似node风格的require()方法以及其依赖打包为浏览器可读的代码以便在浏览器中运行。 类似工具还有webpack等根据个人喜好进行安装。
   `npm install -g browserify`
{% endhighlight %}

---

[React 入门](http://www.ruanyifeng.com/blog/2015/03/react.html);

