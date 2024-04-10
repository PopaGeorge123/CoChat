var messagesContent = document.getElementById('messages-content');
var messageInput = document.getElementById('message-input');
var messageSubmit = document.getElementById('message-submit');
var windowEvent = window.addEventListener;

// Variables
var i = 0;
var fake = [
  'The error youre encountering, "Uncaught TypeError: Cannot read properties of null ( the querySelector method couldnt ) is returning null, and then youre trying to call the appendChild method on null, which results in an error.To resolve this issue, you need to ensure that the .mCSB_container element exists within the messagesContent element. Make sure that:The .messages-content element exists in your HTML structure.Inside the .messages-content element, there should be an element with the class .mCSB_container.You should also check whether your HTML structure matches the structure expected by your JavaScript code. If the structure is different, you may need to adjust your JavaScript code accordingly.If youve confirmed that the HTML structure is correct and the element with the class .mCSB_container exists within .messages-content, then the issue might be related to the timing of when your JavaScript code is executed. Ensure that your JavaScript code is executed after the DOM has fully loaded. You can achieve this by placing your JavaScript code inside a DOMContentLoaded event listener or by placing your script tag at the end of your HTML body.Heres an example of using DOMContentLoaded event listener:',
  'Nice to meet you',
  'How are you?',
  'Not too bad, thanks',
  'What do you do?',
  'That\'s awesome',
  'Codepen is a nice place to stay',
  'I think you\'re a nice person',
  'Why do you think that?',
  'Can you explain?',
  'Anyway I\'ve gotta go now',
  'It was a pleasure chat with you',
  'Time to make a new codepen',
  'Bye',
  ':)'
];

// Function to update scrollbar
function updateScrollbar() {
    messagesContent.scrollTop = messagesContent.scrollHeight;
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
  updateScrollbar();
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
var loadingMessage = document.createElement('div');
loadingMessage.className = 'message loading new';
loadingMessage.innerHTML = '<figure class="avatar"><img src="/images/main-logo.svg" /></figure><span></span>';
messagesContent.appendChild(loadingMessage);
updateScrollbar();
    setTimeout(function() {
    messagesContent.querySelector('.message.loading').remove();
    var newMessage = document.createElement('div');
    newMessage.className = 'message new';
    newMessage.innerHTML = '<figure class="avatar"><img src="/images/main-logo.svg" /></figure>' + fake[i];
    messagesContent.appendChild(newMessage);
        
    updateScrollbar();
    i++;
}, 1000 + (Math.random() * 20) * 100);
}
