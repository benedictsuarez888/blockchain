const express = require('express');
const app = express();
const port = 3000;
const nem = require("nem-sdk").default;

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`The application is listening on port ${port}`));