"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
class Person {
    constructor(roomId, clientName, websocketConn) {
        this.roomId = roomId;
        this.clientName = clientName;
        this.websocketConn = websocketConn;
    }
}
const roomArray = [];
wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data);
            const roomId = message.roomId;
            const clientName = message.Name;
            const websocketConn = ws;
            if (message.type === "intro") {
                const newPerson = new Person(roomId, clientName, websocketConn);
                roomArray.push(newPerson);
            }
            else {
                roomArray.forEach((person) => {
                    if (person.roomId === roomId &&
                        person.websocketConn != websocketConn) {
                        person.websocketConn.send(JSON.stringify(message.data));
                    }
                });
            }
        }
        catch (error) {
            console.log(error, "occured");
        }
    });
});
