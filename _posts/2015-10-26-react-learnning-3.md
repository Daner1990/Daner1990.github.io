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

- <span style="color:#dd2c4c">实例化</span> 
- <span style="color:#dd2c4c">活动期</span>
- <span style="color:#dd2c4c">销毁</span>

##实例化

当一个实例初次被创建被调用的方法有：

-  <span style="color:#dd2c4c">getDefaultProps:</span>

	用于为实例设置默认的props值
	对于组件类来说，这个方法只会被调用**一次**。

- <span style="color:#dd2c4c">getInitialState</span>
	
	和`getDefaultProps`不同的是，getInitialState在每次实例创建事，该方法都会被调用一次。
	在这个方法里，我们已经可以访问this.props了。

- <span style="color:#dd2c4c">componentWillMount</span>

	在完成首次渲染之前被调用

- <span style="color:#dd2c4c">render</span>

	创建一个虚拟DOM，用来表示组件输出。
	对于一个组件来说，render是`唯一一个必须的方法`。
	render需要满足几点：
	- 只能通过this.props & this.state 访问数据 
	- 可以返回null ，false 或者任何React组件
	- 只能出现一个顶级组件（不能返回一组元素）
	- 必须纯净，不能改变组件的状态或者修改DOM的输出`??不太理解`

- <span style="color:#dd2c4c">componentDidMount</span>
	
	在render方法成功调用并真实的DOM已经被渲染之后。可以在该方法内通过this.getDOMNode()来访问渲染之后的真实DOM！


##存在期

在存在期，组件已经渲染好了，用户可以和他进行交互操作了。通过click等事件来触发一个事件处理器。通过用户改变组件或者整个应用的state，便会有新的state流入组件树。并求我们会获得操控他的机会：

- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate
- componentDidUpdate


##销毁&清理期

- componentWillUnmount
