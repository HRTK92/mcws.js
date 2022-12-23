import { WebSocket, WebSocketServer } from 'ws'
import Events from './events'
import { randomUUID } from 'crypto'

class mswc {
  private host: string
  private port: number
  private server: WebSocketServer | null
  constructor(host = 'localhost', port = 8000) {
    this.host = host
    this.port = port
    this.server = null
  }
  private readyCallback: (host: string, port: number) => void = () => {}
  public onReady(callback: (host: string, port: number) => void) {
    this.readyCallback = callback
  }

  private connectionCallback: (client: WebSocket) => void = () => { }
  public onConnection(callback: (client: WebSocket) => void) {
    this.connectionCallback = callback
  }

  private eventCallbacks: { [eventName: string]: Array<(data: any) => void> } = {}
  public on(eventName: string, callback: (data: any) => void) {
    if (!this.eventCallbacks[eventName]) {
      this.eventCallbacks[eventName] = []
    }
    this.eventCallbacks[eventName].push(callback)
  }
  public createServer() {
    const wss = new WebSocket.Server({ host: this.host, port: this.port })
    this.server = wss
    wss.on('connection', (ws: WebSocket) => {
      this.connectionCallback(ws)
      ws.on('message', (message: string) => {
        const data = JSON.parse(message)
        if (data.eventName) {
          if (this.eventCallbacks[data.eventName]) {
            this.eventCallbacks[data.eventName].forEach((callback) => {
              callback(data)
            })
          }
        }
      })
    })
    wss.on('listening', () => {
      this.readyCallback(this.host, this.port)
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
    if (this.server) {
      this.server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            body: {
              eventName: eventName,
            },
            header: {
              requestId: randomUUID(),
              messagePurpose: 'subscribe',
              version: 1,
              messageType: 'commandRequest',
            },
          })
        )
      })
    } else {
      throw new Error('Server is not running')
    }
  }
  public unsubscribe(eventName: string) {
    if (this.server) {
      this.server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            body: {
              eventName: eventName,
            },
            header: {
              requestId: randomUUID(),
              messagePurpose: 'unsubscribe',
              version: 1,
              messageType: 'commandRequest',
            },
          })
        )
      })
    } else {
      throw new Error('Server is not running')
    }
  }

}

export default mswc
