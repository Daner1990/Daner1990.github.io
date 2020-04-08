---
layout: post
title: React学习笔记(一)
my_excerpt: 直接看文章吧少年！
categories: [Javascript]
tags: [Javascript,React]
pid: 201510221412
description: 15年学了react，这么早呀
---

**<span style="color:#dd0000">1. 安装`React`环境</span>**

1 根据你的系统安装响应版本的[`node`](https://nodejs.org/en/)。
[`npm`](http://www.cnblogs.com/fsjohnhuang/p/4178019.html)作为`node`的模块管理和发布工具，已跟随`node`一起安装。

2 通过`npm install -g npm` 把[`npm`](https://docs.npmjs.com/getting-started/installing-node) 升级为最新版本。
(由于我大中华防火墙过于强大可以用Taobao提供的[镜像](http://npm.taobao.org/)来配置源)

3 在相关项目下安装`react`和`react dom`

{% highlight html %}
`npm install --save react react-dom`
{% endhighlight %}

4 安装[`Browserify`](http://browserify.org/#install)。
`Browserify`作为一个[Javascript打包工具](http://www.ruanyifeng.com/blog/2014/09/package-management.html)。
可以把类似`node`风格的`require()`方法以及其依赖打包为浏览器可读的代码以便在浏览器中运行。 
类似工具还有`webpack`等根据个人喜好进行安装。

{% highlight html %}
`npm install -g browserify`
browserify -t babelify main.js -o bundle.js
{% endhighlight %}

---

**<span style="color:#dd0000">2. 整体理解 `React`</span>**

我们从一段很基础的HTML中对react进行一个整体的理解：

{% highlight html linenos %}
<!DOCTYPE html>
<html>
<head>
	<script src="../build/react.js"></script>
	<script src="../build/react-dom.js"></script>
	<script src="../build/browser.min.js"></script>
</head>
<body>
	<script type="text/babel">
		var Hello = React.createClass({
			getInitialState: function () {
				return {
					opacity: 1.0
				};
			},
			getDefaultProps : function () {
				return {
					name: 'hello'
				};
			},
			propTypes: {
				name: React.PropTypes.string.isRequired,
			},
			componentDidMount: function () {
				this.timer = setInterval(function () {
					var opacity = this.state.opacity;
					opacity -= .05;
					if (opacity < 0.1) {
						opacity = 1.0;
					}
					this.setState({
						opacity: opacity
					});
				}.bind(this), 100);
			},

			render: function () {
				return (
					<div style={{opacity: this.state.opacity}}>
						Hello {this.props.name}
					</div>
					);
			}
		});

		ReactDOM.render(
			<Hello name="world"/>,
			document.body
			);
	</script>
</body>
</html>
{% endhighlight %}

a. 代码最开始加载三个库，`react`是React的核心库，`react-dom`提供与DOM相关的功能，`browser`将`jsx`语法转化为javascript语法，这一步往往在服务器上完成。

b. `ReactDOM.render()`方法是react最基本的方法，将模板转为HTML语言，并插入指定DOM节点。

c. `JSX语法(Javascript XML)`，让HTML，javascript可以混写，遇到HTML标签`<开头`就用HTML解析，遇到`{`开头就用Javascript规则解析，遇到`{``{`开头就解析为CSS。JSX有严格的标准。

d. `React.createClass()`用于生成组件类，以上例子中变量`Hello`就是我们生成的组件类，模板插入`<Hello />`，就会自动生成一个Hello的实例。组件类通过render来输出组件。

e. 在生成组件类时，可以通过**<span style="color:#b00">this.props</span>**定义组件属性。比如render上的`name="world"`就是我们的属性。在组件中可以通过`this.props.name`来读取！不过值得注意的是要避开javascript的保留字如class，for等。

f. 为了保证组件属性`props`的正确性，我们需要一种验证机制验证参数是否符合要求。可以通过`PropTypes`来验证。同样我们可以通过`getDefaultProps`来设置组件属性的默认值。

g. 组件免不了要和用户互动，一开始有一个初始值，互动就会导致状态发生变化。从而触发重新渲染UI。比如上例中，我们定义了`this.state.opacity`。并定义了一个定时机制每100ms就改变状态。`this.setState`方法就修改状态值。每次修改之后，就会`自动调用render`去重新渲染组件。由于 this.props 和 this.state 都用于描述组件的特性，可能会产生混淆。一个简单的区分方法是，this.props 表示那些一旦定义，就不再改变的特性，而 this.state 是会随着用户互动而产生变化的特性。

y. 组件是有生命周期的。分为三个状态`Mounting 已插入真实 DOM`,`Updating正在被重新渲染`,`unMounting已移出真实 DOM`
`React` 为每个状态都提供了两种处理函数，`will` 函数在进入状态之前调用，`did` 函数在进入状态之后调用，三种状态共计五种处理函数。

>componentWillMount()

>componentDidMount()

>componentWillUpdate(object nextProps, object nextState)

>componentDidUpdate(object prevProps, object prevState)

>componentWillUnmount()

[React 入门](http://www.ruanyifeng.com/blog/2015/03/react.html);

