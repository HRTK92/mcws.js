# mcwsjs

mcwsjsは簡単にMinecraftのWebSocketサーバーを立てることができるライブラリです。

## Install

```sh
yarn add @hrtk92/mcwsjs
```


## Example

```js
import { mcws, Events } from '@hrtk92/mcwsjs'

const mcserver = new mcws()

mcserver.onReady = () => {
    console.log('サーバーが起動しました')
}

mcserver.onConnect = () => {
    console.log('MineCraftと接続しました')
    mcserver.subscribe(Events.PlayerMessage) // 受け取るイベントを登録
}

mcserver.on(Events.PlayerMessage, (data) => {
    console.log(`${data.body.message} by ${data.body.sender}`)
})

mcserver.onDisconnect = () => {
    console.log('接続が切断されました')
}

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

[event](https://gist.github.com/jocopa3/5f718f4198f1ea91a37e3a9da468675c#file-mcpe-w10-event-names)で指定したイベントが発生したときに呼ばれる
