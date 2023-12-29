# mcws.js

![npm](https://img.shields.io/npm/v/@hrtk92/mcwsjs)
![npm](https://img.shields.io/npm/dt/%40hrtk92%2Fmcwsjs)
[![GitHub Release](https://github.com/HRTK92/mcws.js/actions/workflows/release.yml/badge.svg)](https://github.com/HRTK92/mcws.js/actions/workflows/release.yml)

mcws.js is a library that makes it **easy** to start a Minecraft WebSocket server.

## Install

```sh
$ yarn add @hrtk92/mcwsjs
```

## Usage

Here is a detailed explanation of how to use this library:

- Step 1: Import the library in your project
- Step 2: Create an instance of the `mcws` class, passing in the host and port as arguments
- Step 3: Call the `createServer()` method to start the server
- Step 4: Register event listeners using the `on()` method to receive events from the Minecraft server
- Step 5: Use the `sendCommand()` method to send commands to the Minecraft server

## Example

```js
import { mcws, Events } from '@hrtk92/mcwsjs'

const mcserver = new mcws('localhost', 8000)

mcserver.onReady((host, port) => {
    console.log('Server started')
    console.log(`/wsserver ${host}:${port}`)
})

mcserver.onConnection(() => {
    console.log('Connected to Minecraft')
    mcserver.sendCommand('say Connected') // send command
    mcserver.subscribe(Events.PlayerMessage) // register events to receive
})

mcserver.on(Events.PlayerMessage, (data) => {
    console.log(`${data.body.message} by ${data.body.sender}`)
})

mcserver.onDisconnect(() => {
    console.log('Disconnected')
})

mcserver.createServer() // start the server

```

## Events

### onReady

Called when the server is started

### onConnect

Called when connected to Minecraft

### onDisconnect

Called when the connection is disconnected

### on(event, callback)

Called when the [event](https://github.com/HRTK92/mcwsjs/blob/main/src/events.ts) specified by event occurs

> **Note**  
> I used [this gist](https://gist.github.com/jocopa3/5f718f4198f1ea91a37e3a9da468675c#file-mcpe-w10-event-names) as a reference to create an event list.

## Command

```ts
mcserver.sendCommand('say hello')
```

You can send commands.

> **Warning**  
> There is no need to add a `/` at the beginning.
