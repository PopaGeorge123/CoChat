//IMP VARIABLES
const asstId = document.currentScript.getAttribute('assistant');
const baseUrl = document.currentScript.getAttribute('baseUrl');

var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = `${baseUrl}/styles/messageBox.css`;
document.head.appendChild(link);

var newDiv = document.createElement('div');
newDiv.style.display = 'none';
newDiv.innerHTML = `
  <div class="background-wise-div" id="background-wise-div">
    <div class="main-wise-chat-div" id="main-wise-chat-div">
      <div class="chat">
        <div class="chat-title">
          <h1>ALFRED</h1>
          <h2>Active</h2>
          <figure class="avatar">
            <img src="/images/main-logo.svg" draggable="false"/>
          </figure>
        </div>
        <div class="messages">
          <div id="messages-content" class="messages-content"></div>
        </div>
        <div class="message-box">
          <textarea type="text" id="message-input" class="message-input" placeholder="Ask me anything..."></textarea>
          <button type="submit" id="message-submit" class="message-submit">
            <svg width="30" viewBox="0 0 24 24" fill="none">
              <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>
      </div>
      <a href="${baseUrl}" class="WiseSup-company">Powered by WiseSupp</a>
    </div>
    <div class="chat-icon" id="chat-icon-button">
      <img width="100%" src="/images/main-logo.svg" draggable="false" alt="show chat icon">
    </div>
  </div>
`;
document.body.appendChild(newDiv);
newDiv.style.display = 'block';

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

ChatButton.addEventListener('click',function(){
    if(activated_button){ //hide chat
        ChatButton.classList.remove('chat-button-activated') 
        
        MessageBox.classList.add('deactivate-message-content')
        MessageBox.classList.remove('activate-message-content')
        setTimeout(function(){
            MessageBox.style.display = 'none'
        },700)
    }else{ //display chat
        ChatButton.classList.add('chat-button-activated')

        MessageBox.style.display = 'block'
        MessageBox.classList.add('activate-message-content')
        MessageBox.classList.remove('deactivate-message-content')
    }
    activated_button = !activated_button
    //alert("1")
    
})
ChatButton.addEventListener('mouseover',function(){
    //alert("1")
})

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
