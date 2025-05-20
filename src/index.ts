import "dotenv/config"
import { WebSocketServer, WebSocket } from "ws";
import { handleUrl } from "./handlers/urlHandle";

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
  let currentPerson: Person | null = null;

  ws.on("message", (data: string) => {
    try {
      const message = JSON.parse(data);
      const roomId = message.roomId;
      const clientName = message.Name;
      const websocketConn = ws;

      if (message.type === "intro") {
        // Remove any existing user with same socket to avoid duplicates
        const filtered = roomArray.filter(p => p.websocketConn !== ws);
        roomArray.length = 0;
        roomArray.push(...filtered);

        const newPerson = new Person(roomId, clientName, websocketConn);
        roomArray.push(newPerson);
        currentPerson = newPerson;
      } else if(message.type === "file-url"){
        const url = message.data; 
          roomArray.forEach((person) => {
          if (
            person.roomId === roomId &&
            person.websocketConn !== websocketConn
          ) {
            person.websocketConn.send(
              JSON.stringify({
                Name: clientName,
                data: `${clientName} shared a file`,
                file_url : url,
                roomId: roomId,
              })
            );
          }
        });
      } else {
        // Broadcast the message to everyone else in the same room
        roomArray.forEach((person) => {
          if (
            person.roomId === roomId &&
            person.websocketConn !== websocketConn
          ) {
            person.websocketConn.send(
              JSON.stringify({
                Name: clientName,
                data: message.data,
                roomId: roomId,
              })
            );
          }
        });
      }
    } catch (error) {
      console.log(error, "occured");
    }
  });

  ws.on("close", () => {
    if (currentPerson) {
      const index = roomArray.findIndex(
        (p) => p.websocketConn === currentPerson?.websocketConn
      );
      if (index !== -1) {
        roomArray.splice(index, 1);
      }
    }
  });

  ws.on("error", (err) => {
    console.log("WebSocket error:", err);
  });
});
