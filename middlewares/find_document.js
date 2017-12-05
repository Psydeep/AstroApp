var Documento = require("../models/documentos");
var owner_check = require("./document_permission");

module.exports = function(req,res,next){
	Documento.findById(req.params.id)
			 .populate("creator")
			 .exec(function(err,documento){
			 	if(documento != null && owner_check(documento,req,res)){
			 		res.locals.documento = documento;
			 		next();
			 	}else {
			 		res.redirect("/app");
			 	}
			 })
}