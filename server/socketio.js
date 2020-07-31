const socketIO = require("socket.io");

class SocketIOServices {
  static init(server) {
    this.io = socketIO(server);
    this.io.on("connection", (socket) => {
      console.log("a user connected");

      socket.on("open_wheel", ({ streamKey }) => {
        this.io.emit("open_wheel2", { streamKey });
      });

      socket.on("nhac_no", (data) => {
        this.io.emit("nhac_no", data);
      });

      socket.on("thanh_toan", (data) => {
        this.io.emit("thanh_toan", data);
      });

      socket.on("disconnect", () => {
        socket.disconnect();
        console.log("a user disconnected");
      });
    });
  }
}

module.exports = SocketIOServices;
