---
title: Hosting a Jekyll powered website without any burden
category: DevOps
tags: Blog, Hosting, GitHub, Cloudflare
---

In the previous blog post I introduced the static site generator Jekyll in a nutshell to you and showed you how to get
started with it very fast. If you are not familiar with Jekyll and have not yet read that post, I encourage you to do so. 
<!--more-->
You will not regret it, I promise. I hope you are ready now to come along with me on the journey to launch our brand-new website
and make it available to the world outside of our four walls.

In the following few paragraphs I want to show you the steps I did for my personal blog to bring it from my local development
environment to the Internet. Before I started working on hosting my website, I summarized my primary goals I wanted to achieve
for my publicly available website, namely the following:

* <b>Easy and convenient updating</b>

  It has high priority for me to publish any updates to my website, no matter whether these are my regular blog posts or any
  fixes and improvements, as quickly and smoothly as possible. Especially in nowadays DevOps movement it should not
  be the case to ssh into a server and manually copy files using scp or anything similar to that.

* <b>Custom domain</b>

* <b>Cheap</b>

  Since the website is just a personal blog I do not want to invest much money for hosting.

* <b>Good web performance</b>

  My aim was to see the green color when analyzing the website with 
  <a href="https://developers.google.com/speed/pagespeed/" title="Google Pagespeed" target="_blank">Google Pagespeed</a>.
  Therefore it is necessary to be able to adjust caching behavior for the assets.

* <b>Fast and convenient configuration of infrastructure</b>

  Configuring web server infrastructure should be doable with low effort.

* <b>HTTPS</b>

  Since HTTPS is essential for website visitors and is also honored in ranking algorithms of search engines like Google,
  I set it on my goal list as well. Although it is not a definite requirement for this rather small personal website where
  users do not enter any confident information, there are services where you can get a free certificate and thus it
  makes sense to me to pay attention to this.

As the goals are set now, let's start with the practical hosting tour. When I scanned through the documentation on the
<a href="https://jekyllrb.com" title="Jekyll Website" target="_blank">Jekyll website</a>, I saw the hint that GitHub uses 
this technology on their provided hosting opportunity called GitHub Pages and this appeared to me as a promising option.

## Hosting on GitHub Pages
I assume you have a valid GitHub account which you can use to place your Jekyll powered site into a git repository.
I will skip the steps to create a git repository on GitHub and commit your code there since this is out of scope of this post.
The necessary git commands are mentioned on GitHub after you created the repository anyway.
Hint: Add a .gitignore file to your project to exclude files and folders which should not go into the repository.
My .gitignore file has the following content.

```
# Created by .ignore support plugin (hsz.mobi)
### Jekyll template
_site/
.sass-cache/
.jekyll-metadata

### IntelliJ Project files
.idea/
*.iml
```

In IntelliJ for instance you can select Jekyll as framework and it creates
a .gitignore file which is pre-filled automatically with the right content to exclude. 

Now the only thing you have to do to publish your website to GitHub Pages is to first go to the overview page of your project
on GitHub and then click the Settings tab on the right hand side of the top bar. If you scroll down a bit you will find
a section called GitHub Pages as illustrated in the figure below.

![GitHub Pages settings]({{site.baseurl}}/assets/img/2017-08-08/ghpages.png)

Just select a branch like `master` and save. After saving you can inspect your website already
under the provided domain `https://<repository-name>.github.io`.

This was quite easy, wasn't it. If you now change something in your code and commit and push to the branch you selected
as source for GitHub Pages, the Jekyll engine gets started at GitHub and automatically re-builds your site using the
`jekyll build` command.  One more important thing which should be especially considered for Jekyll is the special `gh-pages` branch. 
If you use a conditional statement to check whether the Jekyll environment is production, like
I showed it in a code example in my previous blog post, you should use such a branch in your project as the mainline branch. 
If you do so, GitHub Pages will build your site automatically with the environment set to `production` which is quite convenient. 

Now, after pushing to the origin of your selected branch in GitHub, you can see your reflected changes a few seconds later on live. Awesome. 
We have hosted our website by just creating a git repository, checking in our code and without configuring anything. Moreover as you may
have noticed it is served via HTTPS and without any costs.
However, if you want to have your own customer domain read on.

