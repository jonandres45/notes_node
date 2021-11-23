const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
//initiliazations
const app = express();
require('./database');
require('./config/passport');
//settings
app.set('port', process.env.PORT || 3000); //puerto de servidor
app.set('views', path.join(__dirname, 'views')); //__dirname te da el path actual de este archivo
app.engine('hbs', exphbs({ //plantillas con express hand...
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //plantilla de toda la app
    partialsDir: path.join(app.get('views'), 'partials'), //reciclar codigo
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', '.hbs'); //configurar motor de ls vistas

//middleawaers
app.use(express.urlencoded({extended: false})); //recibir datos del usuario, con extended solo voy a recibir datos
app.use(methodOverride('_method'));//sirve para que los formularios puedan enviar mas meotodos no solo put o get
app.use(session({
    secret:'mysecretapp', //palabra secrete
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize()); //validaciones de sesiones con passport
app.use(passport.session());
app.use(flash());
//Global Varaibles
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
//routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/user'));


//static files
app.use(express.static(path.join(__dirname, 'public')));

//server is listenning
app.listen(app.get('port'), ()=>{
    console.log("Server on port", app.get('port'));
});