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

// // Add a transaction
// router.post('/:id', (req, res) => {
//     // create a new transaction
//     // Yung id na kinukuha sa parameter is yung account_id
//     var account_id = req.params.id;
//     var amountOfTransaction = req.body.amount;
//     var transaction = {
//         amount: req.body.amount,
//         account_idx: account_id
//     }

//     req.getConnection((error, conn) => {
//         conn.query('INSERT INTO transaction SET ?', transaction, (err, rows, fields) => {
//             if(err){
//                 res.send(err);
//             } else {
//                 // var transactionid = JSON.stringify(rows.insertId);
//                 conn.query('SELECT a.balance, c.email, c.contactno FROM account a INNER JOIN customer_account b ON a.account_id = b.account_id INNER JOIN customer c ON b.customer_id = c.customer_id WHERE a.account_id = ' + req.params.id, (err, rows1, fields) => {
//                     if (err) {
//                         res.send(err);
//                     } else {
//                         var email = JSON.stringify(rows1[0].email);
//                         const contactno = JSON.stringify(rows1[0].contactno);
//                         console.log(contactno);
//                         var current_balance = JSON.stringify(rows1[0].balance);
//                         conn.query('SELECT ' + current_balance + ' + ' + transaction.amount + ' AS new_balance', (err, rows, fields) => {
//                             if (err) {
//                                 res.send(err)
//                             } else {
//                                 var new_balance = JSON.stringify(rows[0].new_balance)
//                                 conn.query('UPDATE account  SET ? WHERE account_id = ' + account_id, {balance: new_balance}, (err, rows, fields) => {
//                                     res.send(rows);
//                                 })
//                                 if(new_balance < 1000) {
//                                     // Email Integration
//                                     let HelperOptions = {
//                                         from: 'sampler098@gmail.com',
//                                         to: email,
//                                         subject: 'Reminder from UnionBank',
//                                         text: 'we noticed that your account is below the maintaining balance! we suggest that you go to the nearest unionbank site to deposit so that you wont be charged by unnecessary fees. thank you'
//                                       };
                                      
                                      
//                                     transporter.sendMail(HelperOptions, (error, info) => {
//                                     if (error) {
//                                         return console.log(error);
//                                     }
//                                     console.log("The message was sent!");
//                                     console.log(info);
//                                     });

//                                     // SMS Integration
//                                     let text = {
//                                         toNumber: contactno,
//                                         fromNumber: '+19033293627',
//                                         smsBody: 'we noticed that your account is below the maintaining balance! we suggest that you go to the nearest unionbank site to deposit so that you wont be charged by unnecessary fees. thank you',
//                                         apiToken: '84kbya'
//                                     };

//                                     puretext.send(text, function (err, response) {
//                                         if(err) console.log(err);
//                                         else console.log(response)
//                                     })

//                                 }
//                             }
//                         })
//                     }
//                 })
//             }
//         })
//     })
// })

// Money Transfer
router.post('/transfer', (req, res)=>{
    // yung ID dito is yung account_id nung sender.

    var money_transfer = {
        account_idsender: req.body.account_idsender,
        account_id: req.body.account_idx,
        amount: req.body.amount
    }

    var sender_account_id = money_transfer.account_idsender;
    var account_id = money_transfer.account_id;
    var amount1 = money_transfer.amount;
    var amount = money_transfer.amount/52.73/0.0945;
    // var message = money_transfer.message;

    console.log(`Sender Account ID: ${sender_account_id} Receiver Account ID: ${account_id}, Amount: ${amount}`);


    var endpoint = nem.model.objects.create('endpoint')(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

    req.getConnection((error, conn) => {
        conn.query('SELECT account.addressKey FROM account WHERE account.account_id = ' + account_id, (err, rows, fields) =>{
            if(err){
                res.send(err);
            } else {
                var receiver_addressKey = rows[0].addressKey;
                console.log(receiver_addressKey);

                conn.query('SELECT account.keyPair, account.addressKey, customer.email, customer.contactno FROM account INNER JOIN customer_account ON account.account_id = customer_account.account_id INNER JOIN customer ON customer_account.customer_id = customer.customer_id WHERE account.account_id =' + sender_account_id, (err, rows, fields) => {
                    if(err){
                        res.send(err);
                    } else {

                        var sender_keyPair = rows[0].keyPair;
                        var sender_addressKey = rows[0].addressKey;
                        var sender_addressKey1 = JSON.stringify(rows[0].addressKey);
                        var sender_email = rows[0].email;
                        var sender_contactno = rows[0].contactno;
                        console.log(sender_keyPair);
                        console.log(sender_addressKey);

                        var common = nem.model.objects.create('common')('', sender_keyPair);
                        const transferTransaction = nem.model.objects.create('transferTransaction')(receiver_addressKey, amount, "");
                        const preparedTransaction = nem.model.transactions.prepare('transferTransaction')(common, transferTransaction, nem.model.network.data.testnet.id);

                        nem.model.transactions.send(common, preparedTransaction, endpoint).then(
                            function(response) {
                                res.send(response);
                            },
                            function(err) {
                                res.send(err);
                            }
                        )

                        nem.com.requests.account.data(endpoint, sender_addressKey).then(
                            function(response1){
                                var iBalance = response1.account.balance;
                                var fmt = nem.utils.format.nemValue(iBalance);
                                var tBalance = fmt[0] + "." + fmt[1];
                                var balance = Math.round(tBalance*10)/10;
                                var pesoValue = Math.round(balance*0.0945*52.73);
                                console.log(pesoValue)
                                
                                if(pesoValue < 1000) {
                                    // Email Integration
                                    let HelperOptions = {
                                        from: 'sampler098@gmail.com',
                                        to: sender_email,
                                        subject: 'Reminder from UnionBank',
                                        text: `You've sent an amount of ${amount1} to ${account_id}. Your current balance is ${pesoValue}. We have noticed that your account is below the maintaining balance. We suggest that you go to the nearest UnionBank branch to deposit so that you would not be charged by unnecessary fees. Thank you!`
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
                                        toNumber: sender_contactno,
                                        fromNumber: '+19033293627',
                                        smsBody: `You've sent an amount of ${amount1} to ${account_id}. Your current balance is ${pesoValue}. We have noticed that your account is below the maintaining balance. We suggest that you go to the nearest UnionBank branch to deposit so that you would not be charged by unnecessary fees. Thank you!`,
                                        apiToken: '84kbya'
                                    };

                                    puretext.send(text, function (err, response) {
                                        if(err) console.log(err);
                                        else console.log(response)
                                    })

                                } else {
                                    
                                    let HelperOptions = {
                                        from: 'sampler098@gmail.com',
                                        to: sender_email,
                                        subject: 'Transaction Notification from UnionBank',
                                        text: `You've sent an amount of ${amount1} to ${account_id}. Your current balance is ${pesoValue}. Thank you.`
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
                                        toNumber: sender_contactno,
                                        fromNumber: '+19033293627',
                                        smsBody: `You've sent an amount of ${amount1} to ${account_id}. Your current balance is ${pesoValue}. Thank you.`,
                                        apiToken: '84kbya'
                                    };

                                    puretext.send(text, function (err, response) {
                                        if(err) console.log(err);
                                        else console.log(response)
                                    })
                                }

                            },
                            function(err1){
                                console.log(err1);
                            });
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