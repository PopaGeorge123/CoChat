const OpenAI = require('openai');
const API_KEY = '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'
const openai = new OpenAI({apiKey: API_KEY});

//FILES
const fs = require('fs')
const app = express();
const port = 5000;
//const OWN_INSTRUCTUIN = 'I want you to act as a support agent. Your name is "AI Assistant". You will provide me with answers from the given info. If the answer is not included, say exactly "Hmm, I am not sure." and stop after that. Refuse to answer any question not about the info. Never break character.'


app.get('/data',async (req,res)=>{
  res.render('adjustments/assistant')
})

app.get('/data/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const asstId = req.query.asst;
  const prompt = req.query.prompt;

  // Create a run with streaming
  const run = openai.beta.threads.runs.stream(asstId, {
    assistant_id: asstId
  })
    .on('textCreated', (text) => {
      // Send assistant response to the client
      res.write(`data: ${JSON.stringify({ asst_resp: text.value })}\n\n`);
    })
    .on('error', (error) => {
      console.error('OpenAI Error:', error);
      res.end();
    });

  // Close the connection when the client disconnects
  req.on('close', () => {
    run.stop();
    res.end();
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});