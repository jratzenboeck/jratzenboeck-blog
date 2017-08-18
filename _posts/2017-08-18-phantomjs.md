---
title: Execute browser-like Javascript without a Browser
category: Web
tags: Javascript, PhantomJS, DOM
---

If you are familiar with nowadays web development, you most probably have already 
worked with frameworks like AngularJS or EmberJS. Today I want to introduce you a Javascript framework I came along recently which is not that sort of popularity as the two I mentioned
and you might not have heard of so far, namely <a href="http://phantomjs.org/" title="PhantomJS Website" target="_blank">PhantomJS</a>.
<!--more-->
However, it's not less interesting and can be quite handy in some use cases as I will show you in the following paragraphs.
After the quick start examples I would like to show you in the last section how I built a pre-rendering engine to be used 
for crawlers and social sites with PhantomJS. Let's get started right away.

## What is PhantomJS
"PhantomJS is a headless WebKit scriptable with a JavaScript API" as it says in the first sentence on their website pretty 
accurate. To put it simply, this means PhantomJS is like a browser with no UI. At first glance this does not sound very
helpful in any way but if you look at it in more detail it actually has some advantages from a developer's perspective,
which I will outline later on. Before that, let's quick start with the smallest possible example.

## Quick Start

* Download and install <a href="http://phantomjs.org/download.html" title="PhantomJS Download" target="_blank">PhantomJS</a>.
  On MacOSX you can also use `brew install phantomjs`.
* Create a Javascript file `hello.js`
* Content of the file should be:
  ```
  console.log('Hello World');
  phantom.exit();
  ```
* Execute `phantomjs hello.js` on the command line and you should see the message.
  
