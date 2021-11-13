+++
title = "11_A"
date = 2021-10-28T20:03:36+02:00
description = "Discover a new important stochastic process by yourself! "
draft = false
toc = false
categories = ["statistic"]
tags = ["after", "statistic"]
images = [
  "https://source.unsplash.com/collection/983219/1600x900"
] # overrides site-wide open graph image

[[resources]]
  src = "images/2.png"
  name = "header thumbnail"

+++

![header](images/2.png)

## 11_A assignament

### Request
Discover a new important stochastic process by yourself! Consider the general scheme we have used so far to simulate some stochastic processes (such as the relative frequency of success in a sequence of trials, the sample mean and the random walk) and now add this new process to our simulator.
Same scheme as previous program (random walk), except changing the way to compute the values of the paths at each time. Starting from value 0 at time 0, for each of m paths, at each new time compute N(i) = N(i-1) + Random step(i), for i = 1, ..., n, where Random step(i) is now a Bernoulli random variable with success probability equal to λ * (1/n)  (where λ is a user parameter, eg. 50, 100, ...).
At time n (last time) and one (or more) other chosen inner time 1<j<n (j is a program parameter) create and represent with histogram the distribution of N(i). 
Represent also the distributions of the following quantities (and any other quantity that you think of interest):
- Distance (time elapsed) of individual jumps from the origin
- Distance (time elapsed) between consecutive jumps ("holding times")

### My Solution

{{< youtube btWiAAvVsho >}}


[Code in C#](https://github.com/yuky2020/Statistics-Pratical-LABS/tree/main/Assignment9/C%23)


#### Methods for calculate empirical CDS  in C#

{{< highlight cs >}}
    
{{< /highlight >}}
