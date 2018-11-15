/**
 * Transactions API Routes
 */

const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'sampler098@gmail.com',
    pass: 'ABCabc123321'
  },
  tls: {
    rejectUnauthorized: false
  }
});
const puretext = require('puretext');
require('request');
const nem = require('nem-sdk').default;

// TRANSACTIONS CRUDE

// Get all the transactions
router.get('/', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT b.*, a.*, d.* FROM account a INNER JOIN transaction b ON a.account_id = b.account_idx INNER JOIN customer_account c ON b.account_idx = c.account_id INNER JOIN customer d ON c.customer_id = d.customer_id', (err, rows, fields) => {
            if(err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        })
    })
});

// Get a specific transaction info
router.get('/:id', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT b.*, a.*, d.* FROM account a INNER JOIN transaction b ON a.account_id = b.account_idx INNER JOIN customer_account c ON b.account_idx = c.account_id INNER JOIN customer d ON c.customer_id = d.customer_id WHERE d.customer_id = ' + req.params.id, (err, rows, fields) => {
            if(err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        })
    })
})

// Get all the transactions info of the customer
router.get('/customer/:id', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT a.*, c.* FROM transaction a INNER JOIN customer_account b ON a.account_idx = b.account_id INNER JOIN customer c ON b.customer_id = c.customer_id WHERE c.customer_id = ' + req.params.id, (err, rows, fields) => {
            if (err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        })
    })
})

// Add a transaction
router.post('/:id', (req, res) => {
    // create a new transaction
    // Yung id na kinukuha sa parameter is yung account_id
    var account_id = req.params.id;
    var amountOfTransaction = req.body.amount;
    var transaction = {
        amount: req.body.amount,
        account_idx: account_id
    }

    req.getConnection((error, conn) => {
        conn.query('INSERT INTO transaction SET ?', transaction, (err, rows, fields) => {
            if(err){
                res.send(err);
            } else {
                // var transactionid = JSON.stringify(rows.insertId);
                conn.query('SELECT a.balance, c.email, c.contactno FROM account a INNER JOIN customer_account b ON a.account_id = b.account_id INNER JOIN customer c ON b.customer_id = c.customer_id WHERE a.account_id = ' + req.params.id, (err, rows1, fields) => {
                    if (err) {
                        res.send(err);
                    } else {
                        var email = JSON.stringify(rows1[0].email);
                        const contactno = JSON.stringify(rows1[0].contactno);
                        console.log(contactno);
                        var current_balance = JSON.stringify(rows1[0].balance);
                        conn.query('SELECT ' + current_balance + ' + ' + transaction.amount + ' AS new_balance', (err, rows, fields) => {
                            if (err) {
                                res.send(err)
                            } else {
                                var new_balance = JSON.stringify(rows[0].new_balance)
                                conn.query('UPDATE account  SET ? WHERE account_id = ' + account_id, {balance: new_balance}, (err, rows, fields) => {
                                    res.send(rows);
                                })
                                if(new_balance < 1000) {
                                    // Email Integration
                                    let HelperOptions = {
                                        from: 'sampler098@gmail.com',
                                        to: email,
                                        subject: 'Reminder from UnionBank',
                                        text: 'we noticed that your account is below the maintaining balance! we suggest that you go to the nearest unionbank site to deposit so that you wont be charged by unnecessary fees. thank you'
                                      };
                                      
                                      
                                    transporter.sendMail(HelperOptions, (error, info) => {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log("The message was sent!");
                                    console.log(info);
                                    });

                                    // SMS Integration
                                    let text = {
                                        toNumber: contactno,
                                        fromNumber: '+19033293627',
                                        smsBody: 'we noticed that your account is below the maintaining balance! we suggest that you go to the nearest unionbank site to deposit so that you wont be charged by unnecessary fees. thank you',
                                        apiToken: '84kbya'
                                    };

                                    puretext.send(text, function (err, response) {
                                        if(err) console.log(err);
                                        else console.log(response)
                                    })

                                }
                            }
                        })
                    }
                })
            }
        })
    })
})

// Money Transfer

router.post('/transfer/:id', (req, res)=>{
    // yung ID dito is yung account_id nung sender.

    var money_transfer = {
        account_idx: req.body.account_id,
        amount: req.body.amount,
        message: req.body.message
    }

    var account_id = money_transfer.account_idx;
    var amount = money_transfer.amount;
    var message = money_transfer.message;

    console.log(`INFO: ${account_id}, ${amount}, ${message}`);


    var endpoint = nem.model.objects.create('endpoint')(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

    req.getConnection((error, conn) => {
        conn.query('SELECT account.addressKey FROM account WHERE account.account_id = ' + account_id, (err, rows, fields) =>{
            if(err){
                res.send(err);
            } else {
                var receiver_addressKey = rows[0].addressKey;

                conn.query('SELECT account.keyPair, account.addressKey FROM account WHERE account.account_id =' + req.params.id, (err, rows, fields) => {
                    if(err){
                        res.send(err);
                    } else {

                        var sender_keyPair = rows[0].keyPair;
                        var sender_addressKey = rows[0].addressKey;
                        console.log(sender_keyPair);
                        console.log(sender_addressKey);

                        var common = nem.model.objects.create('common')('', sender_keyPair);
                        const transferTransaction = nem.model.objects.create('transferTransaction')(receiver_addressKey, amount, message);
                        const preparedTransaction = nem.model.transactions.prepare('transferTransaction')(common, transferTransaction, nem.model.network.data.testnet.id);

                        nem.model.transactions.send(common, preparedTransaction, endpoint).then(
                            function(res) {
                                console.log(res);
                            },
                            function(err) {
                                console.log(err);
                            }
                        )

                    }

                })
                
            }
        } )
        
    })
})

// Edit a transaction

// Delete a transaction
router.delete('/:id', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('DELETE FROM customer WHERE customer_id = ' + req.params.id, (err, result) => {
            if(err){
                res.send(err);
            } else {
                res.send(result);
            }
        })
    })
})

module.exports = router;