const express = require('express');
const path = require('path');
const PORT = require('./config')
    .SERVER.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
	console.log(`Yo dawg! Server's at http://localhost:${PORT}`);
});
