const joinRoom = async (roomTitle, namespaceId) => {
  console.log(roomTitle, namespaceId);
  const askResp = await nameSpaceSockets[namespaceId].emitWithAck('joinRoom',roomTitle)
  console.log(askResp)
    document.querySelector('.curr-room-num-users').innerHTML=`${askResp.numUsers}<span class="fa-solid fa-user"></span>`
    document.querySelector('.curr-room-text').innerHTML=roomTitle;// 改變標題
};
