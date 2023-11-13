const joinNs = (element, nsData) => {
  const nsEndpoint = element.getAttribute("ns");
  const clickedNs = nsData.find((row) => row.endpoint === nsEndpoint);
  let rooms = clickedNs.rooms;
  let roomList = document.querySelector(".room-list");
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    // console.log(room);
    roomList.innerHTML += `<li class="room" namespaceId=${room.namespaceId}>
    <span class="fa-solid fa-${ room.privateRoom ? "lock" : "globe" }"></span>${room.roomTitle}
    </li>`;
  });
  // add click listener to each room so the client can tell the server it wants to join!
  const roomNodes = document.querySelectorAll('.room')
  Array.from(roomNodes).forEach(elem => {
    elem.addEventListener('click',e=>{
        // console.log(`Someone clicked on ${e.target.innerText}`)
        const namespaceId = elem.getAttribute('namespaceId')
        joinRoom(e.target.innerText, namespaceId)
    })
  })
  localStorage.setItem("lastNs", nsEndpoint);
};
