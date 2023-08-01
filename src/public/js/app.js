const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");

function handleRoomSubmit(e){
    e.preventDefault();
    const input = form.querySelector('input');
    socket.emit("enter_room", input.value, () => {
        console.log("server is done!");
    });
    input.value = "";
}

form.addEventListener('submit', handleRoomSubmit);