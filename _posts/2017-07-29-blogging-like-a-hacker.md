---
layout: post
title: "Blogging like a hacker"
category: Web
tags: Blog, Jekyll, hacker
comments: true
---

Starting up with the first post on my personal tech blog with a detailed insight into how I
actually built this blog seems to be a good idea in my opinion. Even more, since it is not a
typical Wordpress blog as you can see it a thousand times on the Internet. 
<!--more-->
What I wanted to have is a rather simplistic, clean and fast blog which is still easy and convenient to 
update.  
After some research on the Internet it turned out that <a href="https://jeykllrb.com" title="Official Jekyll Homepage" target="_blank">Jekyll</a>
could be the right choice for me. In this blog post I will outline what Jekyll acutally is,
why I decided to use it, how I built my tech blog with it and what I like or dislike about 
it with my knowledge so far. Enough introductory words, let's get started!

## Why Jekyll?
Jekyll is a blog-aware static website generator programmed in Ruby. It heavily uses Markdown
and generates static HTML documents out of it. So, why should I learn yet another technology
to create my blog or personal site when there exist things like Wordpress, Joomla or Drupal out.

* <b>Higher performance</b>

   In contrast to a traditional CMS like Wordpress or Joomla it does not need any database or PHP scripts running on the server to
   build HTML dynamically. This has a huge advantage when it comes to speed and performance since no database queries
   and HTML generation on the fly has to be done. Due to the lack of database queries and dynamically built pages, the site load much faster.
* <b>No bumpy plugins and full control</b>
   
   Moreover, although I am definitely not a Wordpress or PHP expert it's much easier with Jekyll
   to understand all of the code from the beginning on since there is no overhead to care about
   or plugins to maintain. Moreover Jekyll diminishes the security disadvantages many Wordpress plugins have
   if they are not carefully observed before downloaded or up-to-date.
* <b>Convenient hosting opportunity.</b>

   As a nice side effect it turned out that hosting a Jekyll powered
   website is not more than pushing to a git repository and ticking a checkbox. 
   I will talk about how I hosted my blog in more detail in the upcoming blog post.
   
Now it's time to get our hands a bit dirty and start up with the first Jekyll project.

## Get started

### Install Ruby
Since Jekyll has Ruby under it's hood make sure you have Ruby installed on your machine.
I will not give a detailed description here about how you do this but rather link you to
the respective <a href="https://www.ruby-lang.org/en/documentation/installation/" title="How to nstall Ruby" target="_blank">official web page</a>.
From my experience so far the best option is to use a ruby version manager where you can
manage multiple versions of Ruby on your machine and therefore be able to easily update 
to the desired version. On MacOSX and Linux this would be <a href="https://rvm.io/" title="Install RVM" target="_blank">RVM</a>
on Windows <a href="https://rubyinstaller.org/add-ons/uru.html" title="Install Uru" target="_blank">Uru</a>
 
### Install Jekyll
Installing Jekyll is now as it should be only a few commands in the Terminal.

`gem install jekyll bundler`

This will install the required Jekyll dependency and bundler which is a convenient tool
to manage Ruby Gems and their corresponding versions.

### Create your first site
Creating a Jekyll site is as easy as typing

`jekyll new my-awesome-site`

To startup your created site first change into the directory and then execute following two
commands.

`jekyll serve`

The command makes all gems specified in the Gemfile of the project available and 
builds your site and starts up a web server on port 4000. 
You can inspect your new awesome site at `http://localhost:4000`. 

What you will see at first glance is a clean and simply designed website containing some
predefined dummy content. 

![Initial site at localhost:4000]({{site.baseurl}}/assets/img/2017-07-29/minima.png)
 
This lets us know that Jekyll already did some initial work under hood 
and provides us with an initial setup. I think it is time to look at the structure and code of the project
to understand what's going on. 

## Anatomy of a Jekyll project
If you take a look at the directory structure after opening the project in your favorite IDE or TextEditor
it will look like in the example below.

