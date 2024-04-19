const multer = require('multer');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const aiMngm = require('../openai/openAiMngm')
const cookie_mngm = require('../openai/sesionMng')

const FileManager = require('../files/fileMngm')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const DB = require('../db/dbMngm')

const genCookie = () => crypto.randomBytes(20).toString('hex');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { Assistant } = require('../models/User');

router.get('/createassistant', ensureAuthenticated ,async (req, res) =>{
  res.render('createassistant')
});

router.post('/countchars', ensureAuthenticated , upload.single('file') , async (req, res) => {
  const fileData = req.file.buffer;
  const fileName = req.file.originalname; 

  const charCount = await FileManager.getCharCount(fileData,fileName)
  res.status(200).send({
    chars:charCount
  })
  console.log(charCount)
});

router.post('/buildasst', ensureAuthenticated , upload.any(), async (req, res) => {
  try{
    const processed_files = []
    const receivedFiles = req.files
    const createdFilesIds = await aiMngm.uploadFilesToOpenAi(receivedFiles)
    const assistant = await aiMngm.createNewAssistant(req.files[0].originalname)

    const updatedAssistant = await aiMngm.updatedAssistant(assistant.id,{
      file_ids: createdFilesIds
    })
    
    const dbResp = await DB.createAssistant({
      _id: assistant.id,
      name: req.files[0].originalname,
      owner: req.user._id,
      model: assistant.model,
      status : true,
      enabled : false
    })
    const result = await DB.addAsstToUser(req.user.id, {
      name: assistant.name,
      id: assistant.id
    });

    if(dbResp){
      res.status(200).send({
      botId : assistant.id
    })
    }
  }catch(err){
    console.error(err)
  }
});

router.get('/query', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow access from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true); // Allow credentials
  next(); // Pass control to the next middleware or route handler
});
router.get('/rmvtrd', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow access from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true); // Allow credentials
  next(); // Pass control to the next middleware or route handler
});

router.get('/query', async (req, res)=>{
  const { prompt } = req.query
  const { asst } = req.query
  let chatCookie = '';

  if(!req.session.chatCookie){ //no cookie
    chatCookie = genCookie()
    req.session.chatCookie = chatCookie
  }else{
    chatCookie = req.session.chatCookie
  }

  if(prompt === undefined || asst === undefined){
    res.send(400)
  }else{
    console.log("COOKIE : ",chatCookie)
    //const assistant_response = await aiMngm.askAsst(chatCookie , asst , prompt)
    //console.log("RESP : ",assistant_response)
    // Test Response
    const assistant_response = [
       'Hmm, I am not sure. Tell me something new. I really want to hear that from you!'
    ]
    /*
    const responseArray = assistant_response.split('\n');
    const processedArray = await Promise.all(responseArray.map(async (element) => {
      let responseText = element;
      let index = responseText.indexOf('【');
      if (index !== -1) {
          responseText = responseText.substring(0, index) + '.';
      }
      return responseText;
    }));
    const processedResponse = processedArray.join('\n');
    */
    res.json({
      asst_resp : assistant_response
    })
  }
})

router.get('/rmvtrd', async (req, res) => {
  console.log("COOKIE : ", req.session.chatCookie);

  if (req.session.chatCookie == undefined) { //no cookie
    console.log("NO COOKIE");
    res.sendStatus(200);
  } else {
    console.log("HAS COOKIE");
    try {
      const status = await aiMngm.deleteThread(req.session.chatCookie);
      delete req.session.chatCookie;
      if (status) {
        console.log("Deleted Thread!");
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting thread:", error);
      res.status(500).send("Error deleting thread");
    }
  }
  console.log("COOKIE : ", req.session.chatCookie);
});


router.use('/assistant',ensureAuthenticated, require('./assistant'))

module.exports = router;




