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

const handleListen = () => console.log("Listening on http://127.0.0.1:3000");
httpServer.listen(3000, handleListen);
