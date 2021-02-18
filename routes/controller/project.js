const mongoose = require('mongoose');
var projectModule = require('../../modules/project');
const slugify = require('slugify');
const shortid = require('shortid');
const env = require('dotenv');

env.config();

exports.addProject = (req,res)=>{
    const {
        title,
        type,
        category,
        description,
        url
    } = req.body;
    const { frontend, admindashboard } = req.files;
    // let screenshots = [];

    // screenshots = req.files.map(file=>{
    //     return {img: file.filename}
    // })

    if(frontend.length > 0){
        req.body.frontend = frontend.map((frontendPic,index)=> ({
            img: `${frontendPic.filename}`
        }))
    }

    if(admindashboard.length > 0){
        req.body.admindashboard = admindashboard.map((admindashboardPic,index)=> ({
            img: `${admindashboardPic.filename}`
        }))
    }

    var ProjectDetails = new projectModule({
        projectTitle:title,
        slug:`${slugify(title)}-${shortid.generate()}`,
        category,
        projectType:type,
        description,
        url,
        frontend:req.body.frontend,
        admindashboard:req.body.admindashboard,
        date: new Date()
    });

    ProjectDetails.save()
    .then(project=>{
        res.status(201).json({
            message:"Project Added Successfully",
            project:project,
            files:req.files
        })
    }).catch(error=>{
        res.status(400).json({
            error:error
        })
    })

}

exports.getProjects = (req,res)=>{
    projectModule.find({})
    .select('_id projectTitle slug  projectType description url frontend admindashboard date category')
    .populate({path:'category',select:'_id Category slug'})
    .exec()
    .then(data=>{
        res.status(200).json({
            projects:data
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
}

exports.getprojectBySlug=(req,res)=>{
    const {slug} = req.params;
    projectModule.findOne({slug:slug})
    .exec()
    .then(data=>{
        res.status(200).json({
            message:"Project Founded Successfully",
            project:data
        })
    })
    .catch(error=>{
        res.status(400).json({
            error:error
        })
    })
}