let mongoose 	= require("mongoose");
let Schema		= mongoose.Schema;

var publicacion_schema	= new Schema({
	title:{type:String, required:true},
	description:{type:String},
	age:{type:Number},
	creator:{type: Schema.Types.ObjectId, ref: "User" },
	extension:{type:String, required:true}
});

let Publicacion	= mongoose.model("Publicacion",publicacion_schema);

module.exports	= Publicacion;