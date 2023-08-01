const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server");
});

socket.addEventListener("message", (msg) => {
    console.log("Just got this:", msg.data, "from the server");
});

socket.addEventListener("close", () => {
    console.log("Disconnected to Server");
});

setTimeout(() => {
    socket.send("hello from browser!");
}, 5000);