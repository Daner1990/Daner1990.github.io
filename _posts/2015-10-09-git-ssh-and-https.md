---
layout: post
title: 解决Git Push总要输入用户名密码
my_excerpt: 直接看文章吧少年！
categories: [Tools]
tags: [Tools,Git,SSH,HTTPS]
pid: 201510091621
---

最近在用<code>Git Bash</code> ，<code>Ubuntu Shell</code>提交代码到<code>Git</code>上，每次都需要输入用户名&密码。

通过Git ssh 帮助文档[Git-Generating-SSH-Set](https://help.github.com/articles/generating-ssh-keys/#platform-linux)在本地生成<code>ssh key</code>，并把<code>public key</code>放在git官网上。

文档中指出通过以下命令生成`key` :

    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
	Creates a new ssh key, using the provided email as a label
	Generating public/private rsa key pair.

我在`windows git bash` 生成`key` 的时候直接通过 `ssh-keygen` 来生成，并没有严格按照步骤接上`git` 的email。完成所有步骤后经验证。

    Hi username! You've successfully authenticated, but GitHub does not
	provide shell access. 


验证通过但是依然要输入用户名密码才能提交！
在`linux ` 上严格按照以上步骤加入git的email进行添加`key` 验证和以上情况相同！

经过检测发现其实是`ssh` 和 `https` 的原因导致的，`key` 已经正确加入了！
<code>git</code>默认走的是<code>https协议</code>。所以在<code>clone</code>代码的时候注意使用<code>ssh协议</code>的连接。

<img src="{{ site.baseurl }}/postPics/gitSshHttps/git_ssh_https.png" alt="" style="width:200px;margin: 5px auto;"/>