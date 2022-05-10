const mongoose = require("mongoose");
// [{"username":"asquareblrn9@gmail.com","fullname":"Opeyemi Afolabi Adeola","age":"85","password":"Grade3"}]
var userSchema = mongoose.Schema(
    {
    username: String,
    fullname: String,
    age: String,
    password: String,
    },
    { timestamps: true }
);

userSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Users= mongoose.model("Users", userSchema);


 
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.Users = Users;

module.exports = db;