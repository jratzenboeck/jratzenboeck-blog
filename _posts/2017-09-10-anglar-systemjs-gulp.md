---
title: Building an Angular 2+ app with SystemJS and Gulp
category: Web
tags: Javascript, Angular, Gulp, Build, SystemJS
---

Since its release by Google in 2009, AngularJS has quickly grown to one of the most popular open-source Javascript
frameworks and is nowadays the leading framework when it comes to client-side rendered web apps. With version 2, the 
developers decided to implement the project completely new from scratch and as a result the new Angular differs in a lot 
of parts from the old one.
<!--more--> 
As a web developer I have been using AngularJS 1 (I will just call it AngularJS as it is done officially as well) for about 
two years but recently had the chance to start a new project with Angular in its latest version. One of the big differences to AngularJS for me 
was the way how an Angular 2+ app (the latest version is Angular 4 but since Angular 2 only minor changes have been introduced. From now on I will call
it Angular 2+ when I am talking about Angular version 2 and upwards) 
is built and bundled to be ready for productive use. It's not my intention to provide 
a tutorial about developing an Angular 2+ app (there is a very good quick start tour on the 
<a href="https://angular.io/" title="Angular website" target="_blank">official website</a>) but rather want to tell you a bit 
about strategies to bring your Angular 2+ app smoothly, continuously and fast to your users and avoid potential problems 
in the building process like I had it in the beginning. 

## TypeScript and Module structure of Angular 2+
There are two major things which changed in contrast to AngularJS and I want to stress out here since they heavily 
influence how Angular 2+ apps are built. 

1. Typically you develop Angular 2+ apps in TypeScript which is the recommended way since it gives you several 
advantages especially static typing. Thus, the first step you have to do is compiling TypeScript code to JavaScript to make it 
understandable for Browsers. Therefore you need a small configuration file called `tsconfig.json` providing necessary details for the compiler.
Take a look at the <a href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html" title="tsconfig documentation" target="_blank">tsconfig documentation</a>
for details on how you can configure the TypeScript compiling process.
By executing `tsc` or even automatically done by your IDE the compiling process is started and as a result you can admire your resulting JavaScript files.

2. In contrast to the old AngularJS where you basically downloaded the full JavaScript code and included it 
via the `<script>` tag in your `index.html`, an Angular 2+ app relies on ES6 module loading to import different Angular 
modules the developer wants to use in his/her project. These modules are first downloaded by a package manager like `npm`
and can then be imported in your TypeScript code with the ES6 import statement which looks like this:

`import { NgModule } from '@angular/core';`

Depending on the specified target and module loading syntax in your `tsconfig.json` compiler options, you will see those imports
reflected in the resulting JavaScript. 

So far so good but if we again have a look on the import statement from above, the question arises how the Browser should know how to import
this `@angular/core` module and where to find it? Indeed, the Browsers do not know this because they are not able to do ES6 module loading 
and apparently fail to find the library module. Although there is the possibility to manually include the imported modules
via `<script>` tags in the HTML and get things working, this has no practical relevance since you have to care about every 
used module (and you quickly need quite a lot of them) in the project and also ensure the correct order of including them.
This is were so called module loaders come into play.

## Using SystemJS for ES module loading
In this section I want to describe how SystemJS solves the dilemma of loading required ES modules to make it more convenient for the developer.

### Why SystemJS
First of all I have to mention that there are also alternative module loaders like Webpack or RequireJS available. There were two main reasons
why I decided to use SystemJS in the first place. Firstly, due to the impression I got after some research on Google
where it is described as being understandable in a shorter time than Webpack for instance. Although Webpack has been growing in popularity rapidly, it has a steeper learning curve. 
Secondly, I have been using Gulp for quite a while to automate and create an enhanced
building workflow throughout web projects and I preferred to use it for my Angular 2+ project as well. More details on how to use
SystemJS with Gulp in conjunction will follow later on. Webpack on the other hand
is not only an ES module loader but rather a much richer tool and in my opinion a competitor to Gulp. Anyway, it also seems to be
quite interesting to take a look at in the nearer future since more and more web projects start to use it.

