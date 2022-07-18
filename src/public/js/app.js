const socket = io(); //socket.io를 설치하면 io()를 사용할 수 있다.
const $welcome = document.querySelector("#welcome");
const $welcome_form = $welcome.querySelector("form");
const $room = document.querySelector("#room");
const $public_room = document.querySelector("#public_room");
let room_name = "";

$room.hidden = true;

function handleMessageSubmit(event, room_name) {
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

function showRoom(room_name) {
    //현재 채팅방과, 채팅방의 정보를 보여주고, 안의 기능들을 실행시키는 함수.
    $welcome.hidden = true;
    $room.hidden = false;
    const $h3 = $room.querySelector("h3");
    $h3.textContent = `Room ${room_name}`;

    const $message_form = $room.querySelector("#message");
    $message_form.addEventListener("submit", (e) =>
        handleMessageSubmit(e, room_name)
    );

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

function setUserCount(cnt) {
    const $span = $room.querySelector("#user_count");
    $span.textContent = `${cnt} 명`;
}

$welcome_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const $input = $welcome_form.querySelector("input");
    socket.emit("enter_room", { room_name: $input.value }, () =>
        showRoom($input.value)
    );
    room_name = $input.value;
    $input.value = "";
});

socket.on("connect", () => {
    console.log("connect to server");
});

socket.on("welcome", ({ nickname, user_count }) => {
    //채팅방에 유저 입장시, 같은 방에 있는 사람들에게 공지를 보낸다.
    addNotice(`${nickname}(이)가 입장했습니다!`);
    setUserCount(user_count);
});

socket.on("bye", ({ nickname, user_count }) => {
    //채팅방에 유저 퇴장시, 같은 방에 있는 사람들에게 공지를 보낸다.
    addNotice(`${nickname}(이)가 퇴장했습니다!`);
    setUserCount(user_count);
});

socket.on("new_message", ({ nickname, message }) => {
    //채팅방에 메세지를 보낸다.
    addMessage(nickname, message);
});

socket.on("current_rooms", ({ public_rooms }) => {
    //누군가 socket에 연결하거나, 방을 생성하고, 나갈 때마다 이 이벤트를 받는다.

    //유저에게 오픈채팅방 목록들을 보여주는 역할을 한다.
    const $ul = $public_room.querySelector("ul");
    $ul.innerHTML = "";
    public_rooms.forEach(({ room_name, user_count }) => {
        const $li = document.createElement("li");
        const $room_name = document.createElement("p");
        $room_name.textContent = `채팅방명 : ${room_name}`;
        const $user_count = document.createElement("p");
        $user_count.textContent = `유저 수 : ${user_count} 명`;
        $li.appendChild($room_name);
        $li.appendChild($user_count);
        $ul.appendChild($li);
    });
});

socket.on("disconnect", () => console.log("disconnect to server"));
