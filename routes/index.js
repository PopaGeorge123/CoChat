const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('Welcome'));

// My Bots
router.get('/myassistants', ensureAuthenticated, (req, res) =>{
  res.render('myassistants',{
    assistants : req.user.assistants
  })
});

module.exports = router;