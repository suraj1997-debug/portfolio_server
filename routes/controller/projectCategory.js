const mongoose = require('mongoose');
const projectCatModule = require('../../modules/projectCategory');
const projectModule = require('../../modules/project');
const slugify = require('slugify');
const shortid = require('shortid');



exports.addcat = (req,res)=>{

    var CategoryDetails = new projectCatModule({
        Category:req.body.category,
        slug:`${slugify(req.body.category)}-${shortid.generate()}`
    });

    CategoryDetails.save()
    .then(data=>{
        res.status(201).json({
            message:"Project Category Added Successfully",
            category:data
        })
    }).catch(error=>{
        res.status(400).json({
            error:error
        })
    })
}


exports.getProjectCategories = (req,res)=>{
    
    projectCatModule.find({})
    .sort({createdAt:1})
    .then(categories=>{
        res.status(200).json({
            categories:categories
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
}


exports.updateCat = (req,res) =>{
    const {_id,Category} = req.body;
    
    projectCatModule.findById(_id,(err,data)=>{
        data.Category = Category ? Category : data.Category;

        data.save()
        .then(data=>{
            res.status(201).json({
                message:"Category Updated Successfully",
                category:data
            })
        })
        .catch(err=>{
            res.status(400).json({
                error:err
            })
        })
    });
}

exports.deleteCat = (req,res) =>{
    const {_id} = req.body;

    projectCatModule.findByIdAndDelete({_id:_id})
    .then(data=>{
        res.status(202).json({
            message:"Category Deleted Successfully",
            deletedCat:data
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
}

exports.getProjectCategoryBySlug = (req,res) => {
   const {slug} = req.params;
 
    projectCatModule.findOne({slug:slug})
    .then(category=>{
        res.status(200).json({
            category:category
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
}

exports.getProjectCategoryByProjectSlug = (req,res) => {
    const {slug} = req.params;
 
    projectModule.findOne({slug:slug})
    .then(data=>{
        projectCatModule.findOne({_id:data.category})
        .then(category=>{
            res.status(200).json({
                category:category
            })
        })
        .catch(err=>{
            res.status(400).json({
                error:err
            })
        })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
        })
    })
}
 