## What can I use it for?
The quick start example did its job but now lets look at some useful practical examples. 
I will show you a few small and handy examples where you can see the power of PhantomJS and get an idea of where
it can be useful. The examples are available as a project in a [GitHub repository](https://github.com/ratzi199/phantomjs-examples) I published.
Clone the repo if you want to test things out immediately.

### Screen capturing
PhantomJS uses the open source HTML rendering engine WebKit and is therefore able to render a web page like a traditional browser does.
To get started you need to require the webpage module of PhantomJS. 
 
`var page = require('webpage').create();`

Once you have an instance of a web page you can request a HTML page and as soon as the page has finished loading you will 
be called back with a status indicating `success` or `fail`. In the callback you can take a screenshot of the rendered page 
by using the `render` method and passing a filename for the image. 

```
page.open('index.html', function(status) {
    if(status === "success") {
        page.render('example.png');
    }
    phantom.exit();
});
```

### DOM access and manipulation
PhantomJS can execute Javascript like any browser and it also allows you to access elements of the rendered DOM.
The following simple example shows you how to get the title of the rendered page.

```
var title = page.evaluate(function() {
    return document.title;
});
```

To execute Javascript in the context of the opened web page, the `evaluate` function can be used.
Keep in mind that the evaluation is limited to the Javascript scope of the opened web page and is therefore not able to
access any other Javascript outside of this web page. 

### Headless website testing
It's always a good practice to test applications thoroughly. Javascript is no exception here.
There are very good testing frameworks to test Javascript code without the need of a DOM like in NodeJS.
However, if you also want to verify that your DOM contains the correct elements and have the desire to run these UI tests
alongside with the others, PhantomJS can help. PhantomJS is not a testing framework per se but it can launch existing test runners.
You can find a list of supported test runners <a href="http://phantomjs.org/headless-testing.html" title="PhantomJS Headless Testing" target="_blank">here</a>.

I tried to use PhantomJS in conjunction with <a href="https://mochajs.org/" title="Mocha JS" target="_blank">Mocha</a> and will show you the steps to get it working.

* Once you have initialized your project to use Node, you can install `mocha` and the assertion library `chai` by
  executing `npm install mocha chai --save-dev` on the command line.
* After that you have to do `npm install mocha-phantomjs-core` to be able to run client side Mocha tests in PhantomJS.
* Create your Mocha Test accessing the DOM like following:
  ```
  describe('DOM Tests', function () {
      var element = document.createElement('div');
      element.id = 'myDiv';
      document.body.appendChild(element);
  
      it('page has a div element', function() {
          expect(document.getElementById('myDiv')).to.not.equal(undefined);
      });
  });
  ```
* The last step to be done is to create an HTML page which is used as test runner.
  The content should look like following. 
  ```
  <html>
  <head>
      <title>Tests </title>
      <link rel="stylesheet" href="node_modules/mocha/mocha.css" />
  </head>
  <body>
  <div id="mocha"></div>
  <script src="node_modules/mocha/mocha.js"></script>
  <script src="node_modules/chai/chai.js"></script>
  <script>
      mocha.ui('bdd');
      expect = chai.expect;
  </script>
  <script src="test.js"></script>
  <script>
      mocha.run();
  </script>
  </body>
  </html>
  ```
* Now you can run your client side tests using PhantomJS by `phantomjs ./node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js tests.html`

The magic behind this is actually not that complex. The mocha-phantomjs-core Javascript first gets executed
and opens the passed HTML page via `page.open`. It then checks whether a mocha execution has been specified correctly,
evaluates the page with `page.evaluate`, runs the tests with Mocha and reports back to PhantomJS.
If you want to get more details you can dig into the code of mocha-phantomjs-core which is not that long.
One additional word to the reporting function. As second parameter after the TestRunner you can specify which reporter you
want to use and overwrite `spec` which is the default. You can for instance get the test output in Markdown by passing
`markdown` as parameter. Attentive readers probably ask why we need to include a stylesheet called `mocha.css` in this HTML
when we execute the tests on the command line anyway. And, you are right. You do not necessarily need this CSS file here
and even the special `<div id="mocha"` is optional when executing via PhantomJS. However, if you are going to open the HTML
test runner in a browser you will see a pretty overview on passed and failed test if you leave it there. (See the image below)

![Mocha test results visible in browser]({{site.baseurl}}/assets/img/2017-08-18/mocha-phantomjs.png)

## Pre-rendering engine using PhantomJS
Now, that you gained a few insights into the technology yourself, I would like to go back to my origin problem I solved when 
using PhantomJS the first time and share the solution with you. Before outlining the solution a few words about why I needed such a pre-rendering engine.

### Problem description
Client-side rendering frameworks like AngularJS as it was in my case clearly have several advantages, at which I do not 
want to focus on now, but unfortunately also a caveat when it comes to crawlers,
like the Facebook Open Graph API which is not able to execute any Javascript.
As a result if your page changes dynamically, uses Javascript to load data from a server and binds it to HTML you have the problem
that Facebook does not see the rendered page but instead only Angular's injection placeholders. 
A way out of this dilemma is to generate HTML for Facebook on the server-side but if you have a single page application in AngularJS
which you want to deliver the usual way to normal browsers and show a thumbnail image with some information on Facebook,
this is probably not a clean solution. 

### PhantomJS to the rescue
As expected here comes PhantomJS into play. With PhantomJS you can pretend to be a browser,
execute Javascript and then send the rendered page to Facebook. Does not sound that hard and it actually isn't because it is not much more than
a `page.evaluate` as we saw it in one of the previous paragraphs. 
If we consider it in more detail the program consists of following parts

* A NodeJS web server accepting GET requests for any generic URL.
* The npm package `phantomjs-prebuilt`
* For an incoming request a child process executing PhantomJS via `phantomjs-prebuilt` is spawned.
  The incoming URL is passed on to the phantom process.
* The phantom script calls `page.evaluate` to execute the Javascript and writes the whole plain HTML page to stdout.
* A callback in NodeJS is called, checks for the status and returns the HTML on stdout as HTTP response to the initial caller.   
  
You can use this phantom-prerender project also for your own purpose. It is available on <a href="https://github.com/ratzi199/phantom-prerender" title="phantom-prerender" target="_blank">GitHub</a>.
There you can find more detailed instructions on how to use it as your own pre-rendering engine for your project.
Any forks, pull requests and support in general are warmly welcome since the project is on a very early stage.

## Conclusion
I hope you got a good overview on PhantomJS with this article and tried things out a bit.
Although it is not such a rich framework like others in the Javascript world, it can be quite useful
as you saw in the last example with the pre-rendering engine. 
 
