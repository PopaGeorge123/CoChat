const asstId = document.currentScript.getAttribute('assistant');
const baseUrl = document.currentScript.getAttribute('baseUrl');

async function loadStyleSheet() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `${baseUrl}/styles/messageBox.css`;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

async function updateChatBotStyling(top, background, bottom, messageBackground, messageTextColor) {
  const root = document.documentElement;
  root.style.setProperty('--chat-background-color', background);
  root.style.setProperty('--title-background-color', top);
  root.style.setProperty('--bottom-background-color', bottom);
  root.style.setProperty('--user-message-background-color', messageBackground);
  root.style.setProperty('--message-text-color', messageTextColor);
}

const messagesContent = document.getElementById('messages-content');
const messageInput = document.getElementById('message-input');
const messageSubmit = document.getElementById('message-submit');
const messageArea = document.querySelector('.messages');

async function GetAsstConfig() {
  try {
    const response = await fetch(`${baseUrl}/data/config?asst=${asstId}`, { mode: 'cors' });
    const json = await response.json();
    const styles = json.configuration.styles;
    console.table(styles);
    updateChatBotStyling(
      styles.top,
      styles.background,
      styles.bottom,
      styles.messageBackground,
      styles.messageTextColor
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

async function updateScrollbar() {
  await new Promise(resolve => setTimeout(resolve, 100));
  messageArea.scrollTo({
    top: messageArea.scrollHeight,
    behavior: 'smooth'
  });
}

async function insertMessage() {
  const prompt = messageInput.value.trim();
  if (prompt === '') {
    return false;
  }

  const message = document.createElement('div');
  message.className = 'message message-personal new';
  message.textContent = prompt;
  messagesContent.appendChild(message);
  messageInput.value = null;

  displayLoadingMsg();

  try {
    const response = await fetch(`${baseUrl}/data/query?prompt=${prompt}&asst=${asstId}`, { mode: 'cors' });
    const json = await response.json();
    const res = json.asst_resp;
    console.log("RESP : ", res);
    fakeMessage(res);
    hideLoadingMsg();
    await updateScrollbar();
  } catch (error) {
    hideLoadingMsg();
    console.error('Error:', error);
  }
}

// window.addEventListener('unload', async function () {
//   try {
//     const response = await fetch(`${baseUrl}/data/rmvtrd`, { mode: 'cors' });
//     const json = await response.json();
//     console.log(json);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// });

messageSubmit.addEventListener('click', async function () {
  await insertMessage();
});

window.addEventListener('keydown', async function (e) {
  if (e.which === 13) {
    await insertMessage();
    return false;
  }
});

function displayLoadingMsg() {
  const loadingMessage = document.createElement('div');
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
  const newMessage = document.createElement('div');
  newMessage.className = 'message new';
  newMessage.innerHTML = message;
  messagesContent.appendChild(newMessage);
}

// Load CSS asynchronously
loadStyleSheet()
  .then(() => {
    console.log('CSS loaded successfully');
    // Once CSS is loaded, get assistant configuration
    GetAsstConfig();
  })
  .catch(error => {
    console.error('Error loading CSS:', error);
  });
