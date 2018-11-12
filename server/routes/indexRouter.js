/**
 * Index Routers
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("login.pug")
})

router.get('/index', (req, res) => {
    res.render("register.pug")
})

module.exports = router;