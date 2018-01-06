---
title: Exiting the callback hell in JavaScript
category: Web
tags: JavaScript, Callbacks, Async
---

Asynchronous execution of actions is a common concept in nowadays web applications. Especially the JavaScript world makes
heavy use of it. 
<!--more-->
Good examples are client-side rendered web apps doing HTTP requests to a backend API or the event looping
mechanism of NodeJS which ensures non-blocking asynchronous operations. 
Although this asynchronous way of doing things in JavaScript is very powerful, it quickly compromises the quality of your code if not handled appropriately. Different ways 
have been proposed over the last few years, whereby the latest change has been introduced in the new ECMAScript standard (ES2017).
With this blog post I want to give you a quick tour through different techniques to tackle the asynchronous JS challenge.

## The root of all evil
Basically asynchronous execution is handled with callbacks. This means that the affected function gets executed and while
the async operation, which usually takes a bit longer to complete, is running, the program does not have to wait for the operation to finish.
Hence, it is not blocked and can do other things meanwhile. When the async function has finished, a callback function gets
executed which retrieves the result or an error if something failed. In JavaScript code this simply looks like the following.

```
getJSON(filename, function(jsonDocument) {
    // Do something with jsonDocument
}
```         

This looks quite trivial, right? You probably have seen this a lot of times. However, especially when working with NodeJS
you will have dozens of such asynchronous functions and callbacks spread all over your codebase. It starts that
results of async functions are needed by other async functions and so on. You probably imagine that this can grow dramatically
and distort your code. Following (still very trivial) example shows what is referred as callback hell.

```
function callbackHell(number, cb) {
	setTimeout(function() {
		if (isNaN(number)) {
			return cb(number + 'is not a number');
		}
		return cb(null, number * 2);
	}, 500);
}

callbackHell(1, function(err, result) {
	if (!!err) {
		return console.log(err);
	}
	callbackHell(result, function(err, result) {
		if (!!err) {
			return console.log(err);
		}
		callbackHell(result, function(err, result) {
			if (!!err) {
				return console.lgo(err);
			}
			console.log('Result: ' + result);
		});
	});
});

console.log('Calculating...');
```

If you can observe that your code grows more and more to the right and the number of anonymous functions increases, 
your should take action, the sooner the better. Otherwise you are approaching the callback hell with big steps. There are
easy ways to make this more readable. You can give your callback functions good names, move them out to the
top level and extract the error handling to get DRY. However, experience showed me that naming lots of callback functions 
for instance is still tedious and not optimal. So, there have to be better ways. 

## async
One of the most popular async utility libraries for NodeJS and the browser is <a href="https://caolan.github.io/async/" title="async" target="_blank">async</a>.
As mentioned on their website, they provide about 70 functions allowing to optimize asynchronous JavaScript. All functions
follow the best practice NodeJS style of callbacks with error as first argument. The callback hell example shown previously
can be solved much more elegantly with `async.waterfall([...])` which automatically passed results of a callback on to the 
next function. Furthermore, error handling has to be done only once at the end. If any error occurs during the flow of async operations,
the error argument is passed to the final callback. The full example is shown below. From now on I will also use some of the new 
features from ES6 which make the code more concise. I especially want to get used to the new style of writing anonymous 
functions with `=>`. 

```
function calculate(number, cb) {
	setTimeout(() => {
		if (isNaN(number)) {
			return cb(`${number} is not a number`);
		}
		return cb(null, number * 2);
	}, 500);
}

async.waterfall([
	async.apply(calculate, 1),
	calculate,
	calculate
], (err, result) => {
	if (!!err) {
		console.log(err);
	} else {
		console.log(result);
	}
});
```

You have to admit that the code now looks much better and is easier to read. The waterfall construct automatically knows 
which arguments are required and passes the intermediate result automatically to the next `calculate` function. To me this
is much easier to read as nesting the callbacks.

## Promises
A different concept of handling asynchronous operations are Promises. Instead of providing a callback as extra argument to
functions and calling this function when having finished the operation, it returns a Promise object. A Promise indicates, as the name
implies, something available in the future. A Promise can either be resolved or rejected. It is called pending if it is neither resolved nor rejected 
and settled otherwise. The concept was introduced by open source libraries like 
<a href="https://github.com/kriskowal/q" target="_blank" title="Q Promise library">Q</a>. Due to the reason that they have
been heavily used, since ES6 Promises are natively supported. Following code snippet shows how our example looks like with
a Promise. 

```
function calculate(number) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (isNaN(number)) {
				reject(`${number} is not a number`);
			}
			resolve(number * 2);
		}, 500);
	});
}

calculate(1)
	.then((result) => { return calculate(result); })
	.then((result) => { return calculate(result); })
	.then((result) => { 
		console.log(`Result: ${result}`);
	})
	.catch((err) => { console.log(err); });
```

As you can see `calculate` now returns a Promise object which contains a function with two arguments which let resolve or 
reject the promise. Promises can be awaited with the `.then(...)`. The cool thing is that, because the functions return a Promise,
they can be chained on the top level. A rejected promise is handled by `.catch(...)`. There are some further opportunities
like running async functions in parallel and handling the results after all have settled. I don't want to look at that in detail here but
if you are interested take a look at <a href="https://developers.google.com/web/fundamentals/primers/promises" target="_blank" title="Promises - Reference">this documentation</a>.

### async - await
The latest kid on the block is the async - await concept introduced with the release of the ECMAScript Standard 2017 (ES0217).
This construct relies on the technique of promises but allows to write handling of promise results in a synchronous way.
It uses the advantages of promises and extends it with a more natural handling as we are used to when programming in a synchronous
manner. A function tagged with the `async` keyword resolves a Promise if it returns a value resp. rejects the Promise 
when throwing an error. Instead of `.then(...)` chains, you can await resolution of a promise with the `await` keyword.
The `calculate` function returning a Promise can stay the same as before. The handling of the promise is shown in following
code snippet.

```
(async () => {
	try {
		var result = await calculate(await calculate(await calculate(1)));
		console.log(`Result: ${result}`);
	} catch (e) {
		console.error(e.message);
	}
})();
```

Since we have to tag a function with `async` to use this concept, I used a so called IIFE (Immediately Invoked Function Expression),
which in essence is a defined function executed immediately. As you can see I used `await` to wait for the resolution of 
the Promise in `calculate`. Since the intermediate results are only used to be passed forward to the next call of `calculate`
you can nest the calls. What I also like is that you can use the typical `try { .. } catch (e) { ... }` construct to handle
potential promise rejections. 

## Conclusion
I hope I could give you a good overview on different techniques to handle asynchronous function execution in JavaScript. 
It's hard to say whether callbacks or promises should be preferred. This mainly depends on the taste of the programmer.
What you should definitely avoid, is nesting of anonymous callback functions since this makes the code ugly and more difficult
to maintain it in the future. If you want to use the callback style I highly recommend to take a look onto the introduced
async library. Since promises are even natively supported since about two years and ES2017 builds upon them with async-await,
they have definitely a great future.

References:

<a href="https://www.pluralsight.com/guides/front-end-javascript/introduction-to-asynchronous-javascript" target="_blank" title="Reference1">
https://www.pluralsight.com/guides/front-end-javascript/introduction-to-asynchronous-javascript</a> <br>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function" target="_blank" title="Reference2">
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function</a>

