var messagesContent = document.getElementById('messages-content');
var messageInput = document.getElementById('message-input');
var messageSubmit = document.getElementById('message-submit');
var windowEvent = window.addEventListener;
var messageArea = document.querySelector('.messages')

const asstId = 'asst_xYf7KoeoZOtL2FNVA6OoEz1f';

function updateScrollbar() {
  // setTimeout(function(){
  //   messageArea.scrollTop = messageArea.scrollHeight;
  //   console.log('RUNNED')
  // },2000)
  messageArea.scrollTop = messageArea.scrollHeight; 
}

// Function to insert message
async function insertMessage() {
  var prompt = messageInput.value.trim();
  if (prompt === '') {
    return false;
  }
  var message = document.createElement('div');
  message.className = 'message message-personal new';
  message.textContent = prompt;
  messagesContent.appendChild(message);
  messageInput.value = null;

  displayLoadingMsg()

  fetch(`http://localhost:5000/data/query?prompt=${prompt}&asst=${asstId}`)
    .then((resp) => resp.json())
    .then((json) => {
      const res = json.asst_resp
      for(el in res){
        displayLoadingMsg()
        fakeMessage(res[el])
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

messageSubmit.addEventListener('click', function() {
  insertMessage();
  //fakeMessage()
});

// Keydown event for the window
windowEvent('keydown', function(e) {
  if (e.which === 13) {
    insertMessage();
    //fakeMessage()
    return false;
  }
});

function displayLoadingMsg(){
  var loadingMessage = document.createElement('div');
  loadingMessage.className = 'message loading new';
  loadingMessage.innerHTML = '<figure class="avatar"><img src="/images/main-logo.svg" /></figure><span></span>';
  messagesContent.appendChild(loadingMessage);

}
function fakeMessage(message) {
  if(messagesContent.querySelector('.message.loading')){
    messagesContent.querySelector('.message.loading').remove();
  }
    var newMessage = document.createElement('div');
    newMessage.className = 'message new';
    newMessage.innerHTML = '<figure class="avatar"><img src="/images/main-logo.svg" /></figure>' + message;
    messagesContent.appendChild(newMessage);
}; 

