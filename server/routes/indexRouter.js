/**
 * Index Routers
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("login.pug")
})

router.get('/register', (req, res) => {
    res.render("register.pug")
})

router.get('/openacct/:id', (req, res) => {
    res.render("openacct")
})

router.get('/customers', (req, res) => {
    res.render("customers")
})

module.exports = router;