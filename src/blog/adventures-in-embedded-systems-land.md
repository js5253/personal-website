---
title: Adventures in EmbeddedSystems-land
subtitle: Creating a pomodoro timer (...like one of those on TikTok) with an ESP32.
tags: blogs
layout: blog.html
relatedProject: pomodomo
templateEngineOverride: njk,md #
furtherResearch:
- "https://pages.cs.wisc.edu/~remzi/OSTEP/"
- "https://percepio.com/tag/rtos-101/"
# headerImage: pomodomo.jpeg
---

One of the things that surprises me about the technology we use is how cheap it
has become, and how (relatively) powerful it is, especially when we look at it
historically. The computer used to launch the Apollo mission achieved its goal of taking people to the
moon on 4KB of RAM. It is because of this that I decided to enroll on an
embedded systems class at DePaul. There are lots of different takeaways, but I
learned quite a bit about FreeRTOS, bare-metal fundamentals, interfacing with
electronics, and how to build projects.

To practice this a bit, and solve a problem I had, I decided to recreate an item which I'd bought
already - a cheap $15 pomodoro timer on Amazon - and augment it to suit my
purposes more. The item in question is [here](https://www.amazon.com/Rotating-Pomodoro-Minutes-Productivity-Vibration/dp/B0D7JG4VLD). 

For a $15 device, it works well. However, sometimes I do want non-pomodoro timers, and changing the times is annoying to do. It also seems like the creators of the product use a LED display with software that makes it look like an old seven-segment display, so I wanted to further my learning into embedded systems.
<!-- <img src="#" width="400" height="400"/> -->

### Choosing The Parts

Surprisingly, this is the easy part. I've come across various types of
microcontrollers that are used: The STM32 series is very commonplace, especially
in industrial controllers. NRF microcontrollers, powered by the same ARM
technology that pervades our modern phones, is excellent at battery life.
However, in the end I chose to use a more common, hobbyist-level
microcontroller: the ESP32. It is cheap, easy-to-work, and good - albeit not
great - at battery consumption.

One of the best parts of the above is that it is available as part of many
different bundles,
[like this one](https://www.amazon.com/LAFVIN-Compatible-Development-Electronics-Programming/dp/B0H6JWLDN5).
It includes a ton of components for an array of different projects; we'll use the microcontroller, a tiny display
(SSD1306), gyroscope (MPU6050), speaker, and of course a breadboard. This gives
us a great starting point to make projects (some ideas which I might detail in
later posts).

### The Architecture

Even at the start, there are many frameworks and ways to program this project - making things from scratch, using ESP-IDF, and even programming things with Rust through the Embassy Executor. I'll use PlatformIO
(pio-duino), C++, and the Arduino framework. These are tools that simplify developing
for different microcontrollers, and for this project they'll work great. We'll
use a mix of C and C++ for simplicity.

A project like this has a few requirements that I want it to achieve:

- Gyro controls
- The ability to have a timer
- Customizability via a web UI; this was a pain point in the Amazon-bought one
- Some sort of output (display and sound)

The nice thing is that a lot of these requirements map into specific tasks
pretty well. FreeRTOS has the concept of _tasks_, which are functions that run
concurrently. They don't always map to physical CPU cores since those are not found much on
microcontrollers and multithreading is expensive, and basic concurrency -
scheduling code to appear like it's running at the same time - works well for
these tasks. These tasks are scheduled onto FreeRTOS with `xTaskCreate`, and
essentially run a loop that allows the FreeRTOS scheduler to run other tasks when there is downtime. The code does this with `vTaskDelay`.

There is, of course, a whole lot more to learn about scheduling: priority inversion, 
pinning tasks to cores, and optimization. However, that would end up inflating a blog post even more. If you're interested in any of this, take a look at the OSTEP textbook which goes over scheduling in greater detail, and the resources in "Further Research" below.

Ultimately we get a list of 4 tasks, each of which we have to schedule so they
don't have priority conflicts. We also do have to set up some interrupts as
these are the recommended way to handle changes in timer value.

With these we need a bunch of ways to access data safely throughout the threads:
semaphores to handle time, message queues. This is to pass event information
safely to threads through the interrupts.

Lastly, we'll use a few libraries to simplify things.

- Every peripheral has its own library with methods to interact, so
  Adafruit_SSD1306 and Adafruit_MPU6050 are instrumental.
- ESP32-AudioI2S is a good way to add audio to our project.
- From what I googled, NVS is _the_ way to store data
- AsyncWebServer is one way to create a simple web server.

### The State Machine

One of the biggest design patterns from my embedded class (and from related videos) is the use of state machines to A) initialize peripherals and B) keep track of errors 
cleanly. As such, we keep track of every state:

- Initialization,
- At Work Time
- At Break Time
- Countdown Running (alterative mode)
- Timer Finished

These are declared at the top, and all tasks have to take these into account.
The code ends up looking like this:

```c
enum AppState
{
  INIT,
  IDLE,
  WORKING,
  BREAKING,
  FINISHED
};
volatile AppState globalState = AppState::INIT;
// use it elsewhere...
    AppState state = getSystemState();
    case INIT:
      break;
    case WORKING:
```

Ultimately, the code for tasks looks like this:

```c
xTaskCreate(tfInteraction, "InteractionTask", 1000, NULL, 3, &tInteraction);
xTaskCreate(tfIMU, "IMUTask", 1000, NULL, 2, &tIMU);
xTaskCreate(tfNetwork, "NetworkTask", 1000, NULL, 4, &tNetwork);
xTaskCreate(tfTimer, "TimerTask", 1000, NULL, 1, &tTimer);
```

<!-- ### All the Physical Parts

#### Protocols, and Connections

#### Making this... a product! (Finishing up)
Here is where 
### The Complete Resources
- **Full Images Here!**
- [Code is here](https://github.com/js5253/pomodormo)
- [CAD link here]()
- [Enclosure here]() -->
