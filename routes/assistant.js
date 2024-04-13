const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const router = express.Router();
const DB = require('../db/dbMngm')
const AI = require('../openai/openAiMngm')

// Use the subrouter for /assistants
router.get('/:id/', ensureAuthenticated, async (req, res) => {
    try{
        const assistantId = req.params.id;
        const user = req.user
      
        //posible use to get more data about the assistant
        //const AIassistant = await AI.getAssistantById(assistantId)//
        const DBassistant = await DB.getAssistantById(assistantId)//name,model,status,enabled
        
        console.log(DBassistant)
        if(user.id === DBassistant.owner){
            res.render('adjustments/assistant',{
                data: DBassistant
            })
        }else{
            res.status(401).send({
            status:'Unauthorized Access'
        })
        }
        }catch(err){
            res.redirect('/myassistants')
            console.error(err)
        }


  });

router.get('/:id/settings', ensureAuthenticated, async (req, res) => {
    const assistantId = req.params.id;

    console.log('Assistant ID:', assistantId);
    res.send(`Settings for assistant with ID ${assistantId}`);
  });


module.exports = router;
