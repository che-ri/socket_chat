const socket = io(); //socket.io를 설치하면 io()를 사용할 수 있다.
const $welcome = document.querySelector("#welcome");
const $form = $welcome.querySelector("form");

socket.on("room", (msg) => {
    console.log(msg);
});

$form.addEventListener("submit", (event) => {
    event.preventDefault();
    const $input = $form.querySelector("input");
    socket.emit("enter_room", { payload: $input.value }, (msg) =>
        console.log(msg)
    );
    $input.value = "";
});

socket.on("disconnect", () => console.log("disconnect to server"));
