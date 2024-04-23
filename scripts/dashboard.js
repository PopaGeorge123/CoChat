
let importOption = ['chat_logs_data','new_customers_data','website_views_data']
let inputTypes = ['chat_logs_sub','new_customers_sub','website_views_sub']
let selectIcons = ['bb','dd','ff','hh']
let unselectIcons = ['aa','cc','ee','gg']

let chosed_option = 1

let UserSelectedFiles = []
let uploadedFilesDiv = document.getElementById('uploaded-files-div-id')

let fileCountDisplay = document.getElementById('file-count-display')
let totalCharCountDisplay = document.getElementById('total-char-count-display')


function runWorkingAnim() {
  let progressBar = document.getElementById('create-progress-bar');
  progressBar.style.display = 'block';

  let i = 1;
  let interval = setInterval(function() {
    progressBar.style.width = i + "%";
    i++;
    if (i > 99) {
      clearInterval(interval);
    }
  }, 200);
}



async function updateSelectedFiles(){
  uploadedFilesDiv.innerHTML = "" //clear files
  let charTotalCount = 0

  for(file in UserSelectedFiles){
    let resp = await getCharsOfFile(UserSelectedFiles[file])
    charTotalCount = charTotalCount + resp.chars

    uploadedFilesDiv.innerHTML += `<div class="selected-file-item" id="${file}">
                                  <h5>${UserSelectedFiles[file].name.length>20?UserSelectedFiles[file].name.substring(0, 10)+'...':UserSelectedFiles[file].name} <span class="text-char-count">(${resp.chars} chars)</span></h5> 
                                  <svg onclick="deleteUploadedFile(${file})" width="25" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style>.cls-1{fill:#ff3c00;}.cls-2{fill:#ffffff;}</style> </defs> <title></title> <g id="fill"> <path class="cls-1" d="M27.35,8.49h-5s0-.08,0-.12a6.37,6.37,0,0,0-12.74,0s0,.08,0,.12h-5a1,1,0,1,0,0,1.93h2.7V26.14A3.86,3.86,0,0,0,11.21,30h9.58a3.86,3.86,0,0,0,3.86-3.86V10.42h2.7a1,1,0,1,0,0-1.93ZM11.56,8.37a4.44,4.44,0,0,1,8.88,0s0,.08,0,.12H11.54S11.56,8.41,11.56,8.37Z"></path> <path class="cls-2" d="M12.76,25a1,1,0,0,1-1-1V15.4a1,1,0,0,1,1.93,0v8.65A1,1,0,0,1,12.76,25Z"></path> <path class="cls-2" d="M19.24,25a1,1,0,0,1-1-1V15.4a1,1,0,0,1,1.93,0v8.65A1,1,0,0,1,19.24,25Z"></path> </g> </g>
                                  </svg>
                                </div>`
  }

  fileCountDisplay.innerText = UserSelectedFiles.length + (UserSelectedFiles.length > 1?' Files ':' File ') + '(' + charTotalCount + ' chars)'
  totalCharCountDisplay.innerText = charTotalCount + ' / 400,000 limit'
}

function deleteUploadedFile(index){
  UserSelectedFiles.splice(index,1)
  console.log(UserSelectedFiles)
  updateSelectedFiles()
}

clearInputArea(chosed_option)

function setOption(optionNumber){
  console.log("Chosed Option : ",chosed_option)
    chosed_option = optionNumber
    clearInputArea()
    clearInputArea(optionNumber)
}


function clearInputArea(skp){
    if(skp == undefined){
        for(var id in inputTypes){
            document.getElementById(inputTypes[id]).style.display = 'none';
            document.getElementById(importOption[id]).style.background = 'white';
            document.getElementById(unselectIcons[id]).style.display = 'block';
            document.getElementById(selectIcons[id]).style.display = 'none';
            document.getElementById(importOption[id]).style.color = 'black';
        }
    }else{
        clearInputArea()
        document.getElementById(inputTypes[skp-1]).style.display = 'block';
        document.getElementById(importOption[skp-1]).style.background = '#F4F4F4';
        document.getElementById(selectIcons[skp-1]).style.display = 'block';
        document.getElementById(unselectIcons[skp-1]).style.display = 'none';
        document.getElementById(importOption[skp-1]).style.color = '#3ECD87';
    }
}

const textarea = document.getElementById('textarea-input');
const charCount = document.getElementById('char-count-text-input');

textarea.addEventListener('input', () => {
  const text = textarea.value;
  const numberOfCharacters = text.length;
  charCount.textContent = numberOfCharacters + ' characters';
});




const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('fileInput');

//effect when hover with file
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drop-zone--over');
});

//left the dragged file
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drop-zone--over');
});

//listen for
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drop-zone--over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      handleFileUpload(files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  });

  function handleFileUpload(file) {
    UserSelectedFiles.push(file)
    updateSelectedFiles()
  }

  async function getCharsOfFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/data/countchars', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            // Handle HTTP error status
            console.error('File upload failed');
            return null; // Or return an error message
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error uploading file:', error);
        return null; // Or return an error message
    }
}


async function executeCreateBot(){

  switch(chosed_option){
    case 1 : 
        if (UserSelectedFiles.length === 0) {
          alert('Please select at least one file.');
          return;
        }
        const formData = new FormData();
        runWorkingAnim()

        for (let i = 0; i < UserSelectedFiles.length; i++) {
          formData.append('files', UserSelectedFiles[i]);
        }
        try {
          const response = await fetch('/data/buildasstfile', {
              method: 'POST',
              body: formData
          });
          if (response.ok) {
              const responseData = await response.json();
              location.href = `/data/assistant/${responseData.botId}`
          } else {
            console.error('File upload failed');
            return null;
          }
      } catch (error) {
          console.error('Error uploading file:', error);
          return null; 
      }
    break;
    case 2 : 
          if (textarea.value.length === 0) {
            alert('Please write some instructions!');
            return;
          }
          runWorkingAnim()
          try {
            const response = await fetch('/data/buildassttext', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ text: textarea.value })
            });
            if (response.ok) {
                const responseData = await response.json();
                location.href = `/data/assistant/${responseData.botId}`
            } else {
              console.error('File upload failed');
              return null;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            return null; 
        }

    break;
    case 3 : 

    break;
    case 4 : 

    break;
  }
}