```
| - _posts
    | - 2017-07-13-example-post.md
| - _site
    | - index.html
    | ...
| - config.yml
| - about.md
| - index.md
| - Gemfile
| - Gemfile.lock
```

### Configuration
As you can see in the root directory there is a file `_config.yml` which contains all the global configuration
for your blog. Here you can specify things like the title, author, description or url of your site.
The Jekyll generator already provides for you the important and most basic properties. You are free to define further
customer variables which can be used in your markup later on. An example therefore are the different contact
details (eg.: Email, Github, Facebook) in my blog which I don't have to repeat when using it at different places in my markup.
I will tell you how these variables can be used if you read on.

### YAML Front Matter
Like any typical website also this site contains an index file. However, here it is a Markdown document instead of the
traditional index.html. This brings us to to the point where the real cool magic of Jekyll happens, namely the YAML Front Matter.
If you take a look on the content of index.md you will see that it only contains three lines of code plus some explaining comment.
The opening and closing triple dash lines `---` tell the Jekyll engine to consider it as a special file to be processed.
In between those triple dash lines you can specify variables which can be accessed in the markup later on using a Jekyll specific language called Liquid. 
I will show you the basics of how to use Liquid to output front matter variables in a few paragraphs. 
For now it is enough to know that Jekyll treats files with YAML front matter in a special way, in case of Markdown it generates a HTML document when building the site.
There are some handy predefined variables you can specify in your Markdown.
I will mention those which are mostly used in the following tables.

#### Global variables

| Variables |                     Description                     |
|:---------:|:---------------------------------------------------:|
| layout    |        Specifies the layout used for the file       |
| permalink | Overwrite the site-wide default style of a page url |

#### Post related variables

| Variables |                     Description                     |
|:---------:|:---------------------------------------------------:|
| date    |        Overwrites the data extracted from the filename of the post       |
| category or categories | Nest posts into folder(s) when building the site |
| tags | Mark post with tags. One or more tags are possible. |
| title | Specify a title for your post (actually not a predefined variable but hightly recommended to use) |

### Built Site
The `_site` directory contains the built website how it is served to the end user. Your should not do any modification
here since this will be overwritten after the next build. If your webserver does not understand Jekyll you will have to upload the
contents of this directory to make your site visible in a browser. However, I will show you a much better option in my upcoming
blog post on how to host your Jekyll site most effectively. 

## Writing posts
Now that you have a basic understanding of how Jekyll works, writing blog posts is as simple as
creating a new Markdown file in the `_posts` folder, setting the few mentioned variables you need
and producing your content. After saving and and refreshing your browser, you will instantly see
the reflected changes. In essence, what you will see is a new entry with the date and title of your post
including a hyperlink to the detail page of the post. So far so good, but as mentioned in the very beginning
this site already looks quite appealing although we have not seen any line of CSS code so far. 
So, how can that be?

## Customization
You probably have seen that the `layout` variable in the index.md is assigned a value "home" which you
have not declared anywhere in your code. The reason why this still works is that it is injected from outside via a Ruby Gem.
In your `Gemfile` you will find a line

{% highlight ruby %}
gem "minima", "~> 2.0"
{% endhighlight %}

which is a default theme installed automatically by Jekyll. 
It provides you out of the box with a basic structure of your HTML pages and a stylesheet which follows the mobile-first principle.
You can localize this template by executing `bundle show minima`.
What you will find there among some other files are following three folder at which I want to look at in some more detail now.

```
| - _layouts
| - _includes
| - _sass
```

### Layouts 
Layouts are defined by HTML documents which should represent the structure of a particular page within
your website. As you can see there is also our home.html layout we were searching for. Looking at the code
we can see basic HTML tags mixed with some unknown non-HTML expressions as in the snippet below extracted from home.html.
 
{% raw %}
```html
<ul class="post-list">
    {% for post in site.posts %}
      <li>
        {% assign date_format = site.minima.date_format | default: "%b %-d, %Y" %}
        <span class="post-meta">{{ post.date | date: date_format }}</span>

        <h2>
          <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
        </h2>
      </li>
    {% endfor %}
  </ul>
```
{% endraw %}

