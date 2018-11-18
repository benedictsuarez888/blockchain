/**
 * Index Routers
 */

const express = require('express');
const router = express.Router();
const nem = require('nem-sdk').default;

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

router.get('/accounts', (req, res) => {
	res.render("accounts")
})

router.get('/get_account_data', (req, res) => {
	var endpoint = nem.model.objects.create('endpoint')(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
	var data = nem.com.requests.account.data(endpoint, "TBMF2SXVZJ7RXQVRIF7MTPNHEDMJTEXTMGD3VZAL").then(
		function(res){
			var iBalance = res.account.balance;
			var fmt = nem.utils.format.nemValue(iBalance);
			var tBalance = fmt[0] + "." + fmt[1];
			var balance = Math.round(tBalance*10)/10;
			console.log(balance*0.0945*52.73);
		},
		function(err){
			console.log(err);
		});
})

module.exports = router;