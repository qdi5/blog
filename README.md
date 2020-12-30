# 静态网站说明

使用
====================================

配置
------------------------------------

本项目需要配置的只有一个文件`_config.yml`，打开之后按照如下进行配置。

> 特别注意`baseurl`的配置。如果是`***.github.io`项目，不修改为空''的话，会导致JS,CSS等静态资源无法找到的错误

``` bash
name: 博客名称
email: 邮箱地址
author: 作者名
url: 个人网站
# baseurl修改为项目名，如果项目是'***.github.io'，则设置为空''
baseurl: "/LessOrMore"
resume_site: 个人简历网站
github: github地址
github_username: github用户名称
# 请到百度统计官网[https://tongji.baidu.com/](https://tongji.baidu.com/)申请自己的网站ID并在此处替换，否则将无法正常统计访问量
baidu_analysis: 94be4b0f9fc5d94cc0d0415ea6761ae9
# 请到revolvermaps [http://www.revolvermaps.com/?target=setupgl](http://www.revolvermaps.com/?target=setupgl)申请自己的网站ID并在此处替换，否则将无法正常统计访问量
revolvermaps: 5ytn1ssq6za
```


如何写文章
------------------------------------

在`LessOrMore/_posts`目录下新建一个文件，可以创建文件夹并在文件夹中添加文件，方便维护。在新建文件中粘贴如下信息，并修改以下的`titile`,`date`,`categories`,`tag`的相关信息，添加`* content {:toc}`为目录相关信息，在进行正文书写前需要在目录和正文之间输入至少2行空行。然后按照正常的Markdown语法书写正文。

``` bash
---
layout: post
#标题配置
title:  标题
#时间配置
date:   2016-08-27 01:08:00 +0800
#大类配置
categories: document
#小类配置
tag: 教程
---

* content
{:toc}


我是正文。我是正文。我是正文。我是正文。我是正文。我是正文。
```

执行
------------------------------------

``` bash
jekyll server
```

效果
------------------------------------
打开浏览器并输入URL`http://localhost:4000/`,回车。


## 在本地启动jekyll站点(可通过ip访问)
```ruby
bundle exec jekyll serve -w --host=0.0.0.0
```
### 学习笔记
1. 以html,md,markdown结尾的文件，将会被作为一个页面存在，访问的时候，直接以根路径加上文件名访问，比如：contract.html,访问路径就是：https://qdi5.github.io/contract.html  
2. 使用`post_url`标签来跳转到其他文章，即使文章的永久链接更换了也不会有影响
3. 在文章中包含图片和文件等静态资源，可以在博客项目的根路径下新建一个文件夹，比如：assets,将静态资源文件如图片，pdf文件，等放在这个目录下，在文章中直接使用绝对路径引用;例如：[告白气球.mp3](/assets/media/renxi.mp3)
4. 草稿文章放在`_drafts`目录下；如果想查看草稿显示的效果，则在启动jekyll的时候使用这条命令：`jekyll serve --drafts`
5. 包含在`---`里的内容，称作 Front Matter，在Front Matter里可以设置预定义变量，或自定义全局变量。这些变量可以在模板标签里面使用
6. 支持使用sass；文件需要以两行`---`开头
7. Layouts是包裹你的内容的模板文件。它们允许你在统一的地方，为你的模板存放源代码，因此你不必在每个页面都重复一些东西，像导航栏，页头，页脚等等。Layouts位于_layout目录下。按照约定有一个叫做`default.html`的基础模板,根据需要，也会有基于此模板的其他layouts.`content`是一个特殊的变量，它的值是layout包裹的post或page渲染之后的内容。
8. Pages构建内容的最基本单位，对于独立的内容非常有用；添加一个page的最简单方式就是在根目录添加一个html文件，并使用一个合适的文件名。也可以使用以.md后缀结尾的Markdown文件，在项目源代码被构建完成之后，它被转换为html文件。如果你的pages很多，你可以使用子目录来组织你的pages。
9. Posts是文章存放的地方，我们把博客文章写成文本文件（如markdown，html文件），jekyll会自动把它在系统中转换成一篇博客。在_posts文件夹下存放我们写的博客文章，文章文件的命名格式形如：`YEAR-MONTH-DAY-title.MARKUP`其中`MARKUP`可以是markdown或html；所有博客文章的内容，必须以`Front Matter`开头，用于设置`layout`或其他元信息，例如：
``` ruby  
  ---
  layout: post    
  title: "Welcome to Jekyll"
  ---
  # Welcome
  **hello world**, this is my first Jekyll blog post.
  I hope you like it!
```    
10.Front Matter:任何包含了`YAML`前言块的文件将会被Jekyll处理为一个特殊的文件。
11.Data Files。Jekyll支持从_data目录下的`YAML`,`JSON`,`CSV`和`TSV`文件加载数据。**CSV和TSV必须包含标题行**。目前暂不做深入了解，以后可以查看[这里](https://jekyllrb.com/docs/datafiles/ 'Jekyll Data Files说明文档')的文档。    
12.Permalinks固定链接。是`pages`，`posts`或`collections`的输出路径。它允许你组织你的源代码的目录结构和输出的目录结构不同。
## changelog
[2020-05-14] 
在`_layouts/post.html`里移除disqus评论代码：    
```ruby
{% if page.comments == false %}
  <div class="container mx-auto px-2 py-2 clearfix comments text-accent" >
    <p>无法加载评论；disqus需要自备梯子；</p>
    <p>若您已经自备梯子了；则是博主关闭了评论功能,敬请谅解！</p>
  </div>
{% else %}
  <div class="container mx-auto px-2 py-2 clearfix comments">
    {% include disqus.html %}
  </div>
{% endif %}
```    
新增valine评论系统
[2020-06-14]
新增_drafts目录，用于存放草稿，草稿的文件名不需要带上日期；在本地查看草稿，启动jekyll时需要带上参数：    
```bash
jekyll serve --drafts
```
