const OpenAI = require('openai');
const API_KEY = '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'
const openai = new OpenAI({apiKey: API_KEY});

//FILES
const fs = require('fs')


const OWN_INSTRUCTUIN = 'I want you to act as a support agent. Your name is "AI Assistant". You will provide me with answers from the given info. If the answer is not included, say exactly "Hmm, I am not sure." and stop after that. Refuse to answer any question not about the info. Never break character.'


async function askAsst(asst,prompt){
  try{
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(
      thread.id,
      {
        role: "user",
        content: prompt
      }
    );
    let run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      { 
        assistant_id: asst,
      }
    );

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(
        run.thread_id
      );
      for (const message of messages.data.reverse()) {
        if(message.role === 'assistant'){
          return message.content[0].text.value
        }
      }
    }
  }catch(err){
      console.error(err)
  }
}

const asst = 'asst_eH5ET1omBJiI8djA3qojOFn1'

console.log(await askAsst(asst,"Cum obtin un api Key"));