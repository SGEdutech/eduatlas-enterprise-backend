const express = require('express');
const path = require('path');
const PORT = require('./config')
	.SERVER.PORT;
const keys = require('../database-and-auth/oauth/_config')
	.keys;
const {
	passport,
	session
} = require('../database-and-auth/oauth/passport-and-session');
const {
	passwordHashMiddleware
} = require('./scripts/hash-password');
require('../database-and-auth/oauth/local');
require('../database-and-auth/oauth/google');
require('../database-and-auth/oauth/facebook');
require('../database-and-auth/database/connection');

const routes = {
	blog: require('../database-and-auth/database/api/blog'),
	event: require('../database-and-auth/database/api/event'),
	school: require('../database-and-auth/database/api/school'),
	tuition: require('../database-and-auth/database/api/tuition'),
	user: require('../database-and-auth/database/api/user'),
	issue: require('../database-and-auth/database/api/issue'),
	auth: require('../database-and-auth/oauth/auth_routes'),
	forgot: require('../database-and-auth/oauth/forgot'),
	solution: require('../database-and-auth/database/api/solution')
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

app.use(passwordHashMiddleware);

app.use(session({
	secret: keys.CookieKey,
	cookie: {
		maxAge: 7 * 24 * 60 * 60 * 1000
	},
	maxAge: Date.now() + (7 * 86400 * 1000)
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/blog', routes.blog);
app.use('/event', routes.event);
app.use('/school', routes.school);
app.use('/tuition', routes.tuition);
app.use('/issue', routes.issue);
app.use('/user', routes.user);
app.use('/auth', routes.auth);
app.use('/forgot', routes.forgot);
app.use('/slept-through-classs', routes.solution);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Yo dawg! Server's at http://localhost:${PORT}`));