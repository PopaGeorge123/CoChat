const OpenAI = require('openai');
const API_KEY = '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'
const openai = new OpenAI({apiKey: API_KEY});

//FILES
const fs = require('fs')

const OWN_INSTRUCTUIN = 'I want you to act as a support agent. Your name is "AI Assistant". You will provide me with answers from the given info. If the answer is not included, say exactly "Hmm, I am not sure." and stop after that. Refuse to answer any question not about the info. Never break character.'
 
async function buildAssistant(file){

  const botInstructions = await openai.files.create({
    file: fs.createReadStream(file),
    purpose: "assistants",
  });
    
    // Create an assistant using the file ID
  const assistant = await openai.beta.assistants.create({
    instructions: OWN_INSTRUCTUIN ,
    model: "gpt-3.5-turbo",
    tools: [{"type": "code_interpreter"}],
    file_ids: [botInstructions.id]
  });

  return assistant
}

module.exports = {
  buildAssistant
}