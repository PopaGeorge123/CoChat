const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const router = express.Router();
const DB = require('../db/dbMngm')

// Use the subrouter for /assistants
router.get('/:id/', ensureAuthenticated, async (req, res) => {
    try{
        const assistantId = req.params.id;
        const user = req.user
      
        const assistant = await DB.getAssistantById(assistantId)
        console.log(assistant)
        if(user.id === assistant[0].owner){
            res.render('adjustments/assistant')
        }else{
            res.status(401).send({
            status:'Unauthorized Access'
        })
        }
        }catch(err){
            res.redirect('/mybots')
            console.error(err)
        }


  });

router.get('/:id/settings', ensureAuthenticated, async (req, res) => {
    const assistantId = req.params.id;

    console.log('Assistant ID:', assistantId);
    res.send(`Settings for assistant with ID ${assistantId}`);
  });


module.exports = router;