### How does SystemJS work
SystemJS basically does the work you would have to do by hand manually, namely searching the specified Angular modules
in our project and importing them in the correct order to make sure that every Angular module which uses code from another module
has it imported correctly. As a developer you then only have to specify the root module in your index.html
file and SystemJS loads everything else for you. The necessary ingredient therefore is a configuration file to tell the 
SystemJS loader where to find all the modules you want to load in your TypeScript code. This is usually the systemjs.config.js file.
Following code snippet shows how its structure looks like.

```
(function (global) {
  System.config({
    paths: {
      'npm:': 'node_modules/'
    },
    map: {
      'app': 'dist/js',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      // other libraries
      'rxjs':                      'npm:rxjs'
    },
    packages: {
      app: {main: 'main.js', defaultExtension: 'js'},
      rxjs: {defaultExtension: 'js'}
    }
  });
})(this);
```
The essential thing you can see is that all modules you want to use are specified with their concrete path in the `node_modules` folder
where they live in the `map` object of this JSON object passed to `System.config(...)`. `'app'` specifies where the root module can be found.
Here you should provide the output folder of your JavaScript files, like `dist/js` in this case.
The packages object finally tells the loader which file to use for bootstrapping the application and the extension to be used
if none is given as it typically is when using the import statement in TypeScript. For those who wonder what the RxJS has to do here. 
Angular 2+ requires RxJS to run although you do not explicitly use it. 

Now that we specified the configuration for SystemJS we have to finally use it. This works by putting following code into the index.html file.

```
 <script src="systemjs.config.js"></script>
 <script>
    System.import('main.js').catch(function(err){ console.error(err); });
 </script>
```

First, the configuration file has to be included to load the configuration from above. Then you can bootstrap the application
by executing the main.js file which bootstraps the Angular application and is then able to load all further used modules correctly
as they were specified in the configuration file.

The described configuration only shows the minimal requirements to get the SystemJS loader up and running, however if you want
to get started more quickly I encourage you to start off with the popular <a href="https://github.com/angular/quickstart/" title="angular-quickstart" target="_blank">angular-quickstart</a>
project which already provides you with a working SystemJS configuration out of the box.
Since this configuration file also includes some other files, I refer to the official documentation for more details.

## Building and shipping with Gulp
Using the described procedure with SystemJS to build your Angular 2+ app gives you a solid starting point for your local
development setup. However, a bunch of HTML and JavaScript files are not much worth unless you have a webserver for instance
to launch your app and try things out quickly. Even more when you are ready to ship your app to customers, you probably want
to have an automatic process which enables fast and convenient delivery of your application. All these requirements make it
necessary to set up a more enhanced workflow for your Angular 2+ app. Due to its flat learning curve, its easy syntax and 
powerful toolbox I like Gulp for such kind of things. The following paragraphs and code snippets should show you how to 
use Gulp tasks to improve local development and testing on the one hand and make your Angular 2+ app ready for productive use on the other hand.

### Setting up Gulp for building web projects
The preferred way to install Gulp is by installing the according package globally as following

`npm install -g gulp`

This enables you to use the `gulp` command in every project where you want to support building with Gulp.
The only thing you then need is a file where you specify how your project has to be built, namely the build pipeline. 
In Gulp this is done by implementing separate tasks and chaining them together to execute them in a row.
Following example illustrates how such a task can look like:

```
gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
});
```
This task takes all HTML files under `src` and copies them to the `dist` folder. In between the gulp source and dest operations
on the matching files can be done before piping them to the destination. 

### Gulp tasks for building Angular 2+ app
With the following paragraphs I want to show you the essential Gulp tasks I implemented for the Angular 2+ project to create a shippable
product. Every required package shown in the code snippets has to be installed via `npm` beforehand.

1. <b>Linting TypeScript</b>
   
   If you want to ensure clean JavaScript code a linting tool is a must-have in my opinion. For TypeScript you can use tslint.
   To include linting in Gulp the task looks like following:
   
   ```
   var tslint = require('gulp-tslint');
   
   gulp.task('lint', function() {
     return gulp.src('src/**/*.ts')
       .pipe(tslint({formatter: 'prose'}))
       .pipe(tslint.report());
   });
   ``` 

