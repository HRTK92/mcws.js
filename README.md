# mcws.js

![npm](https://img.shields.io/npm/v/@hrtk92/mcwsjs?style=for-the-badge)
![npm bundle size](https://img.shields.io/bundlephobia/min/@hrtk92/mcwsjs?style=for-the-badge)

mcws.js is a library that makes it easy to start a Minecraft WebSocket server.

## Install

```sh
yarn add @hrtk92/mcwsjs
```

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

## Command

```ts
mcserver.sendCommand('say hello')
```

You can send commands.

> **Warning**
> There is no need to add a `/` at the beginning.
