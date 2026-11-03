---
title: Adventures in EmbeddedSystems-land
subtitle: Creating a pomodoro timer (...like one of those on TikTok)
tags: blogs
layout: blog.html
relatedProject: pomodomo
templateEngineOverride: njk,md #
# headerImage: pomodomo.jpeg

---
One of the things that surprises me about the technology we use is how cheap it has become, and how (relatively) powerful it is, especially when we look at it historically. The (Apollo X) mission achieved its goal of taking people to the moon on _MB of RAM. It is because of this that I decided to enroll on an embedded systems class at DePaul. There are lots of different takeaways, but I learned quite a bit about FreeRTOS, bare-metal fundamentals, interfacing with electronics, and how to build projects. 

To learn more about this, I decided to recreate an item which I'd bought already - a cheap $15 pomodoro timer on Amazon - and augment it to suit my purposes more. The item in question is here:
</p>
<img src="#" width="400" height="400"/>

### Choosing The Parts
Surprisingly, this is the easy part. I've studied a bit on the types of microcontrollers that are used. The STM32 series is very commonplace, especially in professional settings. However, there is a microcontroller that's very popular amongst hobbyists, which is the ESP32. It is cheap, easy-to-work, and good -- not great -- at battery life. 

One of the best parts of the above is that it is available as part of many different bundles, [like this one](https://www.amazon.com/LAFVIN-Compatible-Development-Electronics-Programming/dp/B0H6JWLDN5). It includes the microcontroller, a tiny display (SSD1306), gyroscope (MPU6050), speaker, and of course a breadboard. This gives us a great starting point to make projects (some of which I might work on at a different point).

### The Architecture

Let's get the basics out of the way first: this project will use PlatformIO and the Arduino framework. These are tools that simplify developing for different microcontrollers, and for this project they'll work great. We'll use a mix of C and C++ for simplicity.

A project like this has a few requirements that I want it to achieve:
- Gyro controls
- The ability to have a timer
- Customizability via a web UI; this was a pain point in the Amazon-bought one
- Some sort of output (display and sound)

The nice thing is that a lot of these requirements map into specific tasks pretty well. FreeRTOS has the concept of *tasks*, which are functions that run concurrently. They don't always map to threads since those are not found much on microcontrollers, and basic concurrency - scheduling code to appear like it's running at the same time - works well for these tasks. These tasks are scheduled onto FreeRTOS with `xTaskCreate`,  and essentially run a loop that allows other tasks to run with `vTaskDelay`. Ultimately we get a list of 4 items.

With these we need a bunch of ways to access data. safely throughout the threads: a few semaphores to handle time and message queues. This is to pass event information safely to threads when the timer updates every second.

Lastly, we'll use a few libraries to simplify things.
- Every peripheral has its own library with methods to interact.
- From what I googled, NVS is *the* way to store data
- AsyncWebServer is one way to create a simple web server.

### The State Machine
Again, one of the biggest design patterns from my embedded class is the use of state machines to A) initialize peripherals and B) keep track of error states cleanly. 
As such, we keep track of every state: 
- Initialization,
- At Work Time
- At Break Time
- Countdown Running (alterative mode) 
- Timer Finished

Ultimately, the code for tasks looks like this:

```c
  // xTaskCreate(tfInteraction, "InteractionTask", 1000, NULL, 3, &tInteraction);
  // xTaskCreate(tfIMU, "IMUTask", 1000, NULL, 2, &tIMU);
  // xTaskCreate(tfNetwork, "NetworkTask", 1000, NULL, 4, &tNetwork);
  // xTaskCreate(tfTimer, "TimerTask", 1000, NULL, 1, &tTimer);
```