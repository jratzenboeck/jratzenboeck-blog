---
title: Getting started with stylelint
category: Web
tags: css, styles, linting
---

When working with languages like JavaScript or CSS many bad things can happen in your code which are probably not
that obvious. Sometimes there is not even a clear error or exception and bugs then often stay hidden.

<!--more-->

What has been established as a de-facto helper to prevent a lot of these errors is called a linter.
Linters have become quite popular especially with the, let me call it advent of a "JavaScript everywhere" movement in web development.
However, it's not only JavaScript code which can highly benefit from Linters (like ESLint or JSHint) but they also have their
right in the world of CSS. In this blog post I want to briefly introduce you <a href="https://stylelint.io/" target="_blank">stylelint</a>
which should help to keep your CSS bug-free and maintainable.

## Why should I lint my CSS
A valid question which I want to quickly answer with a small example to illustrate why it actually makes sense.

```
a {
    display: inline;
    color: #fff;
    text-decoration: none;
    width: 100px;
}
``` 

This seems like valid CSS which styles an `a` element. But wait a second.. Something's wrong here. 
Can you spot the problem? Inline elements cannot have a width so this property gets ignored and is therefore redundant
in our CSS. When reading such style definitions
it's common to oversee mistakes like this one. Although it's not the only reason why linting CSS is of great help, I hope
the example illustrates why a linter is preferred here.

## Setting up stylelint
As software developers we are used to setting up and configuring a lot of things in our project nowadays before we can
actually start building the thing we want to build. The bad news is that we have to do some configuration to make stylelint
work as well but the good news is that the actual linting setup is done within minutes. Install the npm package as dev dependency 
via `npm install stylelint --save-dev`. Analogically to ESLint for JavaScript linting you need 
one config file named `.stylelintrc` in your project folder. This is where all your linting rules go.  
 
## Getting started quickly
Since there is no rule at all in the beginning the linting apparently does not have any effect. 
The list of available rules can be found <a href="https://stylelint.io/user-guide/rules/" target="_blank">here</a>. What the hell! There
are a lot of rules you can define. We definitely do not have the time to go through all these rules and fill in our config
file from scratch. Luckily, there are other people who have already created linting setups which make sense and enforce
conventions widely supported in the community. We can grab one of those configurations easily and include it by just adding something like:
```
{
    "extends": "stylelint-config-standard"
}
```  
The `stylelint-config-standard` as well as the `stylelint-config-recommended` are good starting points whereby
the first one defines a lot more rules and is much stricter as the latter one. Make sure that you have installed those base
configuration via `npm` beforehand. 

## Build upon an existing configuration
To add additional rules to fit your personal or team-wide code style and taste, simply add a JSON object with specific rules to your config file.
This can then look like following.
```
{
    "extends": "stylelint-config-standard",
    "rules": {
        "unit-whitelist": ["em", "px", "%"]
    }
}
```  
I guess the additional rule defined in the example is self explaining as most of the rules I have read through so fare do.

In order to execute the linting according to your defined rule set simply execute `stylelint <path/to/css/*.css>`. If you 
have not installed stylelint globally find the executable in the `node_modules` folder.
Tip: There is the `--fix` option which automatically fixes mistakes that can be solved by stylelint without intervention of the developer.

## Extending with plugins
In addition to the base configurations you can extend, stylelint offers a set of plugins which can be installed and included
in your config. A list of plugins can be found <a href="https://github.com/stylelint/stylelint/blob/master/docs/user-guide/plugins.md" target="_blank">here</a>.
If you want your linter to prevent ignored CSS properties like I showed in the initial example, you can use such a 
<a href="https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties" target="_blank">plugin</a>. 
After installing it via `npm install stylelint-declaration-block-no-ignored-properties --save-dev` it can has to be included
in the `.stylelintrc` as following (see: <a href="https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties" target="_blank">https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties</a>).

```
{
  "plugins": [
    "stylelint-declaration-block-no-ignored-properties"
  ],
  "rules": {
    "plugin/declaration-block-no-ignored-properties": true,
  }
}
```

The only thing this plugin allows is to turn it on or off. Other plugins are more customizable as you will see when using them. 

## Conclusion
I hope I could give you a short but informative overview on stylelint and why it makes sense to lint CSS.
Although it does not seem that important at first glance to lint CSS, stylelint can help you to prevent mistakes, typos and logical errors in CSS.
Moreover it helps you to enforce certain coding conventions for your CSS and helps you keeping your codebase maintainable
throughout the life of a project. A final note if you wonder whether stylelint works with CSS preprocessors. Yes it does, 
but it is recommended to use additional plugins like <a href="https://github.com/kristerkari/stylelint-scss" target="_blank">stylelint-scss</a> 
for SCSS which have more specific rules than the built-in functionality. 
