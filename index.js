const express = require("express")
const server = require("http").createServer(app);
const cors = require("cors");
const fs = require("fs")
const http = require("http")
const https = require("https")
const privateKey = fs.readFileSync(__dirname + '/private.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '/certificate.crt', 'utf8');
const ca = fs.readFileSync(__dirname + '/ca_bundle.crt', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};
const app_low = express();
const app = express();

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
