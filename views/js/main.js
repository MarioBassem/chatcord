
const chatForm = document.getElementById('chat-form');
const searchForm = document.getElementById('search-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});


const socket = io();

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room, users})=> {
  outputRoomName(room);
  outputUsers(users);
})

socket.on('message', message => {
  console.log(message);

  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', e => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})


function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.createdAt}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}


function outputRoomName(room){
  roomName.innerText = room;
}

function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}`
}


document.getElementById('search_input').addEventListener('keyup', function(event){
  const search_term = document.getElementById('search_input').value;
  const room_id = document.getElementById('rid').innerHTML;
  fetch('/chat', {
    method: 'POST',
    body: JSON.stringify({search_term: search_term, room_id: room_id}),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()
    .then(data => {
    clearMessages();
    const messages = data.result;
    messages.forEach(message => outputMessage(message));
  }).catch(err => {
    console.log(err);
  }) 
    
  ).catch(err => {
    console.log(err);
  });
});


function clearMessages(){
  document.querySelector('.chat-messages').innerHTML = '';
}
