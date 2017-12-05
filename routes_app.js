var express = require("express");
var Documento = require("./models/documentos");
var Publicacion = require("./models/publicaciones");
var router = express.Router();
var fs = require("fs");
var redis = require("redis");
var client = redis.createClient();
var User = require("./models/user").User;
var document_finder_middleware = require("./middlewares/find_document");
var publicacion_finder_middleware = require("./middlewares/find_publicacion");

router.get("/", function(req, res) {
    Documento.find({ creator: res.locals.user._id })
        .populate("creator")
        .exec(function(err, documentos) {
            if (err) console.log(err);
            res.render("app/home", { documentos: documentos });
        })
});

router.get("/publicaciones/mis_publicaciones", function(req, res) {
    Publicacion.find({ creator: res.locals.user._id })
        .populate("creator")
        .exec(function(err, publicaciones) {
            if (err) console.log(err);
            res.render("app/publicaciones/my_notices", { publicaciones: publicaciones });
        })
});

router.get("/documentos/new", function(req, res) {
    res.render("app/documentos/new");
});

router.all("/documentos/:id*", document_finder_middleware);

router.get("/documentos/:id/edit", function(req, res) {
    res.render("app/documentos/edit");
});


router.route("/documentos/:id")
    .get(function(req, res) {
        res.render("app/documentos/show");
    })
    .put(function(req, res) {
        User.findOne({ password: req.body.password }, function(err, user) {
            if (!user) {
                res.render('app/documentos/edit', { error: 'Contraseña incorrecta' });
            } else {
                if (req.body.password == user.password) {
                    res.locals.documento.title = req.body.title;
                    res.locals.documento.description = req.body.description;
                    res.locals.documento.age = req.body.age;
                    res.locals.documento.save(function(err) {
                        if (!err) {
                            res.render("app/documentos/show");
                        } else {
                            res.render("app/documentos/edit");
                        }
                    });
                } else {
                    res.render('app/documentos/edit', { error: 'Contraseña incorrecta' });
                }
            }
        });
    })
    .delete(function(req, res) {
        Documento.findOneAndRemove({ _id: req.params.id }, function(err) {
            if (!err) {
                res.redirect("/app/documentos");
            } else {
                console.log(err);
                res.redirect("/app/documentos" + req.params.id);
            }
        });
    });


router.route("/documentos")
    .get(function(req, res) {
        Documento.find({ creator: res.locals.user._id }, function(err, documentos) {
            if (err) { res.redirect("/app"); return; }
            res.render("app/documentos/index", { documentos: documentos });
        });
    })
    .post(function(req, res) {
        var extension = req.body.archive.name.split(".").pop();
        User.findOne({ password: req.body.password }, function(err, user) {
            if (!user) {
                res.render("app/documentos/new", { error: 'Contraseña incorrecta' });
            } else {
                if (req.body.password == user.password) {
                    var data = {
                        title: req.body.title,
                        description: req.body.description,
                        creator: res.locals.user._id,
                        age: req.body.age,
                        extension: extension
                    }
                    var documento = new Documento(data);
                    documento.save(function(err) {
                        if (!err) {
                            var docJSON = {
                                "id": documento._id,
                                "title": documento.title,
                                "description": documento.description,
                                "creator": documento.creator,
                                "age": documento.age,
                                "extension": documento.extension
                            };

                            client.publish("documents", JSON.stringify(docJSON));
                            fs.rename(req.body.archive.path, "public/documentos/" + documento._id + "." + extension);
                            res.redirect("/app/documentos/" + documento._id)
                        } else {
                            console.log(documento);
                            res.render(err);
                        }
                    });

                } else {
                    res.render("app/documentos/new", { error: 'Contraseña incorrecta' });
                }
            }

        });
    });


router.get("/publicaciones/new", function(req, res) {
    res.render("app/publicaciones/new");
});

router.get("/publicaciones/mis_publicaciones", function(req, res) {
    res.render("app/publicaciones/my_notices");
});

router.all("/publicaciones/:id*", publicacion_finder_middleware);

router.get("/publicaciones/:id/edit", function(req, res) {
    res.render("app/publicaciones/edit");
});


router.route("/publicaciones/:id")
    .get(function(req, res) {
        res.render("app/publicaciones/show");
    })
    .put(function(req, res) {
        User.findOne({ password: req.body.password }, function(err, user) {
            if (!user) {
                res.render('app/publicaciones/edit', { error: 'Contraseña incorrecta' });
            } else {
                if (req.body.password == user.password) {
                    res.locals.publicacion.title = req.body.title;
                    res.locals.publicacion.description = req.body.description;
                    res.locals.publicacion.age = req.body.age;
                    res.locals.publicacion.save(function(err) {
                        if (!err) {
                            res.render("app/publicaciones/show");
                        } else {
                            res.render("app/publicaciones/edit");
                        }
                    });
                } else {
                    res.render('app/publicaciones/edit', { error: 'Contraseña incorrecta' });
                }
            }
        });
    })

.delete(function(req, res) {
    Publicacion.findOneAndRemove({ _id: req.params.id }, function(err) {
        if (!err) {
            res.redirect("/app/publicaciones");
        } else {
            console.log(err);
            res.redirect("/app/publicaciones" + req.params.id);
        }
    });
});


router.route("/publicaciones")
    .get(function(req, res) {
        Publicacion.find({ creator: res.locals.user._id }, function(err, publicaciones) {
            if (err) { res.redirect("/app"); return; }
            res.render("app/publicaciones/index", { publicaciones: publicaciones });
        });
    })
    .post(function(req, res) {
        var extension = req.body.archive.name.split(".").pop();
        User.findOne({ password: req.body.password }, function(err, user) {
            if (!user) {
                res.render("app/publicaciones/new", { error: 'Contraseña incorrecta' });
            } else {
                if (req.body.password == user.password) {
                    var data = {
                        title: req.body.title,
                        description: req.body.description,
                        creator: res.locals.user._id,
                        age: req.body.age,
                        extension: extension
                    }
                    var publicacion = new Publicacion(data);
                    publicacion.save(function(err) {
                        if (!err) {
                            var noticeJSON = {
                                "id": publicacion._id,
                                "title": publicacion.title,
                                "description": publicacion.description,
                                "creator": publicacion.creator,
                                "age": publicacion.age,
                                "extension": publicacion.extension
                            };

                            client.publish("notices", JSON.stringify(noticeJSON));
                            fs.rename(req.body.archive.path, "public/publicaciones/" + publicacion._id + "." + extension);
                            res.redirect("/app/publicaciones/" + publicacion._id)
                        } else {
                            console.log(publicacion);
                            res.render(err);
                        }
                    });
                } else {
                    res.render("app/publicaciones/new", { error: 'Contraseña incorrecta' });
                }
            }
        });

    });

module.exports = router;