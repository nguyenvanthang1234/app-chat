// Import các module cần thiết
const socketio = require("socket.io");
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const Filter = require("bad-words");
const { createTime } = require("./utils/create-messages.js");
const { getUserList, addUser, removeUser,findUser } = require("./utils/user.js");

// Đường dẫn đến thư mục chứa các tài nguyên tĩnh (ví dụ: CSS, JavaScript, hình ảnh)
const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));

// Tạo server bằng cách sử dụng http.createServer
const server = http.createServer(app);
const io = socketio(server);

// Xử lý sự kiện khi có một client kết nối
io.on("connection", (socket) => {
  // Xử lý sự kiện khi một client tham gia phòng
  socket.on("vao phong tu client toi sever", ({ room, username }) => {
    socket.join(room);

    // Gửi tin chào mừng cho client vừa kết nối vào phòng
    socket.emit(
      "send message from sever to client",
     createTime(`Chào mừng bạn đến với phòng ${room}`,"admin")
    );

    // Thông báo cho tất cả client khác trong phòng về việc có người mới tham gia
    socket.broadcast
      .to(room)
      .emit(
        "send message from sever to client",
        createTime(`Người dùng ${username} đã tham gia phòng ${room}`,"admin")
      );

    // Xử lý khi một client gửi tin nhắn
    socket.on("send message from client to sever", (messageText, callback) => {
      const filter = new Filter();
      filter.addWords("lồn", "vú", "bướm");
      filter.clean("some bad word!");
      if (filter.isProfane(messageText)) {
       return callback("Tin nhắn không hợp lệ, chứa từ ngữ không phù hợp");
      }

      const id=socket.id
      const user=findUser(id)

      // Gửi tin nhắn đến tất cả client trong phòng
      io.to(room).emit(
        "send message from sever to client",
        createTime(messageText,user.username)
      );

      callback(); // Gọi callback để xác nhận việc gửi tin nhắn thành công
    });

    // Xử lý khi một client chia sẻ vị trí
    socket.on(
      "chia se vi tri tu client den sever:",
      ({ latitude, longitude }) => {
        const link = `http://www.google.com/maps?q=${latitude},${longitude}`;
        
        const id=socket.id
        const user=findUser(id)
        // Gửi thông tin vị trí đến tất cả client trong phòng
        io.to(room).emit("chia se vi tri tu sever den client:", createTime(link,user.username));
      }
    );

    // Xử lý danh sách người dùng
    const newUser = {
      id: socket.id,
      username,
      room,
    };
    addUser(newUser);
    io.to(room).emit("gui user tu sever ve client", getUserList(room));

    // // Xử lý sự kiện ngắt kết nối
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.to(room).emit("gui user tu sever ve client", getUserList(room));
      console.log("Client ngắt kết nối");
    });
  });
});

// Lắng nghe kết nối đến cổng và in log khi server bắt đầu lắng nghe
const port = 3000;
server.listen(port, () => {
  console.log(`Ứng dụng đang chạy tại http://localhost:${port}`);
});
