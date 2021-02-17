const mongoose = require("mongoose");
const env = require('dotenv');

env.config();

mongoose.connect(process.env.DB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log("Database Connected");
});

var conn = mongoose.Collection;

var ProjectSchema = new mongoose.Schema({
    projectTitle: {
        type: String,
        required: true,
        min: 3,
        max: 40,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectCategories",
        required: true
    },
    projectType: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    frontend: [
        {
            img: {
                type: String
            }
        }
    ],
    admindashboard: [
        {
            img: {
                type: String
            }
        }
    ],
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

var ProjectModel = mongoose.model("projects", ProjectSchema);

module.exports = ProjectModel;
