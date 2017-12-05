var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

mongoose.connect('mongodb://<psydeep>:<deathmetalgore>@ds155634.mlab.com:55634/astrodb', {useMongoClient: true});

var posibles_valores = ["M","F"];

var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Coloca un email válido"];
				   
var password_validation = {
	validator: function(p){
		return this.password_confirmation == p;
	},
	message: "Las contraseñas no son iguales"			
}

/*--estructura del objeto para Usuario--*/
var user_schema = new Schema({
	name: String,
	username: {type: String,required: true,maxlenght:[50,"Username muy grande"]},
	password: {type: String,minlenght:[8,"El password es muy corto"], validate: password_validation},
	age: {type: Number,min:[18,"La edad no puede ser menor que 18."], max:[100,"La edad no puede ser mayor a 100."]},
	email: {type: String, required: "El correo es obligatorio", match:email_match},
	date: Date,
	sex: {type:String, enum:{values: posibles_valores,message:"Opción no válida"} }
});


user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c = password;
});

var User = mongoose.model("User", user_schema);

module.exports.User = User;



/*	tipo de datos mongodb
	String,Number,Date,Buffer,Boolean,Mixed,Objectid,Array
*/
