var messagesContent = document.getElementById('messages-content');
var messageInput = document.getElementById('message-input');
var messageSubmit = document.getElementById('message-submit');
var windowEvent = window.addEventListener;
var messageArea = document.querySelector('.messages');

const asstId = window.variables.asstId;

function updateScrollbar() {
  setTimeout(() => {
    messageArea.scrollTo({
      top: messageArea.scrollHeight,
      behavior: 'smooth'
    });
  }, 100); // Delay the scroll operation to ensure new message is rendered
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

  displayLoadingMsg();

  try {
    const response = await fetch(`http://localhost:5000/data/query?prompt=${prompt}&asst=${asstId}`);
    const json = await response.json();
    const res = json.asst_resp;
    console.log("RESP : ",res)
    // for (el of res) {
    //   // Detect and highlight text between $ symbols
    //   //const highlightedText = res[el].replace(/\$([^$]+?)\$/g, '<span class="highlighted-content-response">$1</span>');
    //   console.log(el)
      
    // }
    fakeMessage(res);
    hideLoadingMsg();
    updateScrollbar(); // Move the scroll update here
  } catch (error) {
    hideLoadingMsg();
    console.error('Error:', error);
  }
}

window.addEventListener('unload', function () {
  console.log('EXECUTED')
  // Execute the fetch function here
  fetch('http://localhost:5000/data/rmvtrd')
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error('Network response was not ok.');
      })
      .then(data => {
          // Process the fetched data
          console.log(data);
      })
      .catch(error => {
          // Handle errors
          console.error('Error fetching data:', error);
      });
});

messageSubmit.addEventListener('click', async function() {
  await insertMessage();
});

// Keydown event for the window
windowEvent('keydown', async function(e) {
  if (e.which === 13) {
    await insertMessage();
    //fakeMessage()
    return false;
  }
});

function displayLoadingMsg() {
  var loadingMessage = document.createElement('div');
  loadingMessage.className = 'message loading new';
  loadingMessage.innerHTML = '<figure class="avatar"><img src="/images/main-logo.svg" /></figure><span></span>';
  messagesContent.appendChild(loadingMessage);
}

function hideLoadingMsg() {
  const loadingMsg = messagesContent.querySelector('.message.loading');
  if (loadingMsg) {
    loadingMsg.remove();
  }
}

async function fakeMessage(message) {
  var newMessage = document.createElement('div');
  newMessage.className = 'message new';
  newMessage.innerHTML = '<figure class="avatar"><img src="/images/main-logo.svg" /></figure>' + message;
  messagesContent.appendChild(newMessage);
};
