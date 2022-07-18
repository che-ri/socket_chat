import http from "http";
import SocketIo from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("home"));

const server = http.createServer(app);
const io = SocketIo(server);

/**
 * socket.io의 장점
 * 1. 메세지 이벤트를 커스텀할 수 있다. (websocket은 메세지를 보낼 때 무조건 message 이벤트 사용.)
 * 2. 프론트에서 데이터 형식을 다양하게 보낼 수 있다. (기존 websocket은 무조건 string만 가능)
 * 3. 프론트에서 메세지를 보낼 때, 함수를 실어서 보낼 수 있다. 프론트에서 emit으로 보낼 때, 마지막 인자에 함수를 넣어주고 받은 함수를 서버에서 실행시키면, 프론트에서 작동한다!
 * 4. 소켓의 연결이 끊어지면, 롱 풀링을 이용하여, 다시 소켓이 정상화되면 자동으로 연결해준다.
 * 5. 기본적으로 룸의 개념이 있다.
 */

function publicRooms() {
    //return 오픈채팅방들의 정보
    const { sids, rooms } = io.sockets.adapter;

    const public_rooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            public_rooms.push({
                room_name: key,
                user_count: countRoomUsers(key),
            });
        }
    });
    return public_rooms;
}

function countRoomUsers(room_name) {
    //return 룸 내의 유저수
    return io.sockets.adapter.rooms.get(room_name)?.size;
}

io.on("connection", (socket) => {
    socket["nickname"] = "익명"; //소켓 "nickname" key에 default setting
    io.sockets.emit("current_rooms", { public_rooms: publicRooms() }); //사용자가 소켓에 연결시, 현재 활성화되어있는 오픈채팅방의 정보를 보여준다.

    socket.onAny((event) => {
        //socket의 모든 이벤트에 접근
        console.log(`Socket Event : ${event}`);
    });

    socket.on("enter_room", (payload, done) => {
        const { room_name } = payload;
        socket.join(room_name);
        io.to(room_name).emit("welcome", {
            nickname: socket.nickname,
            user_count: countRoomUsers(room_name),
        });
        io.sockets.emit("current_rooms", { public_rooms: publicRooms() });

        done(room_name);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room_name) =>
            io.to(room_name).emit("bye", {
                nickname: socket.nickname,
                user_count: countRoomUsers(room_name) - 1, //유저가 아직 떠나지 않은 상태이므로, 현재 유저수에서 -1 해준다.
            })
        );
    });
    socket.on("disconnect", () => {
        io.sockets.emit("current_rooms", { public_rooms: publicRooms() });
    });
    socket.on("new_message", (payload, done) => {
        const { message, room_name } = payload;
        socket
            .to(room_name)
            .emit("new_message", { nickname: socket.nickname, message });
        done();
    });
    socket.on("nickname", (payload, done) => {
        const { nickname } = payload;
        socket["nickname"] = nickname;
    });
});

server.listen(3000, () => console.log("listening on http://localhost:3000"));
