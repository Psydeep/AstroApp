var Publicacion = require("../models/publicaciones");
var owner_check = require("./publicacion_permission");

module.exports = function(req,res,next){
	Publicacion.findById(req.params.id)
			 .populate("creator")
			 .exec(function(err,publicacion){
			 	if(publicacion != null && owner_check(publicacion,req,res)){
			 		res.locals.publicacion = publicacion;
			 		next();
			 	}else {
			 		res.redirect("/app");
			 	}
			 })
}