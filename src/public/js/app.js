// const socket = new WebSocket(`ws://${window.location.host}`);
const socket = io(); //socket.io를 설치하면 io()를 사용할 수 있다.

const $message_ul = document.querySelector("ul");
const $message_form = document.querySelector("#message");
const $nickname_form = document.querySelector("#nickname");

$message_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const $input = $message_form.querySelector("input");
    //socket애는 string형식만 보낼 수 있기 때문에, object => string 형식으로 변환
    socket.emit("message", $input.value);
    $input.value = "";
});

$nickname_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const $input = $nickname_form.querySelector("input");
    socket.emit("nickname", $input.value);
    $input.value = "";
});

socket.on("message", (message) => {
    const $li = document.createElement("li");
    $li.textContent = message;

    $message_ul.append($li);
});

socket.on("disconnect", () => console.log("disconnect to server"));
