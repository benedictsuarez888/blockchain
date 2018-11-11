/**
 * Transactions API Routes
 */

const express = require('express');
const router = express.Router();

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

// Get a transaction
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

// Add a transaction
router.post('/', (req, res) => {
    // create a new transaction
    var transaction = {
        amount: req.params.amount,
        account_idx: req.params.account_idx
    }

    req.getConnection((error, conn) => {
        conn.query('INSERT INTO customer SET ?', transaction, (err, rows, fields) => {
            if(err){
                res.send(err);
            } else {
                res.send(rows);
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