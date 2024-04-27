const formatTime = require('date-format');
const createTime=(messageText,username)=>{
    return{
        messageText,
        username,
        createdAt: formatTime(new Date,"dd/MM/yyyy - hh:mm:ss")
    }
}
module.exports={
createTime
}