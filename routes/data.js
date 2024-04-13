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

  console.log(prompt)

  if(prompt === undefined || asst === undefined){
    res.send(400)
  }else{
    console.log('ASST : ',asst)
    console.log('Q : ',prompt)
    
    const assistant_response = await aiMngm.askAsst(asst , prompt)

    // Test Response
    // const assistant_response = [
    //     'Modern rackets have facilitated a number of advancements in various sports, notably tennis and badminton. Some of the key benefits that modern rackets have provided include: 1. $Power and Control$: Modern rackets are designed to provide players with a balance of power and control. They are engineered to maximize the speed and force of the players shots while maintaining accuracy and precision. 2. $Lightweight Design$: Modern rackets are typically lighter in weight compared to older rackets. This allows players to maneuver the racket more easily and swiftly during gameplay. 3. $Improved Materials$: Modern rackets are often made from advanced materials such as graphite, carbon fiber, and aluminum. These materials are lightweight, durable, and offer excellent shock absorption, providing players with a more comfortable playing experience. 4. $Enhanced Performance$: The design and technology used in modern rackets help players improve their performance on the court. Rackets are engineered to reduce vibrations, increase stability, and optimize power transfer from the player to the ball. 5. $Reduced Risk of Injury$: Modern rackets are designed to help reduce the risk of injuries by minimizing the impact of shock and vibration on players arms and wrists. This can help prevent overuse injuries and strain on the players body. Overall, modern rackets have revolutionized the way sports like tennis and badminton are played, allowing players to hit harder, more accurately, and with greater control than ever before.'
    // ]
    res.json({
      asst_resp : assistant_response
    })
  }
})


router.use('/assistant',ensureAuthenticated, require('./assistant'))

module.exports = router;




