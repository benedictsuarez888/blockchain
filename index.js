const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const config = require('./config.js');
const dbOptions = {
  host:       config.database.host,
  user:       config.database.user,
  password:   config.database.password,
  port:       config.database.port, 
  database:   config.database.db
}
const path = require('path');
const bodyParser = require('body-parser');
const indexRouter = require('./server/routes/indexRouter');
const customersRouter = require('./server/routes/customersRouter');
const accountsRouter = require('./server/routes/accountsRouter');
const transactionsRouter = require('./server/routes/transactionsRouter');
const loginRouter = require('./server/routes/loginRouter');
const port = parseInt(process.env.PORT, 10) || 8000;
const expressValidator = require('express-validator');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
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

const app = express();

app.use(myConnection(mysql, dbOptions, 'pool'));
// app.use(connection(mysql, dbOptions, 'single'));

// Log requests to the console.
app.use(morgan('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public')); 

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');

app.use('/', indexRouter);
app.use('/api/login', loginRouter);
app.use('/api/customers', customersRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/transactions', transactionsRouter);

app.use(session({
	secret: '4h432jk34j23847lk324324',
	resave: false,
	saveUninitialized: true
}));

app.use(expressValidator());
app.listen(port, (err) => {
    if(err) { return console.error(err); }
    console.log(`Listening to ${port}...`);
});

app.post('/home', (req, res) => {
    var credentials = {
        username: req.body.username,
        password: req.body.password
    }
    // req.session.name = rows[0].name;
    // req.checkBody('username', 'Name is required').notEmpty();
    // req.checkBody('password', 'Email is required').notEmpty();

    // const errors = req.validationErrors();

    var entered_username =  credentials.username;
    var entered_password = credentials.password;

    req.getConnection((error, conn) => {
        if(conn) {
            conn.query('SELECT account.account_id, account.username, account.password, customer.name  FROM account INNER JOIN customer_account ON account.account_id = customer_account.account_id INNER JOIN customer ON customer_account.customer_id = customer.customer_id WHERE account.username = ? AND account.password = ?', [credentials.username, credentials.password], (err, rows, fields) => {
                if(err) {
                    res.send(err);
                } else {
                    req.session.id = rows[0].account_id;
					req.session.name = rows[0].name;

                    var database_username = rows[0].username;
                    var database_password = rows[0].password;
    
                    if(entered_username == database_username && entered_password == database_password) {
                        res.render("home", {name: req.session.name});
                    } else {
                        res.status(404);
                    }
                }
            })
        } else {
            res.status(404);
        }
    })
})

