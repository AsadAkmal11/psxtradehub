const express = require('express');
const router = express.Router();
const  tradeChat  = require('../controllers/tradechat.controller');

router.post('/trade-chat', tradeChat.tradeChat);

module.exports = router; 