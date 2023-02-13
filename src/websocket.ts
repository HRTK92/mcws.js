import { v4 as uuidv4 } from 'uuid'
import { WebSocket, WebSocketServer } from 'ws'

type Data = {
  header: {
    messagePurpose: string
    requestId: string
    version: number
  }
  body: {
    eventName: string
    [key: string]: any
  }
}

class mswc {
  private host: string
  private port: number
  private server: WebSocketServer | null
  private ws: WebSocket | null
  private debug: boolean = false
  constructor(host = 'localhost', port = 8000, debug = false) {
    this.host = host
    this.port = port
    this.server = null
    this.ws = null
    this.debug = debug
  }

  private readyCallback: (host: string, port: number) => void = () => {}
  public onReady(callback: (host: string, port: number) => void) {
    this.readyCallback = callback
  }

  private connectionCallback: (client: WebSocket) => void = () => {}
  public onConnection(callback: (client: WebSocket) => void) {
    this.connectionCallback = callback
  }

  private dissconnectCallback: () => void = () => {}
  public onDisconnect(callback: () => void) {
    this.dissconnectCallback = callback
  }

  private eventCallbacks: { [eventName: string]: Array<(data: Data) => void> } = {}
  public on(eventName: string, callback: (data: Data) => void) {
    if (!this.eventCallbacks[eventName]) {
      this.eventCallbacks[eventName] = []
    }
    this.eventCallbacks[eventName].push(callback)
    this.debug && console.log(`Added callback for ${eventName}`)
  }

  public createServer() {
    const wss = new WebSocket.Server({ host: this.host, port: this.port })
    this.server = wss
    wss.on('connection', (ws: WebSocket) => {
      this.ws = ws
      this.connectionCallback(ws)
      ws.on('message', (message: string) => {
        const data: Data = JSON.parse(message)
        this.debug && console.log(data)
        if (data.body.eventName) {
          if (this.eventCallbacks[data.body.eventName]) {
            this.debug && console.log(`Event ${data.body.eventName} triggered`)
            this.eventCallbacks[data.body.eventName].forEach((callback) => {
              callback(data)
            })
          }
        }
      })
    })
    wss.on('listening', () => {
      this.readyCallback(this.host, this.port)
    })
    wss.on('close', () => {
      this.dissconnectCallback()
    })
  }
  public disconnect() {
    if (this.server) {
      this.server.close()
    } else {
      throw new Error('Server is not running')
    }
  }
  public subscribe(eventName: string) {
    if (this.ws) {
      this.ws.send(
        JSON.stringify({
          body: {
            eventName: eventName,
          },
          header: {
            requestId: uuidv4(),
            messagePurpose: 'subscribe',
            version: 1,
            messageType: 'commandRequest',
          },
        })
      )
      this.debug && console.log(`Subscribed to ${eventName}`)
    } else {
      throw new Error('Server is not running')
    }
  }
  public unsubscribe(eventName: string) {
    if (this.ws) {
      this.ws.send(
        JSON.stringify({
          body: {
            eventName: eventName,
          },
          header: {
            requestId: uuidv4(),
            messagePurpose: 'unsubscribe',
            version: 1,
            messageType: 'commandRequest',
          },
        })
      )
    } else {
      throw new Error('Server is not running')
    }
  }
  public sendCommand(command: string) {
    if (this.ws) {
      this.ws.send(
        JSON.stringify({
          header: {
            requestId: uuidv4(),
            messagePurpose: 'commandRequest',
            version: 1,
            messageType: 'commandRequest',
          },
          body: {
            origin: {
              type: 'player',
            },
            commandLine: command,
            version: 1,
          },
        })
      )
      this.debug && console.log(`Sent command ${command}`)
    } else {
      throw new Error('Server is not running')
    }
  }
}

export default mswc
