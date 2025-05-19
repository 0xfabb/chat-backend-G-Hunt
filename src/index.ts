import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

class Person {
  roomId: string;
  clientName: string;
  websocketConn: WebSocket;

  constructor(roomId: string, clientName: string, websocketConn: WebSocket) {
    this.roomId = roomId;
    this.clientName = clientName;
    this.websocketConn = websocketConn;
  }
}

const roomArray: Person[] = [];

wss.on("connection", (ws) => {
  ws.on("message", (data: string) => {
    try {
      const message = JSON.parse(data);
      const roomId = message.roomId;
      const clientName = message.Name;
      const websocketConn = ws;
      if (message.type === "intro") {
        const newPerson = new Person(roomId, clientName, websocketConn);
        roomArray.push(newPerson);
      } else {
        roomArray.forEach((person) => {
          if (
            person.roomId === roomId &&
            person.websocketConn != websocketConn
          ) {
            person.websocketConn.send(JSON.stringify(message.data));
          }
        });
      }
    } catch (error) {
      console.log(error, "occured");
    }
  });
});
