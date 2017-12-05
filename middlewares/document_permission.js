var Documento = require("../models/documentos");

module.exports = function(documento,req,res){
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

	if(typeof documento.creator == "undefined") return false;

	if(documento.creator._id.toString() == res.locals.user._id){
		return true;
	}
	return false;
}