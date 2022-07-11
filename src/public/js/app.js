const socket = new WebSocket(`ws://${window.location.host}`);

const $message_ul = document.querySelector("ul");
const $message_form = document.querySelector("form");

socket.addEventListener("open", () => console.log("connect to server"));
socket.addEventListener("close", () => console.log("disconnect to server"));

$message_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const $input = $message_form.querySelector("input");
    socket.send($input.value);
    $input.value = "";
});
