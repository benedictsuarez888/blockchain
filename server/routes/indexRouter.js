/**
 * Index Routers
 */

const express = require('express');
const router = express.Router();

router.get('/index', (req, res) => {
    res.render('register.pug');
})

module.exports = router;