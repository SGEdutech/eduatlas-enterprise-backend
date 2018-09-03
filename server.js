const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(5500, () => {
	console.log(`Yo dawg! Server's at http://localhost:5500`);
});
