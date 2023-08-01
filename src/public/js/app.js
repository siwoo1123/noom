const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(msg){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.append(li);
}

function handleMsgSubmit(e)
{
    e.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function showRoom()
{
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = roomName;
    const form2 = room.querySelector("form");
    form2.addEventListener("submit", handleMsgSubmit);
}

function handleRoomSubmit(e){
    e.preventDefault();
    const input = form.querySelector('input');
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener('submit', handleRoomSubmit);

socket.on("welcome", () => {
    addMessage("someone joined!");
});

socket.on("bye", () => {
    addMessage("someone left.");
});

socket.on("new_message", (msg) => {
    addMessage(msg);
});