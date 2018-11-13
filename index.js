const express = require('express');
const app = express();
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
const port = parseInt(process.env.PORT, 10) || 8000;
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
app.use('/api/customers', customersRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/transactions', transactionsRouter);

app.listen(port, (err) => {
    if(err) { return console.error(err); }
    console.log(`Listening to ${port}...`);
});