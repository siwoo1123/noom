import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug")
app.set("views", __dirname + "/views");
app.use("/public",express.static(__dirname + "/public"))
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect('/'));

const handleListen = () => console.log("Listening on http://127.0.0.1:3000");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
    console.log("Connect to Browser");
    socket.on("close", () => console.log("Disconnect to Browser"));
    socket.on("message", (msg) => {
        socket.send(`${msg}`)
    })
});

server.listen(3000, handleListen);