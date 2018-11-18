/**
 * Index Routers
 */

const express = require('express');
const router = express.Router();
const nem = require('nem-sdk').default;

/**
 * Users Routers
 */
router.get('/', (req, res) => {
    res.render("login.pug")
})

// router.get('/home', (req, res) => {
// 	res.render("home.pug")
// })

router.get('/register', (req, res) => {
    res.render("register.pug")
})

router.get('/openacct/:id', (req, res) => {
    res.render("openacct.pug")
})

router.get('/customers', (req, res) => {
    res.render("customers.pug")
})

router.get('/accounts', (req, res) => {
	res.render("accounts.pug")
})

router.get('/balance', (req, res) => {
	res.render("balance.pug");
}) 

router.get('/displaybalance', (req, res) => {
	res.render("displaybalance.pug");
})

/**
 * Admin Routers
 */

router.get('/admin/login', (req, res) => {
	res.render("loginadmin.pug")
})

// router.get('/get_account_data', (req, res) => {
// 	var endpoint = nem.model.objects.create('endpoint')(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
// 	var data = nem.com.requests.account.data(endpoint, "TBMF2SXVZJ7RXQVRIF7MTPNHEDMJTEXTMGD3VZAL").then(
// 		function(res){
// 			var iBalance = res.account.balance;
// 			var fmt = nem.utils.format.nemValue(iBalance);
// 			var tBalance = fmt[0] + "." + fmt[1];
// 			var balance = Math.round(tBalance*10)/10;
// 			console.log(balance*0.0945*52.73);
// 		},
// 		function(err){
// 			console.log(err);
// 		});
// })



module.exports = router;