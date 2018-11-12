/**
 * Customers API Routes
 */

const express = require('express');
const router = express.Router();

// CUSTOMERS CRUDE

// Pull all the customers
router.get('/', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM customer', (err, rows, fields) => {
            if(err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        })
    })
});

// Get all the accounts of a specific customer. 
// Ilabas lahat ng accounts nung isang customer.
router.get('/accounts/:id', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT a.*, c.* FROM bank.customer a INNER JOIN customer_account b ON a.customer_id = b.customer_id  INNER JOIN account c ON b.account_id = c.account_id WHERE a.customer_id =' + req.params.id, (err, rows, fields) => {
            if(err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        })
    })
})

// Pull the information of the specific customer
router.get('/:id', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('SELECT * FROM customer WHERE customer_id = ' + req.params.id, (err, rows, fields) => {
            if(err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        })
    })
});

// Add a customer
router.post('/', (req, res) => {
    // create new customer
    var customer = {
        name: req.body.name,
        address: req.body.address,
        contactno: req.body.contactno
    }

    req.getConnection((error, conn) => {
        conn.query('INSERT INTO customer SET ?', customer, (err, rows, fields) => {
            if(err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        })
    })
})


// Edit an customer
router.put('/:id', (req, res) => {
    // get the data from the request and insert it in the customer variable.
    var customer = {
        name: req.body.name,
        address: req.body.address,
        contactno: req.body.contactno
    }

    req.getConnection((error, conn) => {
        conn.query('UPDATE customer SET ? WHERE customer_id = ' + req.params.id, customer, (err, result) => {
            if(err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
    })
})

// Delete an customer - just in case kung meron
router.delete('/:id', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('DELETE FROM customer WHERE customer_id = ' + req.params.id, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
    })
})

module.exports = router;