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
var TeleSignSDK = require('telesignsdk');
const customerId = "B8CCFAD2-A0D3-4AD4-B9DE-297A264EB27C";
const apiKey = "LDAcp+tX0PS+CYmC1aC9zJM0u94cTCNX2wcU2ur9tGY/AKLdcHudzhEq8YIXAr4/3XlO8yGnItYI7a733y5G6A==";
const rest_endpoint = "https://rest-api.telesign.com";
const timeout = 10*1000; // 10 secs
const client = new TeleSignSDK( customerId,
    apiKey,
    rest_endpoint,
    timeout // optional
    // userAgent
);

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
                        var contactno = contactno = JSON.stringify(rows1[0].contactno);
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
                                    const phoneNumber = "+63" + contactno;
                                    const message = "we noticed that your account is below the maintaining balance! we suggest that you go to the nearest unionbank site to deposit so that you won't be charged by unnecessary fees. thank you ";
                                    const messageType = "ARN";

                                    console.log("## MessagingClient.message ##");

                                    function messageCallback(error, responseBody) {
                                        if (error === null) {
                                            console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
                                                ` => code: ${responseBody['status']['code']}` +
                                                `, description: ${responseBody['status']['description']}`);
                                        } else {
                                            console.error("Unable to send message. " + error);
                                        }
                                    }
                                    client.sms.message(messageCallback, phoneNumber, message, messageType);
                                }
                            }
                        })
                    }
                })
            }
        })
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