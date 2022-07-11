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

io.on("connection", (socket) => {
    let user_name = "익명";
    socket.on("message", (message) => {
        io.emit("message", `${user_name}: ${message}`);
    });
    socket.on("nickname", (nickname) => {
        user_name = nickname;
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(3000, () => console.log("listening on http://localhost:3000"));
