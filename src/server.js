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

io.on("connection", (socket) => {
    socket["nickname"] = "익명"; //소켓 "nickname" key에 default setting
    socket.onAny((event) => {
        //socket의 모든 이벤트에 접근
        console.log(io.sockets.adapter);
        console.log(`Socket Event : ${event}`);
    });
    socket.on("enter_room", (payload, done) => {
        const { room_name } = payload;
        socket.join(room_name);
        done();
        socket.to(room_name).emit("welcome", { nickname: socket.nickname }); //"welcome"이라는 이름의 이벤트를 보낸다.
    });
    socket.on("disconnecting", () => {
        //사용자가 채팅방을 떠나려고 하면 이 이벤트가 실행됨
        socket.rooms.forEach((room) =>
            socket.to(room).emit("bye", { nickname: socket.nickname })
        );
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
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
