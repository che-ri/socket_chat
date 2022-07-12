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

function addMessage(message) {
    const $ul = $room.querySelector("ul");
    const $li = document.createElement("li");
    $li.textContent = message;
    $ul.appendChild($li);
}

$form.addEventListener("submit", (event) => {
    event.preventDefault();
    const $input = $form.querySelector("input");
    socket.emit("enter_room", { payload: $input.value }, showRoom);
    room_name = $input.value;
    $input.value = "";
});

socket.on("welcome", () => {
    //socket으로부터 "welcome"이라는 이벤트가 일어나면, addMessage 함수를 이용하여 같은 방에 있는 사람들에게 메세지를 보내게 된다. (공지의 역할)
    addMessage("누군가가 입장했습니다!");
});

socket.on("disconnect", () => console.log("disconnect to server"));
