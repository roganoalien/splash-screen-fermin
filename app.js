const bodyParser = require('body-parser'),
    express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session');

const { config } = require('./src/config/config-app'),
    adminRoutes = require('./src/routes/routes-admin');

const app = express();
// conexión a base de datos
require('./src/config/database');
// Configuración de Passport
require('./src/config/passport');
// Configuración del puerto
app.set('port', process.env.PORT || config.localport);
// Set de las vistas
app.set('views', path.join(__dirname, './src/views'));
// Set del view engine
app.set('view engine', 'pug');
//----------------------
//---- MIDDLEWARES -----
//----------------------
// Favicon problem solution
// app.use(favicon(path.join(__dirname, 'public/favicons', 'favicon.ico')));
// Log de todos los requests
app.use(logger('dev'));
// Sesión guardada con secret
app.use(
    session({
        secret: config.secret,
        resave: true,
        saveUninitialized: true
    })
);
// Inicializamos passport
app.use(passport.initialize());
// Guardamos sesión de passport para evitar request a base de datos
app.use(passport.session());
// Envío de mensajes entre vistas
app.use(flash());
// Variables globales
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
// Seteo de Public folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/vendors', express.static(path.join(__dirname, 'node_modules')));
// Para que express entienda los POST requests
app.use(bodyParser.urlencoded({ extended: true }));
//----------------
//---- ROUTES ----
//----------------
app.get('/', (req, res) => {
    const {
        base_grant_url,
        user_continue_url,
        node_id,
        node_mac,
        gateway_id,
        client_ip,
        client_mac
    } = req.query;
    const userData = {
        base_grant_url,
        user_continue_url,
        node_id,
        node_mac,
        gateway_id,
        client_ip,
        client_mac
    };
    res.render('sections/splash', {
        title: 'Iniciar Sesión',
        redirect: req.query.base_grant_url ? false : true,
        userData
    });
});
app.use(adminRoutes);
app.get('*', function(req, res) {
    res.status(404).render('errors/404');
});
//---------------------
//---- INIT SERVER ----
//---------------------
const server = app.listen(app.get('port'), function() {
    console.log(`Èscuchando http://localhost:${server.address().port}`);
});
