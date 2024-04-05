const OpenAI = require('openai');
const API_KEY = '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'
const openai = new OpenAI({apiKey: API_KEY});

//FILES
const fs = require('fs')

const OWN_INSTRUCTUIN = 'I want you to act as a support agent. Your name is "AI Assistant". You will provide me with answers from the given info. If the answer is not included, say exactly "Hmm, I am not sure." and stop after that. Refuse to answer any question not about the info. Never break character.'


async function main() {
    const myAssistant = await openai.beta.assistants.retrieve(
      "asst_VGFN8ngB94nn1mQXTkCFW534"
    );
  
    console.log(myAssistant);
  }
  
  main();