2. <b>Compiling TypeScript</b>

    After linting has been done without any errors, following Gulp task compiles TypeScript and
    writes JavaScript to the provided output directory.

    ```
    var tsc = require('gulp-typescript');
    var sourcemaps = require('gulp-sourcemaps');
    var tscConfig = require('./src/tsconfig.json');
    
    gulp.task('compile', ['lint'], function() {
      return gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsc(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'));
    });
    ```
    
3. <b>Build Angular app by loading ES modules</b>

    The essential and for me initially the most tricky part was including SystemJS
    module loader into Gulp. Luckily there is a SystemJS builder for Gulp, which you provide
    the location of the config file as described in the second section of the post. The buildStatic method then gets the
    location of the compiled main.js file created by the compile task before and the desired output filename after loading
    all required modules. The output is again a Gulp stream which can be further processed. In this simplified example the 
    generated app.js file gets copied to the destination directory. For production usage you can insert a minification step
    in between if you want to deliver the smallest possible file size where your JavaScript code resides in.

    ```
    var systemjsBuilder = require('gulp-systemjs-builder');
    
    gulp.task('bundle:app', function() {
          var builder = systemjsBuilder();
          builder.loadConfigSync('src/systemjs.config.js');
        
          builder.buildStatic('dist/js/main.js', 'app.min.js', {})
            .pipe(gulp.dest('dist/js'));
        });
    ```
    
4. <b>Bundle vendor JavaScript</b>

   Angular 2+ needs some other JavaScript libraries to work as expected. Moreover, you probably want to use some other 
   libraries like jquery as well. Instead of including them separately a Gulp task to bundle them is better.
   
   ```
   var vendorJS = [
         'node_modules/core-js/client/shim.min.js',
         'node_modules/zone.js/dist/zone.js',
         'node_modules/systemjs/dist/system.src.js',
         'node_modules/jquery/dist/jquery.js',
   ];
   
   var concat = require('gulp-concat');
   
   gulp.task('vendor-js', function() {
     return gulp.src(vendorJS)
       .pipe(concat('vendor.js'))
       .pipe(gulp.dest('dist/js'))
   });   
   ```
   
5. <b>Copy HTML, CSS, Images, etc. to destination folder</b>

   All of your other assets you need have to be copied from the according source to your destination as well.
   You can create separate Gulp tasks for them.
   
6. <b>Start a webserver</b>

   To test your Angular 2+ app in your Browser, there is also a package providing a lite web server.
   The according Gulp task looks like following.
   
   ```
   var webserver = require('gulp-webserver');
   
   gulp.task('webserver', function() {
     gulp.src('dist')
       .pipe(webserver({
         livereload: true,
         host: "0.0.0.0",
       }));
   });
   ```   
   
7. <b>Chain tasks together</b>

   Finally you can create the full build pipeline by chaining your tasks together and either execute them in sequence or
   in parallel. The nature of execution of course depends on the given tasks itself. An example how such a pipeline
   can look like:
   
   ```
   gulp.task('build', sequence('compile', 'bundle:app', ['css', 'html', 'img', 'data']));
   gulp.task('run', sequence('build', 'webserver'));
   gulp.task('default', ['run']);
   ```
   By just typing `gulp run` on the command line then executes your build as you specified it.
   
You can extend your build pipeline as you desire and automate as much as possible to make publishing to a real webserver
possible by just executing one command or clicking a button on a respective build server like Jenkins.

## Conclusion
I hope you learned more about the building process and module loading nature of an Angular 2+ app after reading this post and got you so far to be able to put it into 
practice more easily. If you are an AngularJS developer I encourage you to definitely try Angular 2+ since it is the next big deal. 
If you have not yet known Gulp, I hope that I could show you its power and convinced you with its simplicity.
Even if you do not use it in conjunction with an Angular app it's still very useful for any kind of web project if you
like continuous integration and fast delivery of software.  
        
    
      
    
    
    
    
   

 




 