The way how this works now, is that the author of a post can specify which layout should be used for a particular post and Jekyll injects your content into this
layout to finally retrieve the resulting HTML page. As mentioned a few paragraphs earlier Liquid code
is used to access YML front matter variables. The code snippet from above for instance uses a loop 
to iterate over all available posts accessible via the predefined array variable `site.posts` and outputs
the date in a specific format as well as a link to the detail page of the post. I summarized variables you
will most probably use when customizing your Jekyll site in the table below.

| Variables |                     Description                     |
|:---------:|:---------------------------------------------------:|
| site.posts    |        Provides a reverse chronological list of all posts. |
| page.date | Publishing date of a particular page like a blog post. |
| page.title | Title of a page. |
| page.url | The permalink url of the page |
| page.excerpt | The excerpt of the page. Especially useful for blogs when you only want to display a summarization of the post on your front page and a "Read more" button. |
| page.next | The next post relative to the postiion of the current post. |
| page.previous | The previous post relative to the position of the current post. |

### Includes
A very useful feature in my opinion for any template engine are partials. The creators of Jekyll had this thought as well
and introduced Includes which are located in a folder called `_includes`. These actually give use the opportunity
to stay DRY and don't copy HTML code which is the same among the whole site from one place to another. 
Predestinated parts of a page are for instance the `<head>...</head>` section or the header and footer.
Another handy use case is embedding code conditionally like Google Analytics which you only want to have in a productive environment.
Then you can use the `if statement` available in Liquid and only include the partial if the condition is fulfilled.
After setting the environment in your `config.yml` you can use it like this.

{% raw %}
```html
{% if jekyll.environment == "production" %}
    {% include partial.html %}
{% endif %}
```
{% endraw %}

### Sass
To give the site among its content and structure also a particular style, Jekyll heavily relies on Sass (Scss).
The Jekyll engine converts any Sass content to plain CSS when building the site. 
It therefore retains the same directory structure. (`/assets/main.scss` will turn into `/assets/main.css`)
Since Sass provides the capability of `imports` you can extract page specific styles into separate files
in the special `_sass` directory and import it via the `@import` statement in you `main.scss` file.
This way enables you to keep your code cleaner and modular. 

### More customization
Although the minima template provides a good starting point to get your first Jekyll site up and running
smoothly, you probably want to create a particular customer style for your site and have more control
over how things look like. To achieve this, you have several possibilities. 

1. You can use a predefined template like `minima` and overwrite parts of it. If you want to change 
for instance the page layout, you would create the `_layouts` folder manually and add a file with
the same name as it is called in the predefined template. This will overwrite previously introduced settings
of the template. The disadvantage in this case is that you have to know your base template quite well.

2. You can copy the code from the template gem directly into your project and remove the corresponding installation
line of the Gemfile. This enables you to have all of the template code in your project and therefore do not
have to lookup how files are named or how structure and styles of the template currently look like. This option however
has the disadvantage that you will not receive any more updates to the template since no gem is used anymore and `bundle update` will
not get a newer version.

3. You can relinquish on any predefined template at all and create your own style from scratch. The advantage of this option
clearly is that you fully own and understand all of the code. Moreover your are free to use any CSS framework (like Twitter Bootstrap) you want.
The obvious disadvantage is that it is more work to build up all you HTML layout and CSS from scratch and usually takes you longer depending on your HTML and CSS skills until
your site does not look like any amateur crap anymore.
 
There is no generally applicable answer which option you should decide on. 
It really depends on your individual requirements and frontend skills.

## Conclusion
After reading through this post and trying things out in your IDE, you should have a basic knowledge
of how Jekyll works and how you can use it to build your place in the web. I hope you enjoyed it and 
had a quite good impression and experience with it as I had it. I have to admit that this was only a 
short introduction into Jekyll but it should helped you to eliminate the first few obstacles faster.
If you want to dive deeper, and I hope so, the [official Jekyll documentation](https://jekyllrb.com/docs/home/ "Jekyll Docs")
is a very good resource and provides you with all the details. 

  








    
    

 

