var mongoose 	= require("mongoose");
var Schema		= mongoose.Schema;

var documento_schema	= new Schema({
	title:{type:String, required:true},
	description:{type:String},
	age:{type:Number},
	creator:{type: Schema.Types.ObjectId, ref: "User" },
	extension:{type:String, required:true}
});

var Documento	= mongoose.model("Documento",documento_schema);

module.exports	= Documento;