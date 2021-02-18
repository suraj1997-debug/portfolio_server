const mongoose = require('mongoose');
var resumeModule = require('../../modules/resume');
const env = require('dotenv');

env.config();

exports.addResume=(req,res)=>{
    const {
        FullName,
        Designation,
        Address,
        Contact,
        Email,
        SkillSets,
        Interests,
    PersonalStrengths,
    Social,
    About,
    Internship,
    Education,
    Projects,
    Achievements
    }  = req.body;

    var resumeDetails = new resumeModule({
        FullName,
        Designation,
        Address,
        Contact,
        Email,
        SkillSets,
        Interests,
        PersonalStrengths,
        Social,
        About,
        Internship,
        Education,
        Projects,
        Achievements
    })

    resumeDetails.save()
    .then(data=>{
        res.status(201).json({
            message:"Resume Added Successfully",
            resume:data
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
}

exports.getResume = (req,res) =>{
    resumeModule.find({})
    .exec()
    .then(data=>{
        res.status(200).json({
            message:"OK",
            getResume:data
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
}


exports.addProfile =(req,res)=>{

    var id= req.body._id;
    var profilepic =    req.file.filename;
    resumeModule.findById(id,(err,data)=>{

        data.profile = profilepic?profilepic:data.profile;
        
     data.save()
    .then(doc=>{
        res.status(201).json({
            message:"Profile image updated Successfully!!",
            profile:doc
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
})
}