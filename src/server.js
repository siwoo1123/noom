import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

app.set("view engine", "pug")
app.set("views", __dirname + "/views");
app.use("/public",express.static(__dirname + "/public"))
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect('/'));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function publicRooms(){
    const {
        sockets: {
            adapter: {sids, rooms},
        }
    } = wsServer;

    const publicRooms = [];
    rooms.forEach((_,key)=>{
        if(sids.get(key)===undefined) publicRooms.push(key);
    })
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName).size;
}

wsServer.on("connection", (socket) => {
    socket['nickname'] = `Anon${getRandomInt(0,10000)}`
    socket.on("enter_room", (roomName, done) => {
        done();
        socket.join(roomName);
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye", socket.nickname, countRoom(room)-1)
        });
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message",`${socket.nickname}: ${msg}`);
        done();
    })
    socket.on("nickname", (nickname) => socket["nickname"]=nickname);
});

const handleListen = () => console.log("Listening on http://127.0.0.1:3000");
httpServer.listen(3000, handleListen);
