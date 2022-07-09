const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => console.log("connect to server"));
socket.addEventListener("message", (m) => console.log(m.data));
socket.addEventListener("close", () => console.log("disconnect to server"));
