const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const env = require('dotenv');

env.config();

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.fp08a.mongodb.net/${process.env.MONGODB_DATABASE}`,
{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Database Connected");
});

var conn = mongoose.Collection;

var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
        min:3,
        max:20
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
        min:3,
        max:20
    },
    username:{
        type:String,
        required:true,
        trim:true,
        index:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    hash_password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    contactNumber:{ type:String },
    profilePicture:{ type:String }
},{timestamps:true});


userSchema.virtual('fullname')
.get(function(){
    return `${this.firstname} ${this.lastname}`
})


userSchema.methods = {
    authenticate : async function(password){
        return await bcrypt.compare(password,this.hash_password);
    }
}

var userModel = mongoose.model('users',userSchema);

module.exports = userModel;