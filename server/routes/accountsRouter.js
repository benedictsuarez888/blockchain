/**
 * Accounts API Routes
 */

const express = require('express');
const router = express.Router();

// ACCOUNTS CRUDE

// Pull all the accounts
router.get('/', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM account', (err, rows, fields) => {
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
        conn.query('SELECT a.account_id, c.name, a.type_id, a.balance, a.interest_rate, a.overdraft FROM bank.account a INNER JOIN customer_account b ON a.account_id = b.account_id  INNER JOIN customer c ON b.customer_id = c.customer_id WHERE a.account_id =' + req.params.id, (err, rows, fields) => {
            if(err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        })
    })
});

// Add an account
router.post('/', (req, res) => {
    // create new account
    var account = {
        type: req.params.type,
        balance: req.params.balance,
        interest_rate: req.params.interest_rate,
        overdraft: req.params.overdraft,
    }

    req.getConnection((error, conn) => {
        conn.query('INSERT INTO account SET ?', account, (err, rows, fields) => {
            if(err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        })
    })
})


// Edit an account
router.put('/:id', (req, res) => {
    // get the data from the request and insert it in the account variable.
    var account = {
        type: req.params.type,
        balance: req.params.balance,
        interest_rate: req.params.interest_rate,
        overdraft: req.params.overdraft,
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