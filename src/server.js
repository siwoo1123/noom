import express from "express";

const app = express();

const handleListen = () => console.log("Listening on http://127.0.0.1:3000");
app.listen(3000, handleListen);