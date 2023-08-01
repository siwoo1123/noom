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
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit(e){
    e.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value;
    socket.emit("nickname", value);
    input.value = "";
}

function showRoom()
{
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = roomName;
    const msgForm = room.querySelector('#msg');
    const nameForm = room.querySelector('#name');
    msgForm.addEventListener('submit', handleMsgSubmit);
    nameForm.addEventListener('submit', handleNicknameSubmit);
}

function handleRoomSubmit(e){
    e.preventDefault();
    const input = form.querySelector('input');
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener('submit', handleRoomSubmit);

socket.on("welcome", (name) => {
    addMessage(`${name} joined!`);
});

socket.on("bye", (name) => {
    addMessage(`${name} left.`);
});

socket.on("new_message", (msg) => {
    addMessage(msg);
});

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector('ul');
    roomList.innerHTML="";
    if(rooms.length === 0) return;
    rooms.forEach(room => {
        const li = document.createElement('li');
        li.innerText = room;
        roomList.append(li);
    });
})