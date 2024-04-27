// Yêu cầu server kết nối với client
const socket = io();

// Lắng nghe sự kiện submit của form tin nhắn
document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault(); // Ngăn chặn load lại trang
  const messageText = document.getElementById("input-messages").value;

  // Hàm xác nhận nhận được sự kiện gửi tin nhắn từ server
  const acknowledgements = (error) => {
    if (error) {
      return alert("Tin nhắn không hợp lệ");
    }
    console.log("Tin nhắn đã gửi thành công");
  };

  // Gửi tin nhắn từ client lên server
  socket.emit("send message from client to sever", messageText, acknowledgements);
});

// Lắng nghe sự kiện nhận tin nhắn từ server
socket.on("send message from sever to client", (message) => {
  console.log("Nội dung tin nhắn:", message);
  const {createdAt,messageText,username}=message
  const htmlContent=document.getElementById("app__messages").innerHTML
  // hien thi len man hinh
  const messageElement=`
         <div class="message-item">
            <div class="message__row1">
              <p class="message__name">${username}</p>
              <p class="message__date">${createdAt}</p>
            </div>
            <div class="message__row2">
              <p class="message__content">
               ${messageText}
              </p>
            </div>
          </div>
  `
  let contentRender=htmlContent+messageElement
  document.getElementById("app__messages").innerHTML=contentRender
//clear
document.getElementById("input-messages").value=''


});

// Gửi vị trí từ client lên server
document.getElementById("location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Trình duyệt không hỗ trợ chia sẻ vị trí");
  }

  // Lấy vị trí hiện tại của client
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("Vị trí:", position);
    const { latitude, longitude } = position.coords;

    // Gửi thông tin vị trí lên server
    socket.emit("chia se vi tri tu client den sever:", {
      latitude,
      longitude,
    });
  });
});

// Lắng nghe sự kiện nhận thông tin vị trí từ server
socket.on("chia se vi tri tu sever den client:", (data) => {

  const {createdAt,messageText,username}=data
  const htmlContent=document.getElementById("app__messages").innerHTML
  // hien thi len man hinh
  const messageElement=`
         <div class="message-item">
            <div class="message__row1">
              <p class="message__name">${username}</p>
              <p class="message__date">${createdAt}</p>
            </div>
            <div class="message__row2">
              <p class="message__content">
              <a href="${messageText}" target="blank">
              vi tri cua ${username}
              </a>
              </p>
            </div>
          </div>
  `
  let contentRender=htmlContent+messageElement
  document.getElementById("app__messages").innerHTML=contentRender

});


// xu li query string
const queryString=location.search
const parmas=Qs.parse(queryString,{
  ignoreQueryPrefix:true
})
const {room,username}=parmas
socket.emit("vao phong tu client toi sever",{room,username})

// hien thi ten phong
document.getElementById("app__title").innerHTML=room;

// xu ly user list
socket.on("gui user tu sever ve client", (userList) => {
  console.log("Danh sách người dùng:", userList);
  let content=''
  userList.map((user)=>{
    content+=` <li class="app__item-user">${user.username}</li>`
  })
  document.getElementById("haha").innerHTML=content
});