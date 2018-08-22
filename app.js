const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => res.send('<h1>Welcome to Eduatlas Enterprise</h1>'));

app.listen(5500, () => {
    console.log(`Yo dawg! Server's at http://localhost:5500`);
});