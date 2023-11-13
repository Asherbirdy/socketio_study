// const userName = prompt("What is your username?");
// const password = prompt('What us your password?')

const userName = "Asher";
const password = "x";

// always join the main namespaces , because that's where the client gets the namespaces from
const socket = io("http://localhost:9000");

// sockets will be put into this array, in the index of their ns.id
const nameSpaceSockets = [];
const listeners = {
  nsChange: [],
};
const addListener = (nsId) => {
    if(!listeners.nsChange[nsId]){
        nameSpaceSockets[nsId].on("nsChange", (data) => {
            console.log("Namespaces Changed");
            console.log(data);
          });  
    listeners.nsChange[nsId] = true
    }

};

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("clientConnect");
});

// Listen for the nsList event from the server which gives us the namespaces
socket.on("nsList", (nsData) => {
  const nameSpacesDiv = document.querySelector(".namespaces");
  nameSpacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    nameSpacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img
        src="${ns.image}"></div>`;
    // initialize thisNs as its index in nameSpaceSockets
    // If the connection is new , this will be null
    // If the connection has already been established, it will  reconnect and remain in its spot
    if (!nameSpaceSockets[ns.id]) {
      // There is no socket at this nsID, so make a new connection
      // join this namespace with io()
      nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
    }
    addListener(ns.id);
  });

  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      element.addEventListener("click", (e) => {
        joinNs(element, nsData);
      });
    }
  );
});
