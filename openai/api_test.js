const OpenAI = require('openai');
const API_KEY = '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'
const openai = new OpenAI({apiKey: API_KEY});

const asst_id = 'asst_7XwMW3avOkszxOoKAXKjRxj5'
const thread_id = 'thread_obbIgejydIBEa46nmLjlpCCP'
const msg_id = 'msg_GKATKksz1DXogiVRKMTz1USZ'

async function createThread() {
  const emptyThread = await openai.beta.threads.create();
  return emptyThread.id
}

async function deleteThread(thread) {
  const response = await openai.beta.threads.del(thread);
  return response.deleted
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

async function main(){
  const thread = await createThread()

  await createMessage(thread,'How many types of balls are ?');
  let run_status = await runThread(thread , asst_id)
  console.log(run_status.status)

  if (run_status.status === 'completed') {
    const thread_convo = await listMessages(thread)
    console.log("CONVERSATION : ",thread_convo)
    
    for (const message of thread_convo.reverse()) {
      if(message.role === 'assistant'){
        console.log("MESSAGE : ",message.content)
      }
    }
  }
  
  //await deleteThread(thread)
}

main()

