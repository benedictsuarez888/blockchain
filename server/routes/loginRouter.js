/**
 * API Login Router
 */

const express = require('express');
const router = express.Router();

// Log in
// router.post('/credentials', (req, res) => {
//     var credentials = {
//         username: req.body.username,
//         password: req.body.password
//     }
//     // req.session.name = rows[0].name;
//     // req.checkBody('username', 'Name is required').notEmpty();
//     // req.checkBody('password', 'Email is required').notEmpty();

//     // const errors = req.validationErrors();

//     var entered_username =  credentials.username;
//     var entered_password = credentials.password;

//     req.getConnection((error, conn) => {
//         if(conn) {
//             conn.query('SELECT account.account_id, account.username, account.password, customer.name  FROM account INNER JOIN customer_account ON account.account_id = customer_account.account_id INNER JOIN customer ON customer_account.customer_id = customer.customer_id WHERE account.username = ? AND account.password = ?', [credentials.username, credentials.password], (err, rows, fields) => {
//                 if(err) {
//                     res.send(err);
//                 } else {
//                     // req.session.id = rows[0].account_id;
//                     // req.session.name = rows[0].name;
//                     var database_username = rows[0].username;
//                     var database_password = rows[0].password;
    
//                     if(entered_username == database_username && entered_password == database_password) {
//                         res.redirect("/home");
//                     } else {
//                         res.status(404);
//                     }
//                 }
//             })
//         } else {
//             res.status(404);
//         }
//     })
// })

module.exports = router;