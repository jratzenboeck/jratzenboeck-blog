---
title: First steps with Ember.js
category: JavaScript
tags: Web, JS, JavaScript
---

Recently, I used some time to take a look into ember which is one of the popular JavaScript frameworks out there.
The creators of Ember.js describe it as a framework for creating ambitious web applications.

<!--more-->

According to their official website, companies like Netflix
or LinkedIn are using Ember.js. Moreover, the project has accumulated about 19k stars on GitHub which emphasizes its popularity
and large community.

Following my personal learning plan, I created a simple Ember application using the basic concepts of the framework. In this blog
post I want to summarize my experiences and thoughts and share them with you in a short "Getting started" blog post.

## Installation and project setup

Thanks to `npm` the installation and setup procedure to get started with a new ember project is basically just two commands away and takes about
five minutes. Very similar to other popular frameworks like Angular, Ember provides a cli to streamline the development process.
To install this cli just install the package as following.

`npm install -g ember-cli`

After the installation has finished setup a new ember project via the command below.

`ember new my-ember-project`

To start the development server a simple `ember serve` command is necessary and your browser will prompt you with a
nice and funny ember welcome page when requesting `http://localhost:4200`.
You can also use the cli for all ember artifacts like this:

`ember generate <artifact> <name>`

So far so good, but now it's time to take a look on the core structure and concepts of ember.

## When an HTTP request dives into the ember universum

When the ember server sees an HTTP request coming in, the first step is to delegate it to the router. This guy
is responsible for matching the requested URL with one of the routes specified. The example below shows the router from
my sample project.

```
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('meal', {path: '/meal/:meal_id'});
  this.route('add-meal');
});

export default Router;
```

Well, you might ask now how the request will be handled and where we specify the actions we take after deciding on a route to choose.
This is were the route handler, which is associated with the matched route, comes into play. The typical two tasks of this route
handler are loading data for the web application and rendering a template. Let's have a more detailed look on these two tasks.

## Loading data

Usually in web applications we have the requirement to show some data on an HTML page which is typically not static but instead
depends on some data sources. A common scenario is to show personalized data for a user who is logged in. For managing this data,
ember introduces the concept of models. A model defines which data is available to the application and how it is structured.
Following you can see the simplistic model of a meal with just a name.

```
import EmberObject from '@ember/object';

const Meal = EmberObject.extend({
    name: null
});

let meal = Meal.create({name: 'Pancakes'});
```

You are probably not familiar with some of the parts shown in this code snippet if you think in "normal" JavaScript terms.
ember uses its own object model instead of standard JavaScript objects.
Since ES6 there are many similarities as for instance classes became part of the JavaScript standard.
However, the most important difference is that ember objects are observable which is required for the data binding mechanism.
That's why you will mainly work with ember objects in an ember app.
There are many more advancements in ember objects but this is not within the scope of this introductory blog post.

With `.extend({...})` you can define a new ember class and with `.create({...})` you can create a new instance and set
certain values for fields. We now have defined and instantiated our first ember object. So, now we are ready to feed
our route handler with this data.

Therefore ember provides so called lifecycle hooks which are fired as the name implies in certain situations during
the lifetime of an ember app. One of those is the model hook which is used by the route handler to make data available
for the template.

```
export default Route.extend({
  model() {
    return [Meal.create({name: 'Wiener Schnitzel'}), Meal.create({name: 'Scrambled seggs'})]';
  }
});
```

Now we have reached the point where this "Wiener Schnitzel" and the scrambled eggs can be rendered on a web page accessible to our website visitor.

## Rendering a template

The second responsibility of a route handler is to render a template for the URL requested. Ember uses the template engine
<a href="https://handlebarsjs.com/" target="_blank" title="Handlebars official website">Handlebars</a> to finally generate an HTML page.
With Handlebars we can access our published meals like this:

```
<ul>
    {{ "{{#each model as |meal|"}}}}
        <li>{{meal.name}}</li>
    {{ "{{/each"}}}}
</ul>
```

As a result this prints our meals in a nice bullet point list.

## Responding to actions

A typical use case scenario of a web app is reacting to user behavior. Let's have a look what it needs in ember to do this.
Besides the model hook, ember implicitly creates a controller at runtime for a route to be handled. This implicit controller
does not have any functionality but it can be extended just like any other ember object. A controller is responsible
for managing the behavior and customization of page and must have the same name as the route handler.
As an example adding a new meal can look like this:

```
{{ "{{input id='meal-name' type='text' value=meal.name"}}}}
<button type='submit' {{ "{{action 'addMeal'"}}}}>Save</button>
```

```
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    addMeal() {
        let meal = this.get('meal');
        this.get('model').pushObject(meal);
    }
```

The first part introduces an input element via the ember input helper to make it aware of two-way data binding and a
button with the ember action helper to react to a click. The identifier within the quotes specifies the name of the action
defined in the `actions` hash of the associated controller. Using the `get(...)` method of `Ember.Object` we can retrieve
the input values. Since every controller has access to the data stored in the model hook we can get it there and add the
new meal object. Notice here again that both, the model and the meal are ember objects. `pushObject(...)` is the ember equivalent
of the typical JS `push(...)` method applicable on an array.

## Conclusion
Well, this was a simple overview on most of the basic core concepts of an ember application. We have learned how easy it is
to get started with a new ember application using ember cli. Furthermore, we have covered the ember way of handling an incoming
request via the route handler, defining ember objects to represent data and rendering this data with Handlebars templates.
Finally, I talked about the role of controllers and how to use it in order to handle user behavior (eg inputs and button clicks).
Personally, my first impression was quite good as the setup works smoothly, the documentation is good and the core concepts are quite easy to understand
(especially if you happen to have some knowledge with Angular or ReactJS). However, working with ember objects turned out to be a bit uncomfortable
when you are just starting since you are used to normal JavaScript objects and their habits. This probably takes some time until to get used to it.

Please note that this post only gave a very high-level view on ember and should encourage you to try more things out as you go.
Moreover, I excepted the concept of components in ember in this post on purpose since it is huge and it therefore would be worth
to dedicate a full blog post for it.

References: <a href="https://guides.emberjs.com/" target="_blank">Ember.js official documentation</a>










