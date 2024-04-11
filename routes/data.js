const multer = require('multer');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const aiMngm = require('../openai/openAiMngm')

const FileManager = require('../files/fileMngm')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const DB = require('../db/dbMngm')

const genQuestionId = () => crypto.randomBytes(20).toString('hex');
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

router.get('/query', async (req, res)=>{
  const { prompt } = req.query
  const { asst } = req.query

  if(prompt === undefined || asst === undefined){
    res.send(400)
  }else{
    console.log('ASST : ',asst)
    console.log('Q : ',prompt)
    

    const asst_resp = await aiMngm.askAsst(asst , prompt)

    res.json({
      asst_resp:asst_resp
    })
  }
})

router.use('/assistant',ensureAuthenticated, require('./assistant'))

module.exports = router;




