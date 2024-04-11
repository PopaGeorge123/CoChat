var messagesContent = document.getElementById('messages-content');
var messageInput = document.getElementById('message-input');
var messageSubmit = document.getElementById('message-submit');
var windowEvent = window.addEventListener;
var messageArea = document.querySelector('.messages')

// Variables
var i = 0;
const asstId = 'asst_xYf7KoeoZOtL2FNVA6OoEz1f';

function updateScrollbar() {
  // setTimeout(function(){
  //   messageArea.scrollTop = messageArea.scrollHeight;
  //   console.log('RUNNED')
  // },2000)
  messageArea.scrollTop = messageArea.scrollHeight; 
}

// Function to insert message
function insertMessage() {
  var msg = messageInput.value.trim();
  if (msg === '') {
    return false;
  }
  var message = document.createElement('div');
  message.className = 'message message-personal new';
  message.textContent = msg;
  messagesContent.appendChild(message);
  messageInput.value = null;
}

// Click event for message submit button
messageSubmit.addEventListener('click', function() {
  insertMessage();
  fakeMessage()
});

// Keydown event for the window
windowEvent('keydown', function(e) {
  if (e.which === 13) {
    insertMessage();
    fakeMessage()
    return false;
  }
});

function fakeMessage() {
  //Loading Anim
  var loadingMessage = document.createElement('div');
  loadingMessage.className = 'message loading new';
  loadingMessage.innerHTML = '<figure class="avatar"><img src="/images/main-logo.svg" /></figure><span></span>';
  messagesContent.appendChild(loadingMessage);

  setTimeout(function() {
    messagesContent.querySelector('.message.loading').remove();
    var newMessage = document.createElement('div');
    newMessage.className = 'message new';
    newMessage.innerHTML = '<figure class="avatar"><img src="/images/main-logo.svg" /></figure>' + fake[i];
    messagesContent.appendChild(newMessage);
      i++;
}, 1000 + (Math.random() * 20) * 100);  
}
