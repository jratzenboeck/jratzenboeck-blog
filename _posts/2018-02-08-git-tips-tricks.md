---
title: Neat Git aliases for more efficiency 
category: Tools
tags: Git, aliases
---

Git is the most popular version control system currently. As a software developer in a team, no matter whether you work on websites,
backend services, mobile apps or any other piece of software, your probably use it every day. 
<!--more-->
Typing git commands on a CLI
is an every day habit, some developers do not even think about anymore because it's done so automatic. However, for such a 
frequent activity even small improvements can save you quite an amount of time in total and can make the usage smoother.
I want to show you how git aliases can be used to improve your work. Based on what I learned from colleagues and my own
experience I created a list of useful aliases I will share here.

## How to create git aliases
Git aliases allow us to define abbreviations for commands we often use. Actually this is as easy as saying

`git config --global alias.st status`

After executing this command we can say `git st` and the `status` command gets executed. Neat trick but does not impress you yet?
I can understand that 4 characters less do not make an extreme difference here. However, where it got really interesting for me, was
the first time I saw a colleague typing `git sps` on his command line. 
It's actually an alias for the following commonly used command combination.

```
git stash
git pull
git stash pop
```


Every time I want to pull the latest changes I can use `git sps`. I do not have to care anymore whether I have any unstaged changes before pulling.
This is where git aliases make working on the command line more efficient.

By the way, all aliases you define are automatically added to the `.gitconfig` file in your home directory.

## My current git alias list
You can now define any git alias you think will be useful for you. Based on my experience, working style and input from work colleagues,
I created a list of aliases which I want to share with you here. The snippet below shows the according extract of my .gitconfig file.

```
[alias]
	us = reset HEAD --
	last = log -1 HEAD
	co = checkout
	br = branch
	ci = commit
	st = status
	sps = !git stash && git pull && git stash pop
	sp = stash pop
	sl = stash list
	sc = stash clear
	please = push --force-with-lease
	sd = stash drop
```

No matter, whether you use it as a starting point or not, I definitely recommend
using aliases if you happen to use git on a daily basis. Feel free to extend the list and tailor it to your needs.
If you have other cool ideas regarding git aliases, I would appreciate any comment you leave at the end of this post. 




   