## Use your custom domain with GitHub Pages
After your have bought your favorite domain you can start now to link it to the hosted website on GitHub Pages. First of
all you have to decide whether you want to serve it via an Apex domain, a CNAME or both. In my case I wanted to make the site
accessible over the root domain as well as over the www subdomain.

### Add custom domain to GitHub Pages site
The first step after you have purchased your domain is to add the domain to the GitHub Pages settings. Therefore just enter
your domain in the text box "Custom domain" in the presented GitHub pages section and save it. This adds a new file CNAME
to your project which indicates that your site should be served via this domain.

### Setup Apex domain at your DNS provider
To setup your Apex domain you have to use the provided web interface of your DNS provider. Usually you can manually create
a new DNS record with type A. This requires you to point that record to IP address(es) which in case of GitHub Pages are
`192.30.252.153` and `192.30.252.154`. Read more details <a href="https://help.github.com/articles/setting-up-an-apex-domain/" title="GitHub Pages Apex Domain" target="_blank">here</a>.
The nasty part now is that you usually have to wait some hours (up to a day) until your DNS changes
are reflected and your site gets accessible via your root domain. On Unix systems you can use `dig <your-domain> +noall +answer`
to check if your changes have already gone through.

### Setup www subdomain
Since it is not much more effort, I (and also GitHub) recommend to set up a www subdomain as well.
To do this you have to add another DNS record at your DNS provider, namely a CNAME. A CNAME does not point
to one or more IP addresses but rather to a domain name which especially has the advantage of fault tolerance.
In contrast to an A-record a change of the pointed IP address does not cause a downtime. Moreover
your website will be reachable via `www.<your-domain>.<tld>` which is how most Internet users will access it.
As it is with A-records you have to consider a similar waiting time until your changes are live. Again you can use dig to
check this. 

If you have followed this guide, your Jekyll website should be hosted on GitHub Pages and accessible via a custom domain successfully.
So far so good, most of the goals seem to be already reached but as you probably have noticed the HTTPS we had earlier with the
freely provided github.io url is gone. Moreover a analysis by <a href="https://developers.google.com/speed/pagespeed/" title="Google Pagespeed" target="_blank">Google's Pagespeed</a>
will most probably show some room for improvement when it comes to caching. So, let's fix this.

## Use Cloudflare CDN to leverage caching and get free TLS
You hopefully agree with me that hosting a Jekyll site on GitHub is very easy and convenient.
No manual configuration of a web server and any system administration is necessary. I think I did not promise too much.
But there is nearly no advantage without a drawback and so it is the same here. Since GitHub manages everything for you
when it comes to hosting, you have no opportunities to set any Cache headers or place a SSL certificate anywhere.
Below the textbox where you entered your custom domain GitHub also lets you know that HTTPS cannot be enabled for a custom domain.
So, what to do now? Luckily, I quickly found a solution for this by placing a CDN in front of the GitHub Pages infrastructure.
<a href="https://cloudflare.com" title="Cloudflare CDN" target="_blank">Cloudflare CDN</a> seems to be a good choice here since it first of all also provides a
free plan which allows to customize caching behavior, 3 free page rules where you can setup for instance redirects and
also offers a solution for the SSL challenge.

![Cloudflare Landing Page]({{site.baseurl}}/assets/img/2017-08-08/cloudflareLanding.png)
### Use Cloudflare nameservers for your domain
After you have created your free Cloudflare account you can start to use it for your brand-new custom domain by following
a few wizard steps. First of all you have to start scanning for your domain by entering your domain as indicated in the image below.
![Cloudflare Domain Scanning]({{site.baseurl}}/assets/img/2017-08-08/cloudflareScanning.png)
The scanning process takes a few minutes before you are provided with an overview on the existing
DNS records and nameservers. It already gives you the hint that you have to change the nameservers to use
the mentioned Cloudflare nameservers. Therefore you have to lookup the nameserver configuration at the web interface
of your DNS provider. In addition you can add or modify DNS record entries and decide which ones
should go through Cloudflare.

