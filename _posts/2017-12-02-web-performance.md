---
title: My page speed checklist for web developers
category: Web
tags: Page speed, Web performance
---

It's a typical requirement in nowadays internet businesses to have a beautifully designed and appealing website which 
catches the eye of a customer and as a result leads to an increased conversion rate. 
<!--more-->
However, what UI/UX experts, who proudly present their shiny elegant design and web developers, 
who use several JavaScript plugins to make all those incredible animations on a web page work, 
do not know, is that this stuff is counterproductive when it comes to speed of a website. 
Although more and more people start to really care about website performance, there are still a lot doing it wrong. 
What I have to admit is, that it's definitely not an easy task to optimize speed of a complex and huge website or web app. 
Anyway, it's doable and if you make it part of the development process it will become much easier. 
With this blog post I want to provide some tips and  tricks you should follow to be in the 
safe area. This list is based on my experience so far and targets especially web development. 
If you have something to add or discuss, feel free to leave a comment at the end.

## Why should I care?
There have already been several case studies to investigate consequences of slow websites. Different numbers were published
but all of them show that just a second delay in loading a website leads to a dramatic increase in page bounces and as a result
to a drop in conversion rate. If you think about your own behavior when browsing the web and trying to satisfy a 
search intent you have, you will also realize that you expect a website to be there almost immediately. Otherwise you will
just leave and click on the next item listed in Google. In addition to these reasons also Google will send less traffic to
a slow website. In terms of SEO (Search-Engine-Optimization) page speed is one of their most important criterion.
So, I think it should be clear right now that it definitely makes sense to pay attention to page speed and understand that
it's worth to invest time to optimize it.

## How to check page speed
I will briefly outline the best tools to check how well your website performs in terms of page speed.

* <b><a href="https://developers.google.com/speed/pagespeed/insights/?hl=de" target="_blank">PageSpeed Insights</a></b>
This is the most popular tool to check speed. It is developed and maintained by Google and provides useful feedback to tell
you where you can improve. 

<img class="js-lazy-image" data-src="{{site.baseurl}}/assets/img/2017-12-02/psi.png" alt="PageSpeed Insights" />

Although you should not blindly trust the exact score of PageSpeed Insights, your goal should be to get into the green area,
both on mobile and desktop. 

* <b><a href="https://developers.google.com/web/tools/lighthouse/" target="_blank">Google Lighthouse</a></b>
The latest tool developed by Google is much richer than PageSpeed Insights since it not only allows to check page speed.
Rather Google wants to build an all-in one solution for websites and web apps. It allows you to check performance, accessibility,
compliance with best practices in web development and whether you stick to progressive web app rules. 

<img class="js-lazy-image" data-src="{{site.baseurl}}/assets/img/2017-12-02/lighthouse.png" alt="Google Lighthouse" />

* <b><a href="https://www.webpagetest.org/" target="_blank">Webpagetest.org</a></b>
This tool lets you dive deeper into the loading process of your website as it visualizes each request in a waterfall diagram.
You get a good overview on where time gets lost and as a result where you need to improve. Moreover every request can be
analyzed in more detail when clicking on it. Metrics like "Time to First Byte", "Connection Time" or "SSL Negotiation" can
provide detailed info where possible bottlenecks are. 

## Page speed - Tips and tricks
Now, that you know which tools to use to check your web performance status, it's time to introduce some tips and tricks
to bring your website's speed to a higher level. I want to talk about the prominent problems I have seen in my young career
so far and show techniques and tools to tackle them.

### Images
From my experience probably the most problematic issue. I agree that beautiful images make a website more appealing and I
don't want to say that you have to delete all images on your website. However, when adding images to a web page you should have
page speed in mind. Applying following techniques keeps your website fast and prevents Google from punishing you in the page speed score.

<b>Decrease file size</b>
Never take your picture from a camera as it is and upload it to your server. Think about how big the image should be on your
website and adjust the size of the image accordingly. This usually reduces your file size already quite a lot. Moreover, 
I recommend <a href="https://imageoptim.com/online" target="_blank">ImageOptim</a> which removes any unneeded information from
the original image and saves another few percent. If possible, use SVG instead of JPEG or PNG. 

<b>Responsive images</b>
Every modern website nowadays sticks to a responsive design in order to make it visually attractive on a smartphone or tablet.
The problem is that images which are shown quite big on a desktop, appear much smaller on a mobile phone since there is not enough space.
There are ways with HTML5 to prevent your website from loading images which are too large for the used device.
Extending your the `<img>` tag with the attribute `srcset` allows you to specify the same image in different sizes and depending
on the viewport the browser downloads the most appropriate one. As a result bandwidth can be saved and your site gets faster.
Read <a href="https://www.sitepoint.com/how-to-build-responsive-images-with-srcset/" target="_blank">this article</a> to get more implementation
details. 

<b>Lazy loading of images</b>
You might have heard of "above-the-fold" content. This is the content which the user sees without scrolling and is 
expected to be visible as fast as possible. Especially on mobile devices there is not much space there and most content is
below-the-fold. To decrease the overall page load time, images which are not visible anyway in the beginning can be lazy-loaded on demand.
I recently stumbled across Google's InteractionObserver which provides an easy solution to lazy load images when they come
into viewport. Following code snippet shows how to use the InteractionObserver to observe all images on a web site and 
load them if they come into viewport. Loading happens automatically when the data-src attribute gets replaced by the src attribute.

HTML:
`<img data-src="<url>">`

