import { WebSocket, WebSocketServer } from 'ws'
import Events from './events'
import { v4 as uuidv4 } from 'uuid'
import { uuid } from 'uuidv4'

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
      this.ws = ws
      this.connectionCallback(ws)
      ws.on('message', (message: string) => {
        const data = JSON.parse(message)
        if (this.debug) {
          console.log(data)
        }
        if (data.header.eventName) {
          if (this.eventCallbacks[data.header.eventName]) {
            this.eventCallbacks[data.header.eventName].forEach((callback) => {
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
    } else {
      throw new Error('Server is not running')
    }
  }
}

export default mswc
