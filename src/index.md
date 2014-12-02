---
title: Welcome
template: layout.jade
menuIndex: 1
---

Welcome to the **Symbiot** documentation.

What is Symbiot?
----------------

Symbiot is an open-source service which helps making _things_ communicate to each other. Think about a _thing_ as any connected physical or virtual entity. Your toaster has Webhooks? Then it's a _thing_. Your dildo exposes a RESTful API? Then it's a _thing_. Your Facebook wall is a _thing_. At large, anything reachable programmatically from the machine where Symbiot is running is a _thing_. And anything that can reach the machine where Symbiot is running is a _thing_ too. Needless to say, _things_ are plenty.

Now imagine a world where, without writing a single line of code, you can flash a red light in your living room when there is no more beer in the fridge. Maybe you fall into the category of people who believe that the usage of the aforementioned dildo should send syslog messages to a remote server? What if your alarm clock was telling your coffee machine to warm up while you are still trying to make sense of your psycho dreams? That would be great, and that's what Symbiot is trying to make real.

Ever tried [Zapier](https://zapier.com/) or [IFTTT](https://ifttt.com)? If not, you should, these services are great. But as great as they are, they are not completely free, they are not open-source and they don't run in the comfort of your own private network. Symbiot is free, is open-source and it runs on your machine in the blink of an eye.


How does it work?
-----------------

Symbiot is built around four simple concepts: **streams**, **drivers**, **inputs** and **outputs**.

### Stream

A **stream** is an automated communication flow between two _things_. It is nothing less than the core of Symbiot. It makes the connection between a data source (called _input_) and a target action (called _output_). You can see it as a translator between two _things_ which don't talk the same language.

Configuring a **stream** consists in defining how the language of the source _thing_ must be translated to the language of the target _thing_. The good news is that you don't have to write code to do this, there is a cool Web UI for it. So if you know how to use a mouse and have elementary keyboard usage skills, you are able to tell your grandma's hearing aid device to turn off when coarse language is detected on your favourite TV program.

### Driver

Toasters, alarm clocks and hearing aid devices all become _things_ as soon as there is a **driver** for them in your Symbiot installation. It doesn't matter if they communicate with Symbiot through HTTP, filesystem, email or [RFC-1149](https://www.ietf.org/rfc/rfc1149.txt) and it doesn't matter if they are meant to be used as a data source (_input_), as an action to trigger (_output_) or both: those _things_ are all known to Symbiot by their **driver**.

Symbiot needs a toaster **driver** to receive information from that _thing_ ("your toast is ready!") or to control it ("set the heat level to 5"). The more **drivers** the more powerful Symbiot becomes! And if your favourite toy doesn't have one yet, just create it (in your favorite programming language), it's as easy as it can be. The whole world will be thankful for your contribution.

Note that **drivers** are part of your Symbiot installation; you cannot create them from the Web UI. Elementary ones are provided directly with the official releases, and more exotic ones will be downloadable separately and most of the time installable with a simple copy-paste (as a plugin).

For more information, see [Understanding drivers](guides/understanding-drivers/).

### Input

An **input** is an entry point to Symbiot for a given driver. While a driver enables the interactions with a _thing_, **inputs** actually open a data flow to it, with a given configuration. **Inputs** generate traffic! And yes, you guessed it right (you genius), this traffic can be directed to a stream.

You can open more than one **input** for a given driver, each one using a different configuration. Imagine a driver for iBeacons: you might want to deploy ten iBeacons in your office space and use each of them as a separate data source. For this kind of setup you will need one iBeacons driver and ten **inputs**, each of them being configured to receive traffic from a specific iBeacon. Got it? If this is too abstract, think about a cluster of toasters (to scale-out on your breakfast as your family grows).

**Inputs** can be created and configured from the Web UI, all you need is to have the appropriate drivers in your installation.

### Output

At this stage you should be able to guess what an **output** is. Indeed, it opens a data flow from a stream to a driver, with a given configuration. **Outputs** are side effects of the processing of a stream, they are your ultimate goal! Make this _thing_ display some information, ring, flash, communicate, vibrate or explode. The intersection of your drivers and the sky is the limit.

Like for inputs, your can create more than one **output** for a given driver, each instance having its own configuration. With a single office-kitchen-display driver you can define multiple *outputs*, each one being responsible for the update of a specific metric displayed on that 102 inch display in your cool startup kitchen.

Of course, **Outputs** can be created and configured from the Web UI, all you need is to have the appropriate drivers in your installation.



