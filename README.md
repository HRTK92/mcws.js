# mcwsjs

![npm](https://img.shields.io/npm/v/@hrtk92/mcwsjs?style=for-the-badge)
![npm bundle size](https://img.shields.io/bundlephobia/min/@hrtk92/mcwsjs?style=for-the-badge)

mcwsjsは簡単にMinecraftのWebSocketサーバーを立てることができるライブラリです。

## Install

```sh
yarn add @hrtk92/mcwsjs
```


## Example

```js
import { mcws, Events } from '@hrtk92/mcwsjs'

const mcserver = new mcws('localhost', 8000)

mcserver.onReady((host, port) => {
    console.log('サーバーが起動しました')
    console.log(`/wsserver ${host}:${port}`)
})

mcserver.onConnection(() => {
    console.log('Minecraftと接続しました')
    mcserver.sendCommand('say 接続しました') // コマンドを送信
    mcserver.subscribe(Events.PlayerMessage) // 受け取るイベントを登録
})

mcserver.on(Events.PlayerMessage, (data) => {
    console.log(`${data.body.message} by ${data.body.sender}`)
})

mcserver.onDisconnect(() => {
    console.log('接続が切断されました')
})

mcserver.createServer() // サーバーを起動
```

## イベント

### onReady

サーバーが起動したときに呼ばれる

### onConnect

MineCraftと接続したときに呼ばれる

### onDisconnect

接続が切断されたときに呼ばれる

### on(event, callback)

[event](https://github.com/HRTK92/mcwsjs/blob/main/src/events.ts)で指定したイベントが発生したときに呼ばれる

## コマンド

```ts
mcserver.sendCommand('say hello')
```

コマンドを送信することができます。

注意: 先頭の`/`をつけないでください。
