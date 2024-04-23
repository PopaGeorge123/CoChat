const fileHandler = require('../files/savedel')
const cookie_mngm = require('./sesionMng')

const OpenAI = require('openai');
const API_KEY = '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'
const openai = new OpenAI({apiKey: API_KEY});

//FILES
const fs = require('fs')

const BASE_INSTRUCTUIN = 'I want you to act as a support agent. Your name is "AI Assistant". You will provide me with answers from the given info. If the answer is not included, say exactly "Hmm, I am not sure." and stop after that. Refuse to answer any question not about the info. Never break character.'
 
async function createThread() {
  const emptyThread = await openai.beta.threads.create();
  return emptyThread.id
}

async function deleteThread(cookie) {
  const dataFromArray = await cookie_mngm.getUserByCookie(cookie)
  const array = await cookie_mngm.deleteUserByCookie(cookie)
  const response = await openai.beta.threads.del(dataFromArray.user.thread);
  return array && response.deleted
}

async function createMessage(thread , message) {
  const threadMessages = await openai.beta.threads.messages.create(
    thread,
    { role: "user", content: message }
  );
  //console.log(threadMessages.content)
}

async function runThread(thread , asst) {
  const run = await openai.beta.threads.runs.createAndPoll(
    thread,
    { assistant_id: asst }
  );
  return run
  //console.log(run);
}

async function listMessages(thread) {
  const threadMessages = await openai.beta.threads.messages.list(thread);
  return threadMessages.data;
}


async function createFile(file){
  const fl = await openai.files.create({
    file: fs.createReadStream(file),
    purpose: "assistants",
  });

  return fl
}
 
async function createNewAssistant(name){
    const myAssistant = await openai.beta.assistants.create({
        instructions:BASE_INSTRUCTUIN,
        name : name,
        tools: [{ type: "code_interpreter" },{ type: "retrieval" }],
        model: "gpt-3.5-turbo",
    });
    return myAssistant
}

async function uploadFilesToOpenAi(files,option){
  switch (option){
    case 1:
      try{
        const filesCreated = await Promise.all(files.map(async (element, index) => {
            const path = await fileHandler.saveFile(element.buffer, element.originalname ,'/tempFiles');
            const createdFile = await createFile(path);
            await fileHandler.deleteFile(path);
            return createdFile.id;
        }));

        console.log(filesCreated);
        return filesCreated;
      } catch(err) {
          console.error(err);
      }
    break;
    case 2:
      try{
        const fileName = `knowledge_${Date.now()}.txt`;
        const path = await fileHandler.saveFile(files, fileName ,'/tempFiles');
        const createdFile = await createFile(path);
        await fileHandler.deleteFile(path);
        return [fileName , createdFile.id,];
      }catch(err) {
        console.error(err);
      }
    break;
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

async function getAssistantById(id){
    try{
        const myAssistant = await openai.beta.assistants.retrieve(id);
        return myAssistant
    }catch(err){
        console.error(err)
        return false
    }
}

async function askAsst(cookie,asst,prompt){
  //console.log("ARRAY : ",await cookie_mngm.cookieArray())
  const storage = await cookie_mngm.getUserByCookie(cookie)
    try{//cookie exists
      if(storage != undefined){
        const asst_resp = [];
        const saved_user = await cookie_mngm.getUserByCookie(cookie)
        await createMessage(saved_user.user.thread, prompt);
        let run_status = await runThread(saved_user.user.thread , asst)
        
        if (run_status.status === 'completed') {
          const thread_convo = await listMessages(saved_user.user.thread)
          for (const message in thread_convo.reverse()) {
            if(thread_convo[message].role === 'assistant'){
              for(index in thread_convo[message].content){
                asst_resp.push(thread_convo[message].content[index].text.value)
              }
            }
          }
        }
        return asst_resp[asst_resp.length-1]

      }else{//cookie doesn't exist
        const asst_resp = [];
        const thread = await createThread()
        await cookie_mngm.setCookie(cookie,thread)
        await createMessage(thread , prompt);
        let run_status = await runThread(thread , asst)

          if (run_status.status === 'completed') {
            const thread_convo = await listMessages(thread)
            for (const message in thread_convo.reverse()) {
              if(thread_convo[message].role === 'assistant'){
                for(index in thread_convo[message].content){
                  asst_resp.push(thread_convo[message].content[index].text.value)
                }
              }
            }
          }
          return asst_resp[asst_resp.length-1]
      }
        
    }catch(err){
        console.error(err)
    }
}

module.exports = {
  createNewAssistant,
  uploadFilesToOpenAi,
  deleteThread,
  updatedAssistant,
  getAssistantById,
  askAsst
}




