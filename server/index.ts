var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
    console.log("a user connected");
    socket.on("disconnect", payload => {
        console.log("disconnected");
    });
    socket.on("stateUpdate", payload => {
        // socket.emit("youPressed", Math.random());
        socket.broadcast.emit("newState", payload);
    });
});

http.listen(3000, function() {
    console.log("listening on *:3000");
});
