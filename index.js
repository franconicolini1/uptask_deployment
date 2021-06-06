const express = require('express');
const routes = require('./routes');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

require('dotenv').config({path: 'variables.env'});

/* Importo helpers */
const helpers = require('./helpers');

/* Importo db */
const db = require('./config/db');
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync() /* Crea la tabla si no existe */
    .then(() => console.log('Conectado al servidor'))
    .catch(e => console.log(e));

const app = express();

app.use(express.static(__dirname + '/public'));
/* Seteo Pug */
app.set('view engine', 'pug');

app.use(flash());

app.use(cookieParser());

app.use(session({
    secret: 'superSecreto', // Solo porque es obligatorio.
    resave: false, // Los ultimos dos mantienen la sesión activa.
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})

app.use(express.urlencoded({extended: true}));

/* Agrego views al proyecto */
app.set('views', path.join(__dirname, '/views'))

app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 10000;

app.listen(port, host, () => {
    console.log('EL SERVIDOR ESTA FUNCIONANDO');
})

require('./handlers/email');