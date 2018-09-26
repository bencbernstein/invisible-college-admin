import * as io from "socket.io-client"

export default class Socket {
  private socket: SocketIOClient.Socket

  constructor() {
    this.socket = io.connect("http://localhost:5000")

    this.socket.on("connect", () => {
      console.log("socket connected")
      this.socket.emit("my event")
    })
  }

  public registerHandler(onMessageReceived: any) {
    this.socket.on("message", onMessageReceived)
  }
}
