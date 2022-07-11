const socket = new WebSocket(`ws://${window.location.host}`);

const $message_ul = document.querySelector("ul");
const $message_form = document.querySelector("#message");
const $nickname_form = document.querySelector("#nickname");

socket.addEventListener("open", () => console.log("connect to server"));
socket.addEventListener("message", (m) => {
    const $li = document.createElement("li");
    $li.textContent = m.data;
    console.log(m);
    $message_ul.append($li);
});
socket.addEventListener("close", () => console.log("disconnect to server"));

function makeSocketRequest(type, payload) {
    return JSON.stringify({ type, payload });
}

$message_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const $input = $message_form.querySelector("input");

    //socket애는 string형식만 보낼 수 있기 때문에, object => string 형식으로 변환
    socket.send(makeSocketRequest("message", $input.value));
    $input.value = "";
});

$nickname_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const $input = $nickname_form.querySelector("input");
    socket.send(makeSocketRequest("nickname", $input.value));
    $input.value = "";
});
