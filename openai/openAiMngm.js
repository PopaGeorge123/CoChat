const fileHandler = require('../files/savedel')

const OpenAI = require('openai');
const API_KEY = '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'
const openai = new OpenAI({apiKey: API_KEY});

//FILES
const fs = require('fs')

const OWN_INSTRUCTUIN = 'I want you to act as a support agent. Your name is "AI Assistant". You will provide me with answers from the given info. If the answer is not included, say exactly "Hmm, I am not sure." and stop after that. Refuse to answer any question not about the info. Never break character.'
 
async function createFile(file){
  const fl = await openai.files.create({
    file: fs.createReadStream(file),
    purpose: "assistants",
  });

  return fl
}
 
async function createNewAssistant(name){
    const myAssistant = await openai.beta.assistants.create({
        name : name,
        tools: [{ type: "code_interpreter" }],
        model: "gpt-3.5-turbo",
    });
    return myAssistant
}

async function uploadFilesToOpenAi(files){
    try{
        const filesCreated = []
        files.forEach(async (element, index) => {
            const path = await fileHandler.saveFile(element.buffer, element.originalname ,'/tempFiles')
            const createdFile = await createFile(path)
            await fileHandler.deleteFile(path)
            filesCreated.push(createdFile)
        });

        return filesCreated

    }catch(err){
        console.error(err)
    }
}

async function updatedAssistant(id, data){
    try{
        const myUpdatedAssistant = await openai.beta.assistants.update(id , data);
        return myUpdatedAssistant
    }catch(err){
        console.error(err)
    }
}


module.exports = {
    createNewAssistant,
    uploadFilesToOpenAi,
    updatedAssistant,
}




