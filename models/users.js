var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var commentSchema = new Schema({
    id: Number,
    userName: { type: String, required: true },
    content: { type: String, required: true }
})

var postSchema = new Schema({
        id: Number,
        userName: { type: String, required: true },
        content: { type: String, required: true },
        commentedTotal: { type: Number, required: true },
        comment: [commentSchema],
        likes: [],
        time: Date
    })
    /**
     * Note that the database was loaded with data from a JSON file into a
     * collection called testUsers.
     */
var userSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    birthday: { type: Date },
    gender: String,
    introduction: String,
    password: String,
    postedTotal: Number,
    follow: [],
    followers: [],
    posts: [postSchema],
    admin: Boolean
}, {
    collection: "users"
})

mongoose.connect("mongodb://localhost/usersdb");

module.exports = mongoose.model('Users', userSchema);
