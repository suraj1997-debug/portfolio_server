const mongoose = require('mongoose');
const projectCatModule = require('../../modules/projectCategory');
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
    
    const getCategories=projectCatModule.find({})
    
    getCategories.exec()
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




