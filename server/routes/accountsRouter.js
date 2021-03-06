/**
 * Accounts API Routes
 */

const express = require('express');
const router = express.Router();
const nem = require('nem-sdk').default;

// ACCOUNTS CRUDE

// Pull all the accounts
router.get('/', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT a.*, c.* FROM bank.account a INNER JOIN customer_account b ON a.account_id = b.account_id  INNER JOIN customer c ON b.customer_id = c.customer_id', (err, rows, fields) => {
            if(err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        })
    })
});

// Pull the information of the specific account
router.get('/:id', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT a.*, c.* FROM bank.account a INNER JOIN customer_account b ON a.account_id = b.account_id  INNER JOIN customer c ON b.customer_id = c.customer_id WHERE a.account_id =' + req.params.id, (err, rows, fields) => {
            if(err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        })
    })
});

// Display the balance of a specific account
router.post('/balance', (req, res) => {
    console.log("Display balance API.");
    var getForm = {
        account_idx: req.body.account_id,
        type_id: req.body.type_id,
        contactno: req.body.contactno
    }
    
    req.getConnection((error, conn) => {
        conn.query('SELECT a.addressKey, c.name FROM account a INNER JOIN customer_account b ON a.account_id = b.account_id INNER JOIN customer c ON b.customer_id = c.customer_id WHERE a.account_id = ? AND a.type_id = ? AND c.contactno = ?', [getForm.account_idx, getForm.type_id, getForm.contactno], (err, rows, fields) => {
            if(err) {
                res.send(`Error SQL Query. ${err}`);
            } else {
                console.log(rows);
                var addressKey = rows[0].addressKey;
                console.log(addressKey);

                var endpoint = nem.model.objects.create('endpoint')(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
                var getResponse = nem.com.requests.account.data(endpoint, addressKey).then(
                    function(response){
                        var iBalance = response.account.balance;
                        var fmt = nem.utils.format.nemValue(iBalance);
                        var tBalance = fmt[0] + "." + fmt[1];
                        var balance = Math.round(tBalance*10)/10;
                        var pesoValue = Math.round(balance*0.0945*52.73);
                        console.log(pesoValue)
                        var response1 = {
                            name: JSON.stringify(rows[0].name),
                            balance: pesoValue
                        }
                        res.render("displaybalance",{name: response1.name, balance: response1.balance});
                    },
                    function(err){
                        console.log(err);
                    });
            }
        })
    })
})

// Add an account
router.post('/:id', (req, res) => {
    // yung id na kinukuha dun sa parameter is yung customer_id. Not the account_id.
    // create new account

    let rb32 = nem.crypto.nacl.randomBytes(32);
    let pkey = nem.utils.convert.ua2hex(rb32);

    let keyPair = nem.crypto.keyPair.create(pkey);

    let nemAddress = nem.utils.format.pubToAddress(
        keyPair.publicKey.toString(),
        -104
    );
    console.log("keypair public: " + keyPair.publicKey.toString());
    console.log("address: " + nemAddress);

    var account = {
        type_id: req.body.type_id,
        balance: req.body.balance,
        interest_rate: req.body.interest_rate,
        overdraft: req.body.overdraft,
        keyPair: keyPair.publicKey.toString(),
        addressKey: nemAddress
    }

    var customer_id = req.params.id;

    req.getConnection((error, conn) => {
        conn.query('INSERT INTO account SET ?', account, (err, rows, fields) => {
            if(err) {
                res.send(err);
            } else {
                var accountid = JSON.stringify(rows.insertId);
                var customer_account = {
                    customer_id: req.params.id,
                    account_id: accountid
                }
                conn.query('INSERT INTO customer_account SET ?', customer_account, (err, rows, fields) => {
                    if(err) {
                        res.send(err);
                    } else {
                        res.send(rows);
                    }
                })
            }
        })
    })
})


// Edit an account
router.put('/:id', (req, res) => {
    // yung ID na kinukuha dito sa parameter na ito is yung account_id.
    // get the data from the request and insert it in the account variable.
    var account = {
        type_id: req.body.type_id,
        balance: req.body.balance,
        interest_rate: req.body.interest_rate,
        overdraft: req.body.overdraft
    }

    req.getConnection((error, conn) => {
        conn.query('UPDATE account SET ? WHERE account_id = ' + req.params.id, account, (err, result) => {
            if(err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
    })
})

// Delete an account - just in case kung meron
router.delete('/:id', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('DELETE FROM account WHERE account_id = ' + req.params.id, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
    })
})

module.exports = router;