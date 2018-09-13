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
    eventPicsMiddleware,
    schoolPicsMiddleware,
    tuitionPicsMiddleware,
    userCoverPicMiddleware,
    solutionPdfMiddleware
} = require('../database-and-auth/storage-engine');
const MongoDBStore = require('connect-mongodb-session')(session);
const {
	passwordHashMiddleware
} = require('./scripts/hash-password');
const {redirectUnknownHostMiddlewareEduatlasEnterprise} =
	require('../database-and-auth/scripts/redirect-unknown-host-middleware');
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
	solution: require('../database-and-auth/database/api/solution'),
    promotedHome: require('../database-and-auth/database/api/promoted-home'),
    promotedSearch: require('../database-and-auth/database/api/promoted-search'),
    promotedRelated: require('../database-and-auth/database/api/promoted-related'),
    course: require('../database-and-auth/database/api/course'),
    batch: require('../database-and-auth/database/api/batch'),
    forumPost: require('../database-and-auth/database/api/forum-post'),
    forumComment: require('../database-and-auth/database/api/forum-comment')
};

const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/tempDb',
    collection: 'sessions'
});

store.on('connected', () => console.log('Sessions has connected to the database'));

const app = express();

app.use(redirectUnknownHostMiddlewareEduatlasEnterprise);

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

app.use(session({
	secret: keys.CookieKey,
	cookie: {
		maxAge: 7 * 24 * 60 * 60 * 1000,
		domain: '.eduatlas.com'
	},
	maxAge: Date.now() + (7 * 86400 * 1000),
    store: store
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(passwordHashMiddleware);

app.use('/event', eventPicsMiddleware);
app.use('/school', schoolPicsMiddleware);
app.use('/tuition', tuitionPicsMiddleware);
app.use('/user', userCoverPicMiddleware);
app.use('/slept-through-class', solutionPdfMiddleware);

app.use('/blog', routes.blog);
app.use('/event', routes.event);
app.use('/school', routes.school);
app.use('/tuition', routes.tuition);
app.use('/issue', routes.issue);
app.use('/user', routes.user);
app.use('/auth', routes.auth);
app.use('/forgot', routes.forgot);
app.use('/slept-through-classs', routes.solution);
app.use('/promoted-home', routes.promotedHome);
app.use('/promoted-search', routes.promotedSearch);
app.use('/promoted-related', routes.promotedRelated);
app.use('/course', routes.course);
app.use('/batch', routes.batch);
app.use('/forum-post', routes.forumPost);
app.use('/forum-comment', routes.forumComment);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Yo dawg! Server's at http://localhost:${PORT}`));