---
layout: post
title: 解决Git客户端提交Commit无贡献记录问题
my_excerpt: 解决Git客户端提交Commit无贡献记录问题
---

最近通过Git客户端或者Git命令行提交代码，网页并没有记录贡献，有种我明明提交了代码你为什么不承认的感觉，这是无法容忍的

遇到的两个情况，一个是向fork分支的代码提交commit。没有记录贡献

一个是在Windows Git客户端中进行代码提交没有记录贡献

官方已经给出了帮助文档进行了解释

<a href="https://help.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile/">为什么我的记录没有在profile中显示解答</a>


以下是三中commit没有出现在profile的原因：

1.You haven't added your local Git commit email to your profile

2.Commit was not made in the default or gh-pages branch

3.Commit was made in a fork


对于第二种第三种。可以把把master分支切换到当前开发分支上

对于第一种，需要在Git客户端进行配置

git config --global user.name "YOUR NAME"

git config --global user.email "YOUR EMAIL ADDRESS"

同时可以检测下email的正确性，已保证commit被正确记录

<a href="https://help.github.com/articles/set-up-git/">客户端Git Set</a>

<a href="https://help.github.com/articles/keeping-your-email-address-private/">Email</a>


