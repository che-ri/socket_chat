const socket = io(); //socket.io를 설치하면 io()를 사용할 수 있다.
const $welcome = document.querySelector("#welcome");
const $welcome_form = $welcome.querySelector("form");
const $room = document.querySelector("#room");
let room_name = "";

$room.hidden = true;

function handleMessageSubmit(event) {
    //채팅방에 입장하여 메세지를 입력했을 때, 메세지를 보내는 역할.
    event.preventDefault();
    const $input = $room.querySelector("#message input");

    //소켓에게 이벤트를 보낼 때, 마지막 인자에 함수를 보내면 서버에서 이벤트를 모두 처리하고 난 후, 함수가 실행된다.
    socket.emit("new_message", { message: $input.value, room_name }, () => {
        addMessage("나", $input.value);
        $input.value = "";
    });
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const $input = $room.querySelector("#nickname input");
    socket.emit("nickname", { nickname: $input.value }, () => {
        $input.value = "";
    });
}

function showRoom() {
    //현재 채팅방과, 채팅방의 정보를 보여주고, 안의 기능들을 실행시키는 함수.
    $welcome.hidden = true;
    $room.hidden = false;
    const $h3 = $room.querySelector("h3");
    $h3.textContent = `Room ${room_name}`;

    const $message_form = $room.querySelector("#message");
    $message_form.addEventListener("submit", handleMessageSubmit);

    const $nickname_form = $room.querySelector("#nickname");
    $nickname_form.addEventListener("submit", handleNicknameSubmit);
}

function addNotice(message) {
    const $ul = $room.querySelector("ul");
    const $li = document.createElement("li");
    $li.textContent = message;
    $ul.appendChild($li);
}

function addMessage(nickname, message) {
    const $ul = $room.querySelector("ul");
    const $li = document.createElement("li");
    $li.textContent = `${nickname} : ${message}`;
    $ul.appendChild($li);
}

$welcome_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const $input = $welcome_form.querySelector("input");
    socket.emit("enter_room", { room_name: $input.value }, showRoom);
    room_name = $input.value;
    $input.value = "";
});

socket.on("welcome", ({ nickname }) => {
    //socket으로부터 "welcome"이라는 이벤트가 일어나면, addMessage 함수를 이용하여 같은 방에 있는 사람들에게 메세지를 보내게 된다. (공지의 역할)
    addNotice(`${nickname}(이)가 입장했습니다!`);
});

socket.on("bye", ({ nickname }) => {
    addNotice(`${nickname}(이)가 퇴장했습니다!`);
});

socket.on("new_message", ({ nickname, message }) => {
    addMessage(nickname, message);
});

socket.on("disconnect", () => console.log("disconnect to server"));
