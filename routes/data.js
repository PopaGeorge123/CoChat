const multer = require('multer');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const aiMngm = require('../openai/openAiMngm')

const FileManager = require('../files/fileMngm')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//DB
const DB = require('../db/dbMngm')


const genQuestionId = () => crypto.randomBytes(20).toString('hex');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { Assistant } = require('../models/User');

router.get('/createbot', ensureAuthenticated ,async (req, res) =>{
  res.render('createchatbot')
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

router.post('/buildbot', ensureAuthenticated , upload.any(), async (req, res) => {
  try{
    const receivedFiles = req.files
    console.log("REQ FILES : ",receivedFiles)

    const createdFilesIds = await aiMngm.createFilesToOpenAI(receivedFiles)
    console.log("CREATED : ",createdFilesIds)
    
    // const fileData = req.files[0].buffer;
    // const fileName = req.files[0].originalname;
    //console.log(fileData)
    //console.log(fileName)

    //const buildbot = await aiMngm.buildAssistantWithFiles( fileName , fileData )
    // const dbAddAssistant = await DB.addAssistantToUser(req.user._id ,{
    //   name:fileName,
    //   id:buildbot.id
    // })
    
    // const dbResp = await DB.createAssistant(
    //   buildbot.id , 
    //   fileName , 
    //   req.user._id ,
    //   buildbot.model,
    //   true,
    //   false
    //   )

    // if(dbResp){
    //   res.status(200).send({
    //     botId : buildbot.id
    //   })
    // }
  }catch(err){
    console.error(err)
  }
});

router.use('/assistant',ensureAuthenticated, require('./assistant'))

module.exports = router;




