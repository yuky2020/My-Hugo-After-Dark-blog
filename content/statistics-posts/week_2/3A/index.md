+++
title = "3_A"
date = 2021-10-05T20:03:36+02:00
description = "an object providing a rectangular area which can be moved and resized using the mouse"

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

## 1_A assignament

### Request
Create an object providing a rectangular area which can be moved and resized using the mouse. This area will hold our future charts and graphics.


### My Solution
{{< youtube airtd7gfgA4 >}}


[Code in C#](https://github.com/yuky2020/Statistics-Pratical-LABS/tree/main/Assignment2/C%23/OnlineArithmeticMean)

[Code in VB.net](https://github.com/yuky2020/Statistics-Pratical-LABS/tree/main/Assignment2/VB.NET/AritMeanDistr)

[Code in zip(mirror)](https://drive.google.com/file/d/1Qv5ttEjqGmwPA4nUcWTi5KP9sYKkm8QJ/view?usp=sharing)

#### Class Elemento Distribuzione in C#

{{< highlight cs >}}
  class ElementoDisribuzione
    {
       private String name;
       private  Dictionary<String,Double> variabili;
    public ElementoDisribuzione(String nome)
        {
            this.name = nome;
            this.variabili = new Dictionary<string, double>();

        }

    public void setVariable(String name,double value) {
            this.variabili.Add(name, value);
        }

    public bool getVariable(String name,out double ret)
        { 
            if (this.variabili.TryGetValue(name, out ret)) return true;
            else return false;
        }
    public Dictionary<String, Double> getVariabili() {
            return this.variabili;
        }

    }

