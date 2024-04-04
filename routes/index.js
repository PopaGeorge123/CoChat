const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('Welcome'));

// My Bots
router.get('/mybots', ensureAuthenticated, (req, res) =>{
  res.render('mybots',{
    ChatBots : req.user.ChatBots
  })
});

module.exports = router;