---
title: Understand drivers
template: layout.jade
subsectionIndex: 7
---

A driver describes all the possible data between Symbiot and a _thing_. It is a composition of **input collectors** and **output providers**.

An **input collector** is a component of a driver responsible for handling the data flow from the _thing_ to Symbiot. A driver may define zero, one or more input collectors, depending on the _thing_ it is integrating with. For instance, a driver for a weather station may define one which fetches all the metrics of the station every 10 minutes and another one which raises an alert when the temperature climbs over a given threshold. A driver for your air conditioning system on the other hand might not define any input collector because it does not emit any data.

An **output provider** is a component of a driver responsible for handling the data flow from Symbiot to the _thing_. A driver may define zero, one or more output providers, depending on the _thing_ it is integrating with. For instance, a driver for your air conditioning system may define one to set the expected temperature. A Facebook driver may provide a few for posting, poking, liking, sharing or anything showing your awesomeness to the world.

In the simplest (and rather common) cases, writing a driver does not require you to write any code: all you need is to write a Json descriptor. For more advanced use cases you may need to write a bit of code, but you do that outside of Symbiot in the programming language of your choice (we'll get to that later). A descriptor looks like this:

```
{
  "id" : "my-unique-driver-id",
  "name" : "My Driver",
  "description" : "An example of driver",
  "version" : "0.1.0",
  "inputCollectors": [ {...}, {...}, {...} ],
  "outputProviders": [ {...}, {...}, {...} ]
}
```

Name it the way you want (with a `.json` extension) and place it in a `drivers` folder next to your Symbiot Jar file.

### Input collector

There are different ways to send data to Symbiot. Depending on the communication capabilities of the _thing_ the driver is written for or the programming language you want to use for the driver implementation, you will privilege one or the other integration model.

#### API Push Collector

Json payloads will be pushed from the _thing_ (or an intermediate process) to the Symbiot API on `/inputs/{inputId}`. This assumes that the original source of events (ex: a toaster) has configurable webhooks or is under the control of the driver developer (ex: the developer has developed a toaster driver in `Node.js` which interacts somehow with the toaster and posts Json payloads to the Symbiot API).

This is how to define an API push collector in Json:

```
{
  "type": "apiPushCollector",
  "name": "My input collector",
  "description": "This collector accepts incoming data on the Symbiot API",
  "schema": {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "someString" : {
        "type": "string"
      }
    },
    "required": ["someString"]
  }
}
```

The `schema` node is a [Json Schema](http://spacetelescope.github.io/understanding-json-schema/) describing the format of the data which will be posted on the API endpoint. It is very important since the very core of Symbiot relies on this data definition to help you build streams from an input to an output. That's where you have a bit of job to do: you have to formalize the format of your incoming data (or at least the part that is of interest for you) in a Json Schema. The above example describes a Json payload containing a single string node called "someString" (an example of valid payload would be `{ "someString" : "hello world" }`).

Later on, when you will create inputs for this input collector in the Symbiot UI, you will be asked to provide the `inputId` which determines the endpoint where payloads need to be posted (`/inputs/{inputId}`).

#### API Pull Collector

Symbiot does a regular polling on an external API to fetch valid Json payloads. This assumes that the source of events exposes a RESTful API (which works nicely with the  Symbiot poller). Ex: the toaster exposes an API to fetch its status; Symbiot will query `GET http://192.168.0.14/toaster_api/status` every 5 seconds and expects to receive a valid Json payload.

This is how to define an API pull collector in Json:

```
{
  "type": "apiPullCollector",
  "name": "My input collector",
  "description": "This collector is pulling data from the thing (or an intermediate process)",
  "frequency": 5,
  "url": "http://192.168.0.14/toaster_api/status",
  "method": "GET",
  "headers": [
    "Authorization": "Basic eW91QXJlQ3VyaW91czpnb29kRm9yWW91"
  ],
  "schema": {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "someString" : {
        "type": "string"
      }
    },
    "required": ["someString"]
  }
}
```

Just as for the push collector, the `schema` node is a [Json Schema](http://spacetelescope.github.io/understanding-json-schema/) describing the format of the data which will be pulled. It's your job to specify the format of the data your are pulling from the endpoint configured (or at least the part that is of interest for you).

Later on, when you will create inputs for this input collector in the Symbiot UI, you will have the possibility to override any of the `frequency`, `url`, `method` and `headers` fields, which define where to fetch the data from. Just consider the values defined in your Json descriptor as convenient defaults.

#### Filesystem Collector

Symbiot watches a folder in the filesystem where valid Json payloads can be dropped (or modified). This assumes that the source of events does not talk HTTP and uses the filesystem to exchange data (note that this method works nicely with FTP or a system like DropBox). Ex: a program written in C collects information from a USB toaster, converts it to Json in memory and writes it under `/symbiot/toasterInputs` (and Symbiot watches this folder).

This is how to define an API pull collector in Json:

```
{
  "type": "filesystemCollector",
  "name": "My input collector",
  "description": "This collector is watching changes in a local folder",
  "folder": "/symbiot/toasterInputs",
  "regex": "*.json",
  "deleteAfterRead": true,
  "schema": {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "someString" : {
        "type": "string"
      }
    },
    "required": ["someString"]
  }
}
```

The `deleteAfterRead` parameter specifies if the files must be consumed (deleted upon reading) or left in the folder (and monitored for changes). And again, the `schema` node is a [Json Schema](http://spacetelescope.github.io/understanding-json-schema/) describing the format of the data which will be pulled. It's your job to specify the format of the data your are matching with your folder and regex (or at least the part that is of interest for you).

Later on, when you will create inputs for this input collector in the Symbiot UI, you will have the possibility to override any of the `folder`, `regex` and `deleteAfterRead` fields. Just consider the values defined in your Json descriptor as convenient defaults.

#### Apache Camel Collector

Just mentioning, that could be an interesting collector to have, pull requests are welcome ;).


### Ouput provider

(to be documented)

### Example

(to be documented)

