---
title: Understand drivers
template: layout.jade
subsectionIndex: 7
---

A driver describes all the possible data exchanges between Symbiot and a _thing_. It is a composition of **input collectors** and **output providers**.

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

### Input collectors

There are different ways to send data to Symbiot. Depending on the communication capabilities of the _thing_ the driver is written for or the programming language you want to use for the driver implementation, you will privilege one or the other integration model.

#### API Push collector

Json payloads will be pushed from the _thing_ (or an intermediate process) to the Symbiot API on `/inputs/{inputId}/data`. This assumes that the original source of events (ex: a toaster) has configurable webhooks or is under the control of the driver developer (ex: the developer has developed a toaster driver in `Node.js` which interacts somehow with the toaster and posts Json payloads to the Symbiot API).

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

#### API Pull collector

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

#### Filesystem collector

Symbiot watches a folder in the filesystem where valid Json payloads can be dropped (or modified). This assumes that the source of events does not talk HTTP and uses the filesystem to exchange data (note that this method works nicely with FTP or a system like DropBox). Ex: a program written in C collects information from a USB toaster, converts it to Json in memory and writes it under `/symbiot/toasterInputs` (and Symbiot watches this folder).

This is how to define a filesystem collector in Json:

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


### Ouput providers

There are different ways to let Symbiot send data to a target _thing_. As for input collectors, you will choose one or the other integration model depending on the communication capabilities of the _thing_ your driver is written for, or depending on the programming language you use for the possible intermediate system between Symbiot and the _thing_. As you will see, these are very similar to the input collectors presented above.

#### Webhook Provider

Json payloads will be pushed from Symbiot to the _thing_ (or an intermediate process) over HTTP to the provided endpoint. This assumes that the target (ex: a toaster) exposes a RESTful API or is under the control of the driver developer (ex: the developer has written a toaster driver in `Node.js` which exposes an API and somehow transmits the data to the toaster).

This is how to define a Webhook provider in Json:

```
{
  "type": "webhookProvider",
  "name": "My output provider",
  "description": "This provider sends the data to an API endpoint",
  "url": "http://192.168.0.14/toaster_api/heatValue",
  "method": "POST",
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

Again, the `schema` node is a [Json Schema](http://spacetelescope.github.io/understanding-json-schema/) describing the format of the data which will be pulled. It's your job to specify the format of the data expected by the endpoint where the data will be pushed.

Later on, when you will create outputs for this output provider in the Symbiot UI, you will have the possibility to override any of the `url`, `method` and `header` fields. Just consider the values defined in your Json descriptor as convenient defaults.

#### Polling provider

Json payloads will be temporarily stored on Symbiot and exposed on `/outputs/{outputId}/data` (reachable with a `GET` method). This assumes that the target cannot be reached with a Webhook (which would have been more elegant) and will instead actively poll the outputs from the above endpoint (ex: the developer has written a Cron job which checks for new outputs every 3 seconds before relaying them to the toaster to control the heat level).

This is how to define a Polling provider in Json:

```
{
  "type": "pollingProvider",
  "name": "My output provider",
  "description": "This provider temporarily exposes the data as a REST resource",
  "ttl": 30,
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

The `ttl` node allows to specify for how long (in seconds) the resource shall be retained. The `schema` node is a [Json Schema](http://spacetelescope.github.io/understanding-json-schema/) describing the format of the resource. Once again, it's your job to specify this format.

Later on, when you will create outputs for this output provider in the Symbiot UI, you will have to provide the `{outputId}` used in the resource path (which dictates where your polling component needs to query the data).

#### Filesystem Provider

Json payloads will be saved to disk in a given folder (and named after the current timestamp, with `.json` extension). Well, at this stage you should get the point: if your _thing_ or your programming language is not quite HTTP-friendly or for whatever reason you want to use the filesystem as an integration point (ex: for testing during your driver implementation), then that's how you can do it.

Here is how to define a Filesystem provider in Json:

```
{
  "type": "filesystemProvider",
  "name": "My output provider",
  "description": "This provider stores my Json payload on disk",
  "folder": "/symbiot/toasterOuputs",
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

The `schema` node is a [Json Schema](http://spacetelescope.github.io/understanding-json-schema/) describing the format of the resulting Json payload. Once again, it's your job to specify this format. So do it and do it well.

Later on, when you will create outputs for this output provider in the Symbiot UI, you will have the possibility to override the `folder` parameter, if needed.

### Example

(to be added)

