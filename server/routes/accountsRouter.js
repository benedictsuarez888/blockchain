/**
 * Accounts API Routes
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
                res.log(rows);
                // res.send(rows);
            }
        })
    })
});

//Pull the information of the specific customer
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

//Add an account
router.post('/addCustomer', (req, res) => {
    var customer = {
        name = req.params.name,
        address = req.params.address,
        contactno = req.params.contactno
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


//Edit an account
router.put('/:id', (req, res) => {
    var customer = {
        name = req.params.name,
        address = req.params.address,
        contactno = req.params.contactno
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

//Delete an account - just in case
router.delete('/:id', (req, res) => {
    req.getConnection((error, conn) => {
        conn.query('DELETE customer from customer WHERE customer_id = ' + req.params.id, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
    })
})

module.exports = router;