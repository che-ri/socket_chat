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

wss.on("connection", (socket) => {
    socket.send("hello");
});

server.listen(3000, () => console.log("listening on http://localhost:3000"));
