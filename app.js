var express = require('express'),
//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
	bodyParser = require('body-parser'),

	session = require("express-session"),
	router_app = require("./routes_app"),

	User = require("./models/user").User,
	mongoose = require('mongoose'),
	Documento = require("./models/documentos"),
	Publicacion = require("./models/publicaciones"),

	session_middleware = require("./middlewares/session"),
	formidable = require("formidable"),
	RedisStore = require("connect-redis")(session),

	http = require("http"),
	realtime = require("./realtime"),
	mongoose_middleware = require('mongoose-middleware').initialize(mongoose),


//var index = require('./routes/index');
//var users = require('./routes/users');
	methodOverride = require("method-override");

var app = express();
var server = http.Server(app);

var sessionMiddleware = session({
    store: new RedisStore({}),
    secret: "astro ultra secret word"
});

realtime(server, sessionMiddleware);

app.use("/public", express.static("public"));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

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

http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }
});


app.get("/", function(req, res) {
    console.log(req.session.user_id);
    res.render("index");
});


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
app.use("/app", router_app);

//app.use('/', index);
//app.use('/users', users);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});

// error handler
//app.use(function(err, req, res, next) {
  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});

module.exports = app;
