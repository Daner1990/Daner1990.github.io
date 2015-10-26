---
layout: post
title: React学习笔记(三):组件的生命周期
my_excerpt: 直接看文章吧少年！
categories: [Javascript]
tags: [Javascript,React]
pid: 201510261512
---


#简介

我们知道，在React中一个组件就是一个**状态机**。对于特定的输入，总会返回一致的输出。

整个生命周期分三个阶段，并且在每个阶段都有简单的API可调用:

<div style="color:#dd2c4c">

- 实例化 

- 活动期

- 销毁

</div>

##实例化

当一个实例初次被创建被调用的方法有：

- getDefaultProps:
	用于为实例设置默认的props值
	对于组件类来说，这个方法只会被调用**一次**。
- getInitialState
- componentWillMount
- render
- componentDidMount
