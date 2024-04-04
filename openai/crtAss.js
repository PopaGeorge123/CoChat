const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

// Init upload
const upload = multer();

app.use(bodyParser.raw({ limit: '100mb' })); // Adjust limit as per your file size limit

app.post('/upload', upload.single('file'), async (req, res) => {
    console.log(req.file);
    try{
        const fileContents = req.file.buffer;
        console.log("FILE : ",fileContents)

        const file = await openai.files.create({
            file: fileContents,
            purpose: "assistants",
        });
              
        const assistant = await openai.beta.assistants.create({
            instructions: "You are a personal assistant.You will answerar kindly based on the content of file uploaded.",
            model: "gpt-3.5-turbo",
            tools: [{"type": "code_interpreter"}],
            file_ids: [file.id]
        });

        
        res.status(200).json({ message: 'File processed successfully by ChatGPT' });
    } catch (error) {
        console.error('Error processing file with ChatGPT:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
