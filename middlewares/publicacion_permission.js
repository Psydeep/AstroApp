var Publicacion = require("../models/publicaciones");

module.exports = function(publicacion,req,res){
	//true = tiene permisos
	//false = si no tiene permisos
	if(req.method === "GET" && req.path.indexOf("edit") < 0){
		//ver la imagen
		return true;
	}

	if(req.method === "GET" && req.path.indexOf("./") < 0){
		//ver la imagen
		return true;
	}

	if(typeof publicacion.creator == "undefined") return false;

	if(publicacion.creator._id.toString() == res.locals.user._id){
		return true;
	}
	return false;
}