const socket = io(); //socket.io를 설치하면 io()를 사용할 수 있다.
const $welcome = document.querySelector("#welcome");
const $form = $welcome.querySelector("form");
const $room = document.querySelector("#room");
let room_name = "";

$room.hidden = true;

socket.on("room", (msg) => {
    console.log(msg);
});

function showRoom() {
    $welcome.hidden = true;
    $room.hidden = false;
    const $h3 = $room.querySelector("h3");
    $h3.textContent = `Room ${room_name}`;
}

$form.addEventListener("submit", (event) => {
    event.preventDefault();
    const $input = $form.querySelector("input");
    socket.emit("enter_room", { payload: $input.value }, showRoom);
    room_name = $input.value;
    $input.value = "";
});

socket.on("disconnect", () => console.log("disconnect to server"));
