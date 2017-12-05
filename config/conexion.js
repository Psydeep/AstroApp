let mongoose = require('mongoose');
mongoose.connect('mongodb://psydeep:deathmetalgore@ds155634.mlab.com:55634/astrodb',{ useMongoClient: true });
//mongoose.connect("mongodb://127.0.0.1:27017/TeleCableDB");

module.exports = mongoose;