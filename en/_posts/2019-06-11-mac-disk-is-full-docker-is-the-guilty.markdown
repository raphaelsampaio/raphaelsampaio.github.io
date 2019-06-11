---
layout: post
title:  "Mac disk is full: Docker is guilty"
summary: "My MacBook Pro could not perform a system update of 12 GiB because of lack of space in the system. Turns out Docker for Mac was the culprit."
author: Raphael Sampaio
date:   2019-06-11 18:00:00 -0300
categories: tech
lang: en
---

# A disk space problem

MacOS has recently notified me that a system update would not be performed because I did not have 12 GiB of free space in my disk. That was true, I actually had 7.

I know that with a 120 GiB SSD I'm definitely not a large landowner of disk space. The thing is I only use my MacBook Pro for work purposes. No pictures, no movies, no music (only Spotify) and no games. 

Since I'm a programmer working at a company that uses machine learning for fraud prevention and therefore works with very big files, I suspected a database dump or large CSV was the one causing the issue.

Turns out that was not the case. The size of the folder where I store work stuff is a modest 3 GiB, much less than what I was expecting.

Maybe I did accidentally put something really big on Dropbox on another device and it was synced to my MacBook Pro. Nope, that was not the case.

Out of ideas, I went to "About This Mac" (click on the Apple icon on the left side of the OS toolbar) and then go to the "Storage" tab. 

There was nothing there that really stood out, except for the reported **System** size: a whopping 87 GiB. Wat?

<img alt='docker settings' class='center' class="center" src="https://s3-us-west-2.amazonaws.com/raphaelsampaio.com/wat.jpg">

I opened up iTerm, went to the OS root and ordered folders by size:

```bash
sudo du -sh * | sort -hr
```

What this comand does is display folder sizes (**du**) in a human readable (`h` flag) format (e.g 24K, 15M) and sort the result from smaller to bigger based on that human readable output (**sort** command's `h` flag). Since what I wanted was to see the largest ones, I reversed the order using the **sort** command's `r` flag.

The `/Users` folder was the largest one. So I went into it and typed the same command.

After repeating the step above for each of the largest folders, I ended up at ```/Users/rsampaio/Library/Containers/com.docker.docker```. That folder size was more than 50 GiB.

# How to reduce disk space dedicated to Docker?

Good news: I found the culprit. 

Bad news: I didn't know how to reduce the space dedicated to Docker. Cleaning containers and images did not really help.

Luckily, Docker has an outstanding documentation and I found the answer to my problem [there](https://docs.docker.com/docker-for-mac/space/).

<img alt='docker settings' class='center' src="https://s3-us-west-2.amazonaws.com/raphaelsampaio.com/docker-disk-space-slide.png">

By moving the **Disk image size** slider back to 16 GiB instead of 64 drastically reduced the size of ```/Users/rsampaio/Library/Containers/com.docker.docker``` to 1.3 GiB.

And this was the end result:
<img alt='lots of disk space' class='center' src="https://s3-us-west-2.amazonaws.com/raphaelsampaio.com/after-reducing-docker-disk-space.png">
