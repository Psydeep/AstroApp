let express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	mongoose = require('mongoose'),
	formidable = require('express-formidable'),
	RedisStore = require('connect-redis')(session),
	realtime = require('./realtime'),
	methodOverride = require("method-override"),
	http = require("http"),
	util = require('util'),
	mongooose_middleware = require('mongoose-middleware').initialize(mongoose);

let index = require('./routes/index');
let users = require('./routes/users');
let session_middleware = require('./middlewares/session');
let Publicacion = require('./models/publicaciones');
let app = express();
mongoose.Promise = global.Promise;
let server = http.Server(app);

var sessionMiddleware = session({
    store: new RedisStore({}),
    secret: "astro ultra secret word"
});

realtime(server, sessionMiddleware);

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/public', express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use(methodOverride("_method"));

app.get("/", function(req, res) {
    Publicacion.find()
        .sort('-1')
        .exec(function(err, publicacion) {
            if (err) { console.log(err); }
            res.render("index", { publicaciones: publicacion });
        });
});

/*---APP--*/


app.use(sessionMiddleware);

//app.use(formidable.parse({ keepExtensions: true }));

app.get("/signup", function(req, res) {
    User.find(function(err, doc) {
        console.log(doc);
        res.render("signup");
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

/*Otras rutas sin acceso a datos*/
app.get("/services", function(req, res) {
    res.render("services");
});
app.get("/contacts", function(req, res) {
    res.render("contacts");
});
app.get("/about", function(req, res) {
    res.render("about");
});
app.get("/queries", function(req, res) {
    res.render("queries");
});


app.post("/users", function(req, res) {
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation,
        username: req.body.username
    });

    //calback, guarda los datos en la base de datos
    user.save().then(function(us) {
        res.redirect("login");
        console.log(String("Usuario guardado exitosamente"));
    }, function(err) {
        if (err) {
            console.log(String(err));
            res.send("Error al guardar la información");
        }
    });
});

app.post("/sessions", function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
            res.render("login", { error: 'Correo o contraseña invalido' }, console.log(String('Correo o contraseña invalido')));
        } else {
            if (req.body.password === user.password) {
                req.session.user_id = user._id;
                res.redirect("/app");
            } else {
                res.render("login", { error: 'Correo o contraseña invalido' }, console.log(String('Correo o contraseña invalido')));
            }
        }
    });
});

app.post("/logout", function(req, res) {
    req.session.destroy(function(err) {
        if (err) { console.log(err); } else {
            res.redirect('/');
        }
    });
});

app.use("/app", session_middleware);

// catch 404 and forward to error handler
//app.use((req, res, next) => {
//	var err = new Error('Not Found');
//	err.status = 404;
//	next(err);
//});

// error handler
//app.use((err, req, res, next) => {
  // set locals, only providing error in development
 // res.locals.message = err.message;
 // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
 // res.status(err.status || 500);
 // res.render('error');
//});

module.exports = app;