JS:
```
const images = document.getElementsByTagName('img');
var observer = new IntersectionObserver(onIntersection, {});
    images.forEach(function(image) {
        observer.observe(image);
    });
    
function onIntersection(entries) {
    entries.forEach(function(entry) {
        if (entry.intersectionRatio > 0) {
            observer.unobserve(entry.target);
            preLoad(entry.target);
        }
    });
}

function preLoad(image) {
    image.src = image.dataset.src;
    image.onload = function() {
       image.removeAttribute('data-src');
       image.removeAttribute('data-srcset');
    };
}
``` 

More information can be found in the <a href="https://developers.google.com/web/updates/2016/04/intersectionobserver" target="_blank">official documentation</a>.

### Render-blocking JavaScript
JavaScript is basically necessary on nearly every website or web app. The problem is that the browser stops rendering when
it sees a `<script>` tag in the HTML, no matter whether this JavaScript is inlined or loaded from a file.
Google will complain about such JavaScript if it happens to be above-the-fold as this delays loading of the immediately visible content.
Although it's not always possible to prevent render-blocking JS at all, there at least ways to alleviate the problem.

* <b>Do not load JavaScript early during parsing</b>
Often JavaScript resources are loaded although they are not needed at a particular point in time. Maybe you want to use jquery
to introduce some animation effect to a UI component but this animation is only visible if the user scrolls down. Then consider
loading the JavaScript resource at a later point in time. A simple rule you should stick to, is placing 
JavaScript at the end of the `<body>` tag to ensure that parsing is not halted. 
In addition consider following possibilities:

Download JavaScript asynchronously and execute it when its ready: `<script src="..." async>`
Download JavaScript when parsing is complete: `<script src="..." defer>`

* <b>Inline very small JavaScript</b>
If the JavaScript only consists of a few lines of code, you should consider inlining it as you save the network roundtrip
to fetch the resource and time to download it. 

* <b>Minify and concatenate JavaScript</b>
Although this does not directly solve the render-blocking issue, I always recommend to use minified and concatenated JavaScript in a productive environment.
Even if it should happen that a script has to be loaded to render above-the-fold content, the size of the file to be loaded should be
as small as possible to save some time when downloading. A popular project for JS minification is <a href="https://github.com/mishoo/UglifyJS2" target="_blank">UglifyJS</a>.
If you are interested how to add this to a build pipeline like <a href="https://gulpjs.com" target="_blank">Gulp</a>, 
see <a href="https://codehangar.io/concatenate-and-minify-javascript-with-gulp/" target="_blank">this blog post<a/>.  
  
### Render-blocking CSS
Unfortunately also CSS blocks the browser from rendering. Although the browser already knows how the DOM looks like when the
HTML is fetched completely, it pauses rendering when loading CSS to prevent showing the naked page without any CSS,
also called FOUC (Flash of unstyled content). 

* <b>Minify CSS and load it early</b>
As with JavaScript also CSS should be minified to reduce the size to download and therefore save valuable milliseconds where 
rendering can be started earlier. CSS should be loaded in the `<head>` of an HTML document to start rendering as early as possible.

* <b>Inline CSS</b>
You will most probably notice that Google complains about CSS blocking the rendering process for above-the-fold content.
This is absolutely not easy to solve but if you do not require that much CSS, you can consider inlining it in the index.html
document instead of loading it from a file. 

* <b>Asynchronous loading of CSS</b>
A very new attribute for the `<link>` tag is `preload` which allows asynchronous loading of CSS which does not block rendering.
CSS is applied as soon as it's ready. This can be used for non-critical CSS which is not immediately necessary to style visible 
content on the page. Currently it's only supported by some of the browser like later versions of Chrome and Firefox. However,
there is a polyfill method provided by the <a href="https://github.com/filamentgroup/loadCSS" target="_blank">loadCSS project</a>.

### Caching and CDN
Although the first impression of a website is often the most important, you want to provide users coming back a good experience as well. 
To prevent the browser from downloading assets like JS, CSS, fonts or images again, it's recommended to implement a caching policy. 
The simplest form of caching is telling the browser that it can reuse a local copy from the previous visit.
This is done by setting a cache header to the asset you want to cache for a certain time. This is usually configured quite easily 
on the respective web server you are using. On an Nginx it can look like following:

```
location ~*  \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 365d;
}
```

Depending on whether you want to serve people around the world, you can also think of using a CDN in addition to browser caching.
Thereby content gets replicated on various edge servers which are geographically distributed. Depending on where a visitor
accesses your website the assets are delivered from the nearest edge server. Popular CDN networks are <a href="https://www.cloudflare.com/" target="_blank">Cloudflare</a>
or <a href="https://aws.amazon.com/cloudfront/?sc_channel=PS&sc_campaign=acquisition_AT&sc_publisher=google&sc_medium=english_cloudfront_b&sc_content=cloudfront_e&sc_detail=amazon%20cloudfront&sc_category=cloudfront&sc_segment=160712116278&sc_matchtype=e&sc_country=AT&s_kwcid=AL!4422!3!160712116278!e!!g!!amazon%20cloudfront&ef_id=V-tECwAAACvvabv6:20171202123546:s" target="_blank">Amazon Cloudfront</a>.
As this blog post is intended to provide some tips and tricks in order to improve page speed as a web developer, I will not dive
any deeper into the topic of CDNs right now.

## Conclusion
I hope I could provide you a good overview on some things a web developer should consider when building a website or web app.
I know that web performance is a complex topic and depending on the type of application also involves backend and infrastructure
tasks. However, this blog post was written from a web developer's perspective and should give some insights into which problems
and solutions are available on the frontend side.  

   


