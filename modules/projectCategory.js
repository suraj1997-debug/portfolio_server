const mongoose = require('mongoose');
const env = require('dotenv');

env.config();

mongoose.connect(process.env.DB_URL,
{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true

}).then(()=>{
    console.log('Database Connected')
});


var conn = mongoose.Collection;

var ProjectCatSchema = new mongoose.Schema({
    Category:{
        type:String,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        index:true,
        unique:true
    }
},{timestamps:true});

var ProjectCatModel = mongoose.model('ProjectCategories',ProjectCatSchema);

module.exports = ProjectCatModel;