var mongoose = require('mongoose');

var Schema = mongoose.Schema;



/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called testUsers.
 */
var userSchema = new Schema(
	{
		userName:{type: String, required:true, unique:true},
		birthday:{type: Date},
		gender:String,
		introduction:String,
		password:String,
		postedTotal:Number,
		follow:{
			userName: {type: String, required:true, unique:true},
		},
		followers:{
			userName: {type: String, required:true, unique:true},
		},
		posts:{
			id:Number,
			userName: {type: String, required:true},
			content:{type: String, required:true},
			commentedTotal:Number,
			comment:{
				id:Number,
				userName:{type:String, required:true},
				content:{type: String, required:true},
			},
			likes:{
				userName:{type:String, required:true,unique:true},
			},
			time:Date
		},
		admin: Boolean,
 	},
 	{
 		collection: "users"
 	})

mongoose.connect("mongodb://localhost/usersdb");

module.exports = mongoose.model('Users', userSchema);