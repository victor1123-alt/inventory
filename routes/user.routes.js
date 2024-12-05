const express = require('express');
const { getlogin, login, Singup,requestaccount } = require('../controllers/users.controller');
const router = express.Router()

router.get('/login', getlogin);
router.post('/login',login)
router.post('/signup',Singup);
router.get('/requestaccount',requestaccount)
module.exports = router;