const socket = io('http://localhost:8000');

const form = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageContainer = document.querySelector(".message-container");
const nameContainer = document.getElementById("name-container");
const chatContainer = document.getElementById("chat-container");
const audio = new Audio('ting.mp3');
const chatMessages = [];
let name = '';
chatContainer.style.display = 'none';



const append = (message, position) => {
    let messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    if (position === 'center') {
        messageElement.classList.add('center');
    }
    if (position === "left") {
        audio.play();
    }

    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    // Add the message to the chatMessages array
    chatMessages.push({ message, position });
    console.log(JSON.stringify(chatMessages))

}

const showChat = () => {
    nameContainer.style.display = 'none';
    chatContainer.style.display = 'flex';
}

// Event listener for the name form
document.getElementById('name-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const enteredName = document.getElementById('name-input').value;
    if (enteredName.trim() !== '') {
        name = enteredName;
        socket.emit('new-user-joined', name);
        showChat();
    }
});

// Socket events
socket.on('user-joined', name => {
    append(`${name} joined the chat`, "center");
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', data => {
    append(`${data}: left the chat`, 'center');
});

// Event listener for the chat form
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const message = messageInput.value;
    if (message !== '') {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

document.getElementById("hamburger-icon").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("show");
});

document.getElementById("clear-chat").addEventListener("click", function () {
    document.getElementById("message-container").innerHTML = "";
    // Clear chatMessages array and local storage
    chatMessages.length = 0;
    localStorage.removeItem('chatMessages');
    document.getElementById("sidebar").classList.remove("show");
});