![Cloudflare DNS records]({{site.baseurl}}/assets/img/2017-08-08/cloudflareDnsRecords.png)
![Cloudflare Nameservers]({{site.baseurl}}/assets/img/2017-08-08/cloudflareNameservers.png)
This is basically the essential configuration step here. You can leave any other setting presented to you in the wizard
as it is for now. We will adjust the (to me) important ones afterwards. As expected, nameserver changes may take a longer
time again to actually take effect.

### Enable SSL
Serving your website via SSL is only setting the encryption to "Full" under the "Crypto" tab.
As it says in the description it can take up to 24 hours to provide you with a new certificate.
In case of SSL some strange behavior can occur with Cloudflare. At least in my case it happened that I could already
access my website via https a few hours after the change but the next request again showed me the following error.

![Cloudflare SSL Site is not secure]({{site.baseurl}}/assets/img/2017-08-08/cloudflareConnectionNotPrivate.png)

From this point on it sporadically worked and due to that reason I contacted the Cloudflare support on the next day.
They responded a few hours later and told me that it took a while to provide the active certificate but everything should be working
fine now. Indeed, from this point on HTTPs worked like a charm. The strange thing was that I evaluated the website with
the free SSL verification service of <a href="https://startssl.com" title="StartSSL" target="_blank">StartSSL</a> hours before 
and it gave me a positive result. Accessing with Chrome and Safari nonetheless did not work as expected. 
Whatever really happened on Cloudflare's side after I contacted them, it at least worked.
So, don't panic if takes really long until SSL is working.

![SSL Labs Verification]({{site.baseurl}}/assets/img/2017-08-08/ssllabs.png)

Since you probably do not want to allow any plain HTTP requests anymore, you have to get your requests only use HTTPS.

To solve this there are basically two options:

* Add a page rule to redirect all HTTP traffic to HTTPS: In the free plan you can add up to three rules under tab "Page Rules".
  Add a rule for http://<your-domain>.com/* and set it to "Always use HTTPS".

  ![Cloudflare Page Rules]({{site.baseurl}}/assets/img/2017-08-08/cloudflarePageRule.png)

* Enable HSTS (HTTP Strict Transport Security): This is the latest mechanism to force HTTPS requests. The server adds to the
  HTTP response an additional header which tells the browser that only HTTP connections via TLS are allowed in the future. Moreover
  a timestamp in seconds indicates for how long only secure connections to this resource will be established.
  HSTS is recommended since you can save the time of an additional request and your are not vulnerable to downgrade attacks.
  <b>However, it is really important to consider that before enabling HSTS you have to ensure that you have a valid SSL certificate and plan
  to serve your site only via HTTPS in the future since the browser sticks to HTTPS for as long as max-age is set!</b>

  ![Cloudflare HSTS]({{site.baseurl}}/assets/img/2017-08-08/cloudflareHSTS.png)

### Caching
GitHub Pages automatically sets the caching time for assets to 2 hours which is too short to be honored by Google Pagespeed.
With CloudFlare you can adjust browser caching as you want to. These settings can be found under the caching tab.
This helps you to make your page load faster if a website visitor comes back and loads the site a second time.

## Conclusion
I hope you enjoyed reading this blog post and I somehow convinced you that GitHub Pages is an easy and cheap solution
to get a Jekyll website public. In my opinion it is especially well suited for small web projects, like a personal blog,
where you don't want to invest much money and bring your updates live very quickly. There is no doubt that GitHub Pages
has its drawbacks as well and the limited configurability can introduce obstacles very soon if you need more customization but
as with any software technology it mostly depends on the particular use case.
In the second part, I introduced Cloudflare CDN which is a good choice to make your page load faster and be more secure.
It can be easily used in conjunction with GitHub Pages as you have seen in the previous paragraphs. If you did some hands-on
work next to reading this post, you have the possibility to look into the configuration options of Cloudflare in more detail.
You will probably find some other useful settings you want to take an eye on.

As always, if you have an questions or comments, don't be shy and just use the commenting function below.







