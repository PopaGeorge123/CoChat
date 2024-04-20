//IMP VARIABLES
const asstId = document.currentScript.getAttribute('assistant');
const baseUrl = document.currentScript.getAttribute('baseUrl');

// var link = document.createElement('link');
// link.rel = 'stylesheet';
// link.type = 'text/css';
// link.href = `${baseUrl}/styles/messageBox.css`;
// document.head.appendChild(link);

function updateChatBotStyling(top, background, bottom, messageBackground, messageTextColor) {
  const root = document.documentElement;
  root.style.setProperty('--chat-background-color', background);
  root.style.setProperty('--title-background-color', top);
  root.style.setProperty('--bottom-background-color', bottom);
  root.style.setProperty('--user-message-background-color', messageBackground);
  root.style.setProperty('--message-text-color', messageTextColor);
}

var messagesContent = document.getElementById('messages-content');
var messageInput = document.getElementById('message-input');
var messageSubmit = document.getElementById('message-submit');
var windowEvent = window.addEventListener;
var messageArea = document.querySelector('.messages');

var ChatButton = document.getElementById('chat-icon-button')
var MessageBox = document.getElementById('main-wise-chat-div')
var activated_button = false

async function GetAsstConfig(){
  try {
    const response = await fetch(`${baseUrl}/data/config?asst=${asstId}`,{mode: 'cors'});
    const json = await response.json();

    const styles = json.configuration.styles
    console.table(styles)
    updateChatBotStyling(
      styles.top,
      styles.background,
      styles.bottom,
      styles.messageBackground,
      styles.messageTextColor
    )
    
  } catch (error) {
    console.error('Error:', error);
  }
}
GetAsstConfig()

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
    const response = await fetch(`${baseUrl}/data/query?prompt=${prompt}&asst=${asstId}`,{mode: 'cors'});
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
  loadingMessage.innerHTML = '<span></span>';
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
  newMessage.innerHTML = message;
  messagesContent.appendChild(newMessage);
};
