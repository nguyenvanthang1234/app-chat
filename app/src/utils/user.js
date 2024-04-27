let userList = [
    {
        id: "1",
        username: "thang",
        room: "room1"
    },
    {
        id: "2",
        username: "dai",
        room: "room2"
    }
];

const addUser = (newUser) => {
    userList = [...userList, newUser];
    return userList; // Trả về một cách rõ ràng danh sách người dùng đã được cập nhật
};

const getUserList = (room) => userList.filter((user) => user.room === room);

const removeUser=(id)=>userList=userList.filter((user)=>user.id!==id)
const findUser=(id)=>userList.find((user)=>user.id===id)

module.exports = {
    getUserList,
    addUser,
    removeUser,
    findUser
};
