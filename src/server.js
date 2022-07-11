import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("home"));

//아래는 http서버와 websocket서버를 한개로 합치기 위한 작업이다. express에서는 ws를 지원하지 않기 때문에, http의 createServer을 이용하여 따로 서버를 만들어주어야한다.
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//채팅방에 입장한 사람들은 소켓에 연결될 것이고, 연결된 소켓은 이 array에 들어간다.
const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "익명";
    socket.on("close", () => console.log("disconnected from the browser"));
    socket.on("message", (message) => {
        //클라이언트로부터 받은 string 형식의 객체를 parse
        const parsed_message = JSON.parse(message.toString());

        switch (parsed_message.type) {
            case "message":
                sockets.forEach((s) =>
                    s.send(`${socket.nickname}: ${parsed_message.payload}`)
                );
            case "nickname":
                //socket은 기본적으로 객체라, 키를 추가할 수 있음. socket 안에 사용자를 정의할 수 있는 닉네임을 실어서 보낸다.
                socket["nickname"] = parsed_message.payload;
        }
    });
});

server.listen(3000, () => console.log("listening on http://localhost:3000